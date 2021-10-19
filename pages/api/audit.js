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
        'accessibility',
        'best-practices',
        'seo'
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
      runnerResult = await lighthouse('www.google.com', flags, config);
      runnerResultMobile = await lighthouse('www.google.com', flags);
    } catch(err) {
      return res.status(500).json({ error: err?.code })
    }
  
    console.log('\n\n\nthis is runnerResult: ', runnerResult?.lhr?.audits, '\n\n\n');
  
    // `.lhr` is the Lighthouse Result as a JS object
    console.log('Report is done for', runnerResult?.lhr?.finalUrl);
    console.log('Performance score was', runnerResult?.lhr?.categories?.performance?.score * 100);
  
    await chrome.kill();

    return res.status(200).json({ audits: runnerResult.lhr })
  }

  if(req.method === 'POST') {
    audit()
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
