import React from 'react'
import styles from './Audits.module.scss'
import { v4 as uuid } from 'uuid'

interface Audit {
  id: string,
  date: number,
  accessibility: number,
  bestpractices: number,
  cls: number,
  fcp: number,
  lcp: number,
  performance: number,
  seo: number,
  si: number,
  tbt: number,
  tti: number,
  accessibility_mobile: number,
  bestpractices_mobile: number,
  cls_mobile: number,
  fcp_mobile: number,
  lcp_mobile: number,
  performance_mobile: number,
  seo_mobile: number,
  si_mobile: number,
  tbt_mobile: number,
  tti_mobile: number,
  type: string,
  url: string,
}

type Props = {
  audits: [
    Audit
  ],
}

const Audits = (props: Props): JSX.Element => {
  const {
    audits
  } = props

  const tableHeaders = [
    {
      title: 'Performance',
      desc: 'Overall performance score out of 100',
    },
    {
      title: 'Accessibility',
      desc: 'Overall accessibility score out of 100. The Lighthouse Accessibility score is a weighted average of all accessibility audits. Weighting is based on axe user impact assessments.',
    },
    {
      title: 'Best Practices',
      desc: 'Overall best practices score out of 100. Lighthouse analyzes whether HTTPS and HTTP/2 are used, checks to see whether resources come from secure sources and assesses the vulnerability of JavaScript libraries. Other best practices look at secure database connections and avoiding the use of non-secure commands, such as document.',
    },
    {
      title: 'SEO',
      desc: 'Overall performance score out of 100. Lighthouse runs various tests to establish how well a website or app can be crawled by search engines and displayed in the search results.',
    },
    {
      title: 'First Contentful Paint',
      desc: "First Contentful Paint measures how long it takes the browser to render the first piece of DOM content after a user navigates to your page"
    },
    {
      title: 'Speed Index',
      desc: 'Speed Index measures how quickly content is visually displayed during page load'
    },
    {
      title: 'Largest Contentful Paint',
      desc: 'The Largest Contentful Paint metric reports the render time of the largest image or text block visible within the viewport, relative to when the page first started loading.'
    },
    {
      title: 'Time to Interactive',
      desc: 'Time to Interactive is the amount of time it takes for the page to become fully interactive'
    },
    {
      title: 'Total Blocking Time',
      desc: 'Total Blocking Time measures the total amount of time that a page is blocked from responding to user input, such as mouse clicks, screen taps, or keyboard presses'
    },
    {
      title: 'Cumulative Layout Shift',
      desc: 'Cumulative Layout Shift is a measure of the largest burst of layout shift scores for every unexpected layout shift that occurs during the entire lifespan of a page'
    }
  ]

  // form table cells
  let currentUrl = ''
  let currentCells = []
  let currentCellsMobile = []
  let baselineCells = []
  let baselineCellsMobile = []
  let competitorGrouped = []
  let competitorCells = []
  let competitorCellsMobile = []
  let competitorUrls = []

  audits.forEach((audit) => {
    const {
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
    } = audit

    const auditOrder = [
      performance,
      accessibility,
      bestpractices,
      seo,
      fcp,
      si,
      lcp,
      tti,
      tbt,
      cls
    ]

    const auditOrderMobile = [
      performance_mobile,
      accessibility_mobile,
      bestpractices_mobile,
      seo_mobile,
      fcp_mobile,
      si_mobile,
      lcp_mobile,
      tti_mobile,
      tbt_mobile,
      cls_mobile
    ]

    // Arrange data into rows for table
    if(type === 'current') {
      auditOrder.forEach((currentAudit, i) => {
        currentCells.push(
          <div className={styles.cell} key={uuid()}>
            {currentAudit.toString().substring(0,4)}
          </div>
        )

        currentCellsMobile.push(
          <div className={styles.cell} key={uuid()}>
            {auditOrderMobile[i].toString().substring(0,4)}
          </div>
        )

        currentUrl = url
      })
    }

    if(type === 'baseline') {
      auditOrder.forEach((currentAudit, i) => {
        baselineCells.push(
          <div className={styles.cell} key={uuid()}>
            {currentAudit.toString().substring(0,4)}
          </div>
        )

        baselineCellsMobile.push(
          <div className={styles.cell} key={uuid()}>
            {auditOrderMobile[i].toString().substring(0,4)}
          </div>
        )
      })
    }

    if(type === 'competitor') {
      auditOrder.forEach((currentAudit, i) => {
        competitorCells.push(
          <div className={styles.cell} key={uuid()}>
            {currentAudit.toString().substring(0,4)}
          </div>
        )

        competitorCellsMobile.push(
          <div className={styles.cell} key={uuid()}>
            {auditOrderMobile[i].toString().substring(0,4)}
          </div>
        )
      })
      competitorGrouped.push([competitorCells, competitorCellsMobile])
      competitorUrls.push(url)

      // Reset arrays for next row
      competitorCells = []
      competitorCellsMobile = []
    }


  })

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        {tableHeaders.map((header) => (
          <React.Fragment key={uuid()}>
            <div className={styles.headerCell}>
              {header.title}
              <div className={styles.toolTip}>
                {header.desc}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <h2 className={styles.sectionTitle}>Current state</h2>
      <a href={currentUrl}><h3 className={styles.url}>{currentUrl}</h3></a>
      <div className={styles.row}>
        {currentCells}
      </div>
      <div className={styles.row}>
        {currentCellsMobile}
      </div>
      <h2 className={styles.sectionTitle}>Baseline</h2>
      <a href={currentUrl}><h3 className={styles.url}>{currentUrl}</h3></a>
      <div className={styles.row}>
        {baselineCells}
      </div>
      <div className={styles.row}>
        {baselineCellsMobile}
      </div>
      <h2 className={styles.sectionTitle}>Competitors</h2>
      {competitorGrouped.map((competitorGroup, i) => (
        <React.Fragment key={uuid()}>
          <a href={competitorUrls[i]}><h3 className={styles.url}>{competitorUrls[i]}</h3></a>
          <div className={styles.row}>
            {competitorGroup[0]}
          </div>
          <div className={styles.row}>
            {competitorGroup[1]}
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

export default Audits
