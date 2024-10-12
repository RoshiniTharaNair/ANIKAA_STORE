// LeafletMap.tsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom pink marker icon
const pinkMarkerIcon = new L.Icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41], // size of the shadow
});

// Custom component to handle map click and place a pink marker at the clicked location
const LocationMarker = ({ clickedLocation, setClickedLocation }: { clickedLocation: [number, number] | null, setClickedLocation: (latlng: [number, number]) => void }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setClickedLocation([lat, lng]);
    },
  });

  return clickedLocation === null ? null : (
    <Marker position={clickedLocation} icon={pinkMarkerIcon} />
  );
};

interface LeafletMapProps {
  initialLocation: [number, number] | null;
  clickedLocation: [number, number] | null;
  setClickedLocation: (latlng: [number, number]) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  initialLocation,
  clickedLocation,
  setClickedLocation,
}) => {
  if (!initialLocation) {
    return <p className="text-small-regular">Unable to display map: No coordinates available.</p>;
  }

  return (
    <MapContainer
      center={initialLocation}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Marker that moves based on user clicks */}
      <LocationMarker clickedLocation={clickedLocation} setClickedLocation={setClickedLocation} />
    </MapContainer>
  );
};

export default LeafletMap;
