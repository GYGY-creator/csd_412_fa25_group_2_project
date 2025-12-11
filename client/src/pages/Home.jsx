import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function Home() {
  const [restaurants, setRestaurants] = useState([])

  useEffect(() => {
    api.get('/restaurants').then(({ data }) => setRestaurants(data))
  }, [])

  return (
    <div style={{ padding: 16 }}>
      <h1>Restaurants</h1>
      <ul>
        {restaurants.map(r => (
          <li key={r.id}>
            <Link to={`/restaurants/${r.id}`}>{r.name}</Link> - {r.address}
          </li>
        ))}
      </ul>
    </div>
  )
}
