import { useState, ChangeEvent, FormEvent } from 'react'
import styles from './AuditForm.module.scss'

const AuditForm = (): JSX.Element => {
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
        'Content-Type': 'application-json'
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
        console.log(err)
      }
    }

    setLoading(false)
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
      console.log(resJson) // for debugging
    }
  }

  return (
    <div className={styles.wrap}>
      <form onSubmit={handleSubmit}>
        <label>URL: </label>
        <input type='text' name='url' onChange={handleChange} value={url} />
        <label>Type: </label>
        <select name='type' id='type-select' onChange={handleSelect}>
          <option value='' selected={type === ''}>Please choose a website type</option>
          <option value='baseline'>Baseline</option>
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
        <div>
          {`Error: ${error}`}
        </div>
      )}
    </div>
  )
}

export default AuditForm
