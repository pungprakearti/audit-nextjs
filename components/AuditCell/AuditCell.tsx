import styles from './AuditCell.module.scss'
import cx from 'classnames'

type Props = {
  value: number,
  index: number,
}

const AuditCell = (props: Props): JSX.Element => {
  const {
    value,
    index,
  } = props

  let color: string
  const chooseColor = () => {
    // Overall
    if(index <= 3) {
      if(value >= 90) return color = 'green'
      if(value >= 50 ) return color = 'orange'
      return color = 'red'
    }

    // FCP
    if(index === 4) {
      if(value < 1.8) return color ='green'
      if(value < 3) return color = 'orange'
      return color = 'red'
    }

    // SI
    if(index === 5) {
      if(value < 3.4) return color ='green'
      if(value < 5.8) return color = 'orange'
      return color = 'red'
    }

    // LCP
    if(index === 6) {
      if(value < 2.5) return color ='green'
      if(value < 4) return color = 'orange'
      return color = 'red'
    }

    // TTI
    if(index === 7) {
      if(value < 3.8) return color ='green'
      if(value < 7.3) return color = 'orange'
      return color = 'red'
    }

    // TBT
    if(index === 8) {
      if(value < 200) return color ='green'
      if(value < 600) return color = 'orange'
      return color = 'red'
    }

    // CLS
    if(index === 9) {
      if(value < 0.1) return color ='green'
      if(value < 0.25) return color = 'orange'
      return color = 'red'
    }
  }
  chooseColor()

  return (
    <div className={cx(styles.cell, styles[color])}>
      {value}{index >= 4 && index <= 7 && ' s'}{index === 8 && ' ms'}
    </div>
  )
}

export default AuditCell
