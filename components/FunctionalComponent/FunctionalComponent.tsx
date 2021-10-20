import styles from './FunctionalComponent.module.scss'

type Props = {
  prop: string
}

const FunctionalComponent = (props: Props): JSX.Element => {
  const {
    prop
  } = props

  return (
    <div className={styles.wrap}>
      {prop}
    </div>
  )
}

export default FunctionalComponent
