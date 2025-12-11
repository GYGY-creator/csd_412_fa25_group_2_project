import React from 'react'
import { Route, Routes, Link, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import RestaurantDetail from './pages/RestaurantDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import NewReview from './pages/NewReview'
import { useAuth } from './state/AuthContext'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  const { token, logout } = useAuth()
  return (
    <div>
      <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ccc' }}>
        <Link to="/">SoundReviews</Link>
        <Link to="/">Home</Link>
        {token ? (
          <>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurants/:id/reviews/new" element={<PrivateRoute><NewReview /></PrivateRoute>} />
      </Routes>
    </div>
  )
}
