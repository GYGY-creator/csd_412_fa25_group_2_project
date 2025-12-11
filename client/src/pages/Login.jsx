import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const { data } = await api.post('/auth/login', { username, password })
      login(data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ padding: 16, display: 'grid', gap: 8, maxWidth: 360 }}>
      <h1>Login</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  )
}
