import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/client'
import { saveSession } from '../lib/auth'
import StatusMessage from '../components/StatusMessage'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateForm(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      setSubmitting(true)
      const data = await loginUser(formData)
      saveSession(data.token)
      navigate('/players')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>
        <p>Sign in to add and manage comments on player pages.</p>

        {error && <StatusMessage type="error">{error}</StatusMessage>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input name="email" type="email" value={formData.email} onChange={updateForm} required />
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" value={formData.password} onChange={updateForm} required />
          </label>
          <button className="button" type="submit" disabled={submitting}>{submitting ? 'Logging in...' : 'Login'}</button>
        </form>

        <p className="auth-switch">Need an account? <Link to="/register">Register</Link></p>
      </section>
    </main>
  )
}

export default Login
