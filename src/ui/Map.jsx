import { Icon } from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useGeolocation } from "../hooks/useGeolocation";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const locationPin = new Icon({iconUrl: "location-pin.png", iconSize: [40, 40]})
const destinationPin = new Icon({iconUrl: "destination-pin.png", iconSize: [40, 40]})

function Map({destination, location, path, isLoading}) {
  const [points, setPoints] = useState([])

  useEffect(() => {
    if (!path) return
    
    const formattedPoints = path?.map((pos) => [pos[1], pos[0]]);

    setPoints(formattedPoints);

  }, [path])

  return (
      <MapContainer center={[location?.lat, location?.lng]} zoom={16} minZoom={14} scrollWheelZoom={true} className="w-full h-full">
          {!isLoading && <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />}
          <Marker position={[location?.lat, location?.lng]} icon={locationPin}/>
          {destination.length && <Marker position={destination} icon={destinationPin}/>}
          <Polyline positions={points} color="#dc2626" />
          <RecenterMap location={location}/>
          <DetectClick/>
      </MapContainer>
  )
}

function RecenterMap({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location?.lat, location?.lng], map.getZoom());
    }
  }, [location, map]);

  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;