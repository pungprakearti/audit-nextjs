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

  console.log(audits)

  return (
    <div className={styles.wrap}>
      {audits.map((audit: Audit) => {
        const {
          id,
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
        } = audit
      })}
    </div>
  )
}

export default Audits
