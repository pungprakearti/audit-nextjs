import { useState, ChangeEvent, FormEvent } from 'react'
import styles from './AuditForm.module.scss'

const AuditForm = (): JSX.Element => {
  const [url, setUrl] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  const params: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application-json'
    },
    body: JSON.stringify(url)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetch('/api/audit', params)
  }

  return (
    <form className={styles.wrap} onSubmit={handleSubmit}>
      <label>URL: </label>
      <input type='text' name='url' onChange={handleChange} value={url} />
      <button>Audit</button>
    </form>
  )
}

export default AuditForm
// Need loading to make button unclickable
