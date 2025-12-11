import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await api.post('/auth/register', { username, email, password })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ padding: 16, display: 'grid', gap: 8, maxWidth: 360 }}>
      <h1>Register</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  )
}
