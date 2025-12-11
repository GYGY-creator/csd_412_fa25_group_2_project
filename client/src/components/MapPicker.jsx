import React, { useCallback, useState } from 'react'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { GOOGLE_MAPS_API_KEY } from '../config'

const containerStyle = { width: '100%', height: '300px' }
const center = { lat: 37.7749, lng: -122.4194 }

export default function MapPicker({ value, onChange }) {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: GOOGLE_MAPS_API_KEY, libraries: ['places'] })
  const [marker, setMarker] = useState(value || center)
  const onClick = useCallback((e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() }
    setMarker(pos)
    onChange?.(pos)
  }, [onChange])

  if (!isLoaded) return <div>Loading map...</div>

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={marker || center} zoom={12} onClick={onClick}>
      {marker && <Marker position={marker} />}
    </GoogleMap>
  )
}
