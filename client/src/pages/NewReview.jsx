import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import MapPicker from '../components/MapPicker'

export default function NewReview() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [rating, setRating] = useState(5)
  const [marker, setMarker] = useState(null)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    // Optionally update restaurant lat/lng on review submit
    if (marker) {
      await api.put(`/restaurants/${id}`, { lat: marker.lat, lng: marker.lng })
    }
    await api.post('/reviews', { title, body, rating, restaurantId: Number(id) })
    navigate(`/restaurants/${id}`)
  }

  return (
    <form onSubmit={submit} style={{ padding: 16, display: 'grid', gap: 8 }}>
      <h2>New Review</h2>
      <input placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
      <textarea placeholder='Body' value={body} onChange={e => setBody(e.target.value)} />
      <label>
        Rating
        <input type='number' min='1' max='5' value={rating} onChange={e => setRating(Number(e.target.value))} />
      </label>
      <MapPicker value={marker} onChange={setMarker} />
      <button type='submit'>Submit</button>
    </form>
  )
}
