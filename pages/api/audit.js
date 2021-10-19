// const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

export default function handler(req, res) {
  (async () => {
    const chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless']
    });

    const flags = {
      port: chrome.port,
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
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

    const runnerResult = await lighthouse('https://www.rhumbix.com', flags, config);
    const runnerResultMobile = await lighthouse('https://www.rhumbix.com', flags);
  
    console.log('\n\n\nthis is runnerResult: ', runnerResult?.lhr?.audits, '\n\n\n');
  
    // `.lhr` is the Lighthouse Result as a JS object
    console.log('Report is done for', runnerResult?.lhr?.finalUrl);
    console.log('Performance score was', runnerResult?.lhr?.categories?.performance?.score * 100);
  
    await chrome.kill();

    res.status(200).json({ audits: runnerResult.lhr })
  })()
}
