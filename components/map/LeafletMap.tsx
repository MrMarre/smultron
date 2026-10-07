"use client";
import { useEffect, useState } from "react";
import useLocation, { type Position } from "@/hooks/useLocationHook";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Marker } from "react-leaflet/Marker";
import "../ui/Marker";
import LocationPopup from "./LocationPopup";

const fallbackCenter: [number, number] = [
  57.975706336525484, 19.170970916748047,
];

function MapViewSync({ userLocation }: { userLocation: Position | null }) {
  const map = useMap();
  console.log("Usemap ", map);

  useEffect(() => {
    if (userLocation === null) return;

    map.flyTo([userLocation.lat, userLocation.lng], map.getZoom());
  }, [map, userLocation]);

  return null;
}

function LocationMarker({
  position,
  onPositionChange,
}: {
  position: Position | null;
  onPositionChange: (position: Position) => void;
}) {
  if (position === null) {
    return null;
  }

  return (
    <Marker
      draggable
      position={[position.lat, position.lng]}
      eventHandlers={{
        dragend(event) {
          const marker = event.target;
          const { lat, lng } = marker.getLatLng();
          console.log("Marker dragged to: ", lat, lng);
          onPositionChange({ lat, lng });
        },
      }}
    >
      {/* <PopupDialog /> */}
      <LocationPopup position={position} onSave={() => Promise.resolve()} />
    </Marker>
  );
}

function FocusMarker({ request }: { request: Position | null }) {
  const map = useMap();

  useEffect(() => {
    if (request === null) return;
    map.flyTo([request.lat, request.lng], map.getZoom());
  }, [map, request]);
  return null;
}

function UpdateMarkerPositionOnPress({
  onPositionChange,
}: {
  onPositionChange: (position: Position) => void;
}) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      console.log("Map clicked at: ", lat, lng);
      onPositionChange({ lat, lng });
    },
  });
  return null;
}

export default function LeafletMap() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null,
  );
  const [markerFocusRequest, setMarkerFocusRequest] = useState<Position | null>(
    null,
  );
  const { userLocation, error, loading, requestLocation } = useLocation();

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        className="h-full w-full"
        center={fallbackCenter}
        zoom={14}
        // scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewSync userLocation={userLocation} />
        {userLocation !== null && (
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={8}
            pathOptions={{
              color: "white",
              weight: 3,
              fillColor: "#2563eb",
              fillOpacity: 1,
            }}
          />
        )}
        <FocusMarker request={markerFocusRequest} />
        <LocationMarker
          position={selectedPosition}
          onPositionChange={setSelectedPosition}
        />
        <UpdateMarkerPositionOnPress onPositionChange={setSelectedPosition} />
      </MapContainer>
      <button
        className="h-10 w-20 absolute bottom-4 right-4 z-1000 rounded bg-blue-500 text-white shadow"
        onClick={requestLocation}
      >
        {loading ? "Locating..." : "Locate me"}
      </button>

      {(loading || error) && (
        <div className="absolute left-4 top-4 z-1000 rounded bg-white px-3 py-2 text-sm shadow">
          {loading ? "Finding your location..." : error}
        </div>
      )}

      {(selectedPosition || userLocation) && (
        <button
          className="h-10 w-25 absolute bottom-4 right-25 z-1000 rounded bg-blue-500 text-white shadow"
          disabled={selectedPosition === null}
          onClick={() => {
            if (selectedPosition) {
              setMarkerFocusRequest({ ...selectedPosition });
            }
          }}
        >
          Go to marker
        </button>
      )}
    </div>
  );
}
