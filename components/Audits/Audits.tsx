import React from 'react'
import AuditCell from '../AuditCell'
import { v4 as uuid } from 'uuid'
import styles from './Audits.module.scss'

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
      desc: 'Overall accessibility score out of 100.',
    },
    {
      title: 'Best Practices',
      desc: 'Overall best practices score out of 100.',
    },
    {
      title: 'SEO',
      desc: 'Overall performance score out of 100.',
    },
    {
      title: 'First Contentful Paint',
      desc: 'First Contentful Paint marks the time at which the first text or image is painted.'
    },
    {
      title: 'Speed Index',
      desc: 'Speed Index shows how quickly the contents of a page are visibly populated.'
    },
    {
      title: 'Largest Contentful Paint',
      desc: 'Largest Contentful Paint marks the time at which the largest text or image is painted.'
    },
    {
      title: 'Time to Interactive',
      desc: 'Time to interactive is the amount of time it takes for the page to become fully interactive.'
    },
    {
      title: 'Total Blocking Time',
      desc: 'Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds.'
    },
    {
      title: 'Cumulative Layout Shift',
      desc: 'Cumulative Layout Shift measures the movement of visible elements within the viewport.'
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
      auditOrder.forEach((currentAudit, i: number) => {
        currentCells.push(
          <AuditCell value={currentAudit} index={i} key={uuid()}/>
        )

        currentCellsMobile.push(
          <AuditCell value={auditOrderMobile[i]} index={i} key={uuid()}/>
        )

        currentUrl = url
      })
    }

    if(type === 'baseline') {
      auditOrder.forEach((currentAudit, i: number) => {
        baselineCells.push(
          <AuditCell value={currentAudit} index={i} key={uuid()}/>
        )

        baselineCellsMobile.push(
          <AuditCell value={auditOrderMobile[i]} index={i} key={uuid()}/>
        )
      })
    }

    if(type === 'competitor') {
      auditOrder.forEach((currentAudit, i: number) => {
        competitorCells.push(
          <AuditCell value={currentAudit} index={i} key={uuid()}/>
        )

        competitorCellsMobile.push(
          <AuditCell value={auditOrderMobile[i]} index={i} key={uuid()}/>
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
          <div className={styles.headerCell} key={uuid()}>
            {header.title}
            <div className={styles.toolTip}>
              {header.desc}
            </div>
          </div>
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
      {competitorGrouped.map((competitorGroup, i: number) => (
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
