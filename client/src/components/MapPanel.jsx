import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "100%" };
const center = { lat: 47.6062, lng: -122.3321 };

export default function MapPanel() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  console.log("VITE_GOOGLE_MAPS_API_KEY loaded?", Boolean(apiKey));

  if (!apiKey) {
    return (
      <div style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px dashed red",
        background: "#fff"
      }}>
        Missing VITE_GOOGLE_MAPS_API_KEY (check client/.env + restart dev server)
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} />
    </LoadScript>
  );
}
