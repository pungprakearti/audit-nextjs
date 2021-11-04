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
    const tempAudits = runnerResult?.lhr?.audits
    const tempAuditsMobile = runnerResultMobile?.lhr?.audits

    const date = Date.now()
    const accessibility = Math.round(runnerResult?.lhr?.categories?.accessibility?.score * 100)
    const bestpractices = Math.round(runnerResult?.lhr?.categories['best-practices']?.score * 100)
    const cls = Math.round(tempAudits['cumulative-layout-shift']?.numericValue * 100) / 100
    const fcp = Math.round(tempAudits['first-contentful-paint']?.numericValue / 100) / 10
    const lcp = Math.round(tempAudits['largest-contentful-paint']?.numericValue / 100) / 10
    const performance = Math.round(runnerResult?.lhr?.categories?.performance?.score * 100)
    const seo = Math.round(runnerResult?.lhr?.categories?.seo?.score * 100)
    const si = Math.round(tempAudits['speed-index']?.numericValue / 100) / 10
    const tbt = Math.round(tempAudits['total-blocking-time']?.numericValue)
    const tti = Math.round(tempAudits?.interactive?.numericValue / 100) / 10

    const accessibility_mobile = Math.round(runnerResult?.lhr?.categories?.accessibility?.score * 100)
    const bestpractices_mobile = Math.round(runnerResult?.lhr?.categories['best-practices']?.score * 100)
    const cls_mobile = Math.round(tempAuditsMobile['cumulative-layout-shift']?.numericValue * 100) / 100
    const fcp_mobile = Math.round(tempAuditsMobile['first-contentful-paint']?.numericValue / 100) / 10
    const lcp_mobile = Math.round(tempAuditsMobile['largest-contentful-paint']?.numericValue / 100) / 10
    const performance_mobile = Math.round(runnerResult?.lhr?.categories?.performance?.score * 100)
    const seo_mobile = Math.round(runnerResult?.lhr?.categories?.seo?.score * 100)
    const si_mobile = Math.round(tempAuditsMobile['speed-index']?.numericValue / 100) / 10
    const tbt_mobile = Math.round(tempAuditsMobile['total-blocking-time']?.numericValue)
    const tti_mobile = Math.round(tempAuditsMobile?.interactive?.numericValue / 100) / 10

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
      await prisma.$disconnect()
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
