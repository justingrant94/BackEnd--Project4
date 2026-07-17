import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../api/client'
import { saveSession } from '../lib/auth'
import StatusMessage from '../components/StatusMessage'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', email: '', password: '', password_confirmation: '' })
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
      await registerUser(formData)
      const loginData = await loginUser({ email: formData.email, password: formData.password })
      saveSession(loginData.token)
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
        <p className="eyebrow">Join the discussion</p>
        <h1>Register</h1>
        <p>Create an account and jump straight into the directory.</p>

        {error && <StatusMessage type="error">{error}</StatusMessage>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <input name="username" value={formData.username} onChange={updateForm} required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" value={formData.email} onChange={updateForm} required />
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" value={formData.password} onChange={updateForm} required />
          </label>
          <label>
            <span>Confirm password</span>
            <input name="password_confirmation" type="password" value={formData.password_confirmation} onChange={updateForm} required />
          </label>
          <button className="button" type="submit" disabled={submitting}>{submitting ? 'Creating account...' : 'Create account'}</button>
        </form>

        <p className="auth-switch">Already registered? <Link to="/login">Login</Link></p>
      </section>
    </main>
  )
}

export default Register
