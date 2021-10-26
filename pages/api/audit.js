const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default function handler(req, res) {
  const audit = async (url, type) => {
    const chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless']
    })

    const flags = {
      port: chrome.port,
      output: 'json',
      onlyCategories: [
        'performance',
        'accessibility',
        'best-practices',
        'seo',
      ],
      logLevel: 'info',
    }

    // Desktop configurations. Default is mobile
    const config = {
      extends: 'lighthouse:default',
      settings: {
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        }
      }
    }

    let runnerResult
    let runnerResultMobile
    try {
      runnerResult = await lighthouse(url, flags, config);
      runnerResultMobile = await lighthouse(url, flags);
    } catch(err) {
      if(err.code === 'INVALID_URL') {
        return res.status(500).json({ error: `${err?.code} - example: https://www.google.com` })
      }

      return res.status(500).json(err)
    }

    await chrome.kill();

    // Parse data
    const date = Date.now()
    const accessibility = parseInt(runnerResult?.lhr?.categories?.accessibility?.score * 100)
    const bestpractices = parseInt(runnerResult?.lhr?.categories['best-practices']?.score * 100)
    const cls = runnerResult?.lhr?.audits['cumulative-layout-shift']?.score * 10
    const fcp = runnerResult?.lhr?.audits['first-contentful-paint']?.score * 10
    const lcp = runnerResult?.lhr?.audits['largest-contentful-paint']?.score * 10
    const performance = parseInt(runnerResult?.lhr?.categories?.performance?.score * 100)
    const seo = parseInt(runnerResult?.lhr?.categories?.seo?.score * 100)
    const si = runnerResult?.lhr?.audits['speed-index']?.score * 10
    const tbt = runnerResult?.lhr?.audits['total-blocking-time']?.score * 10
    const tti = runnerResult?.lhr?.audits?.interactive?.score * 10

    const accessibility_mobile = parseInt(runnerResultMobile?.lhr?.categories?.accessibility?.score * 100)
    const bestpractices_mobile = parseInt(runnerResultMobile?.lhr?.categories['best-practices']?.score * 100)
    const cls_mobile = runnerResultMobile?.lhr?.audits['cumulative-layout-shift']?.score * 10
    const fcp_mobile = runnerResultMobile?.lhr?.audits['first-contentful-paint']?.score * 10
    const lcp_mobile = runnerResultMobile?.lhr?.audits['largest-contentful-paint']?.score * 10
    const performance_mobile = parseInt(runnerResultMobile?.lhr?.categories?.performance?.score * 100)
    const seo_mobile = parseInt(runnerResultMobile?.lhr?.categories?.seo?.score * 100)
    const si_mobile = runnerResultMobile?.lhr?.audits['speed-index']?.score * 10
    const tbt_mobile = runnerResultMobile?.lhr?.audits['total-blocking-time']?.score * 10
    const tti_mobile = runnerResultMobile?.lhr?.audits?.interactive?.score * 10

    const audits = {
      date,
      accessibility,
      bestpractices,
      cls,
      fcp,
      lcp,
      performance,
      seo,
      si,
      tbt,
      tti,
      accessibility_mobile,
      bestpractices_mobile,
      cls_mobile,
      fcp_mobile,
      lcp_mobile,
      performance_mobile,
      seo_mobile,
      si_mobile,
      tbt_mobile,
      tti_mobile,
      type,
      url,
    }

    let savedAudits
    // Save data in database
    try {
      savedAudits = await prisma.audit.create({
        data: audits
      })
    } catch (err) {
      console.log('Error: ', err)
      return res.status(500).json({error: 'Unable to insert data to database'})
    }

    return res.status(200).json(savedAudits)
  }

  if(req.method === 'POST') {
    const body = JSON.parse(req?.body)
    const {
      url,
      type
    } = body

    // Route is only accessible locally
    if(process.env.NEXT_PUBLIC_DEV === '1') {
      audit(url, type)
    } else {
      return res.status(401).json({ error: 'Unauthorized'})
    }

  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
