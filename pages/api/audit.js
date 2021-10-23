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
    const cls = parseInt(runnerResult?.lhr?.audits['cumulative-layout-shift']?.score * 100)
    const fcp = parseInt(runnerResult?.lhr?.audits['first-contentful-paint']?.score * 100)
    const lcp = parseInt(runnerResult?.lhr?.audits['largest-contentful-paint']?.score * 100)
    const performance = parseInt(runnerResult?.lhr?.categories?.performance?.score * 100)
    const seo = parseInt(runnerResult?.lhr?.categories?.seo?.score * 100)
    const si = parseInt(runnerResult?.lhr?.audits['speed-index']?.score * 100)
    const tbt = parseInt(runnerResult?.lhr?.audits['total-blocking-time']?.score * 100)
    const tti = parseInt(runnerResult?.lhr?.audits?.interactive?.score * 100)

    const accessibility_mobile = parseInt(runnerResultMobile?.lhr?.categories?.accessibility?.score * 100)
    const bestpractices_mobile = parseInt(runnerResultMobile?.lhr?.categories['best-practices']?.score * 100)
    const cls_mobile = parseInt(runnerResultMobile?.lhr?.audits['cumulative-layout-shift']?.score * 100)
    const fcp_mobile = parseInt(runnerResultMobile?.lhr?.audits['first-contentful-paint']?.score * 100)
    const lcp_mobile = parseInt(runnerResultMobile?.lhr?.audits['largest-contentful-paint']?.score * 100)
    const performance_mobile = parseInt(runnerResultMobile?.lhr?.categories?.performance?.score * 100)
    const seo_mobile = parseInt(runnerResultMobile?.lhr?.categories?.seo?.score * 100)
    const si_mobile = parseInt(runnerResultMobile?.lhr?.audits['speed-index']?.score * 100)
    const tbt_mobile = parseInt(runnerResultMobile?.lhr?.audits['total-blocking-time']?.score * 100)
    const tti_mobile = parseInt(runnerResultMobile?.lhr?.audits?.interactive?.score * 100)

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

    // Save data in database
    try {
      const savedAudits = await prisma.audit.create({
        data: audits
      })
    } catch (err) {
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

    audit(url, type)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
