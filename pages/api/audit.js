const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

export default function handler(req, res) {
  const audit = async () => {
    const chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless']
    })

    const flags = {
      port: chrome.port,
      output: 'json',
      onlyCategories: [
        'performance',
        // 'accessibility',
        // 'best-practices',
        // 'seo'
      ],
      logLevel: 'info'
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
          disabled: false
        }
      }
    }

    let runnerResult
    let runnerResultMobile
    try {
      runnerResult = await lighthouse('https://www.google.com', flags, config);
      runnerResultMobile = await lighthouse('https://www.google.com', flags);
    } catch(err) {
      if(err.code === 'INVALID_URL') {
        return res.status(500).json({ error: `${err?.code} - example: https://www.google.com` })
      } else {
        return res.status(500).json({ error: err?.code })
      }

    }
  
    console.log('\n\n\nthis is runnerResult: ', runnerResult?.lhr?.audits, '\n\n\n');
  
    // `.lhr` is the Lighthouse Result as a JS object
    console.log('Report is done for', runnerResult?.lhr?.finalUrl);
    console.log('Performance score was', runnerResult?.lhr?.categories?.performance?.score * 100);
  
    await chrome.kill();

    // Parse data
    /*
    url, <--- get from body
    type, <---
    performance,
    accessibility,
    bestpractices,
    seo,
    fcp,
    si,
    lcp,
    tti,
    tbt,
    cls,
    date,
    */
    const date = Date.now()
    const accessibility = runnerResult?.lhr?.categories?.accessibility?.score * 100
    const bestpractices = runnerResult?.lhr?.categories['best-practices']?.score * 100
    const cls = runnerResult?.lhr?.audits['cumulative-layout-shift']?.score * 100
    const fcp = runnerResult?.lhr?.audits['first-contentful-paint']?.score * 100
    const lcp = runnerResult?.lhr?.audits['largest-contentful-paint']?.score * 100
    const performance = runnerResult?.lhr?.categories?.performance?.score * 100
    const seo = runnerResult?.lhr?.categories?.seo?.score * 100
    const si = runnerResult?.lhr?.audits['speed-index']?.score * 100
    const tbt = runnerResult?.lhr?.audits['total-blocking-time']?.score * 100
    const tti = runnerResult?.lhr?.audits?.interactive?.score * 100

    const accessibility_mobile = runnerResultMobile?.lhr?.categories?.accessibility?.score * 100
    const bestpractices_mobile = runnerResultMobile?.lhr?.categories['best-practices']?.score * 100
    const cls_mobile = runnerResultMobile?.lhr?.audits['cumulative-layout-shift']?.score * 100
    const fcp_mobile = runnerResultMobile?.lhr?.audits['first-contentful-paint']?.score * 100
    const lcp_mobile = runnerResultMobile?.lhr?.audits['largest-contentful-paint']?.score * 100
    const performance_mobile = runnerResultMobile?.lhr?.categories?.performance?.score * 100
    const seo_mobile = runnerResultMobile?.lhr?.categories?.seo?.score * 100
    const si_mobile = runnerResultMobile?.lhr?.audits['speed-index']?.score * 100
    const tbt_mobile = runnerResultMobile?.lhr?.audits['total-blocking-time']?.score * 100
    const tti_mobile = runnerResultMobile?.lhr?.audits?.interactive?.score * 100

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
    }

    return res.status(200).json({ audits: audits })
  }

  if(req.method === 'POST') {
    audit()
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
