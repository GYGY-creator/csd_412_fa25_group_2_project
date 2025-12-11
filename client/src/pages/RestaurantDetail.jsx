import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api'

export default function RestaurantDetail() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)

  useEffect(() => {
    api.get(`/restaurants/${id}`).then(({ data }) => setRestaurant(data))
  }, [id])

  if (!restaurant) return <div>Loading...</div>

  return (
    <div style={{ padding: 16 }}>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.address}</p>
      <Link to={`/restaurants/${id}/reviews/new`}>Write a review</Link>
      <h2>Reviews</h2>
      <ul>
        {restaurant.Reviews?.map(r => (
          <li key={r.id}>
            <strong>{r.title}</strong> - {r.rating}/5
            <p>{r.body}</p>
            <small>By {r.User?.username}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}
