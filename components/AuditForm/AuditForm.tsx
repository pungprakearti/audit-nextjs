import { useState, ChangeEvent, FormEvent } from 'react'
import styles from './AuditForm.module.scss'

type Props = {
  disableBl: boolean,
}

const AuditForm = (props: Props): JSX.Element => {
  const {
    disableBl
  } = props

  const [url, setUrl] = useState('')
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if(e.target.value !== '') setType(e.target.value)
    else setType('')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const data = {
      url,
      type
    }

    let res: any
    const params: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application-json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    }

    // If URL and type is selected run audit call
    if(url !== '' && type !== '') {
      try {
        // Using loading variable to disable audit button
        setLoading(true)
        res = await fetch('/api/audit', params)
      } catch(err) {
        console.error(err)
      }
    }

    const resJson = await res.json()

    // Catch errors from audit
    if(res.status !== 200) {
      setError(resJson?.error)
      console.error(resJson?.error)
    } else {
      // Reset variables for another audit
      setUrl('')
      setType('')
      setError('')

      // Reload page to force server side render for new row data
      window.location.href = ('/')
    }

    setLoading(false)
  }

  return (
    <div className={styles.wrap}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>URL: </label>
        <input className={styles.input} type='text' name='url' onChange={handleChange} value={url} />
        <label>Type: </label>
        <select className={styles.select} name='type' id='type-select' value={type} onChange={handleSelect}>
          <option value=''>Please choose a website type</option>
          {/* Disable baseline option if baseline exists */}
          { !disableBl && (
            <option value='baseline'>Baseline</option>
          )}
          <option value='current'>Current</option>
          <option value='competitor'>Competitor</option>
        </select>
        <button disabled={loading || url === '' || type === ''}>Audit</button>
      </form>
      {loading && (
        <div>
          Processing audit
        </div>
      )}
      {error && (
        <div className={styles.error}>
          {`Error: ${error}`}
        </div>
      )}
    </div>
  )
}

export default AuditForm
