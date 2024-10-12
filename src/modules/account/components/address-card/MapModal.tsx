"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton, TextField, Grid, Button } from "@mui/material";
import { Address } from "@medusajs/medusa";
import X from "@modules/common/icons/x"; // X icon imported here
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import { MEDUSA_BACKEND_URL } from "@lib/config";
import { LeafletMouseEvent } from "leaflet";

// Dynamically import MapContainer, TileLayer, and Marker from React Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {
  ssr: false,
});

// Declare L as a `null` initially to make sure it doesn't cause issues during SSR
let L: any = null;
if (typeof window !== "undefined") {
  L = require("leaflet");
}

type MapModalProps = {
  open: boolean;
  onClose: () => void;
  address: Omit<Address, "beforeInsert">; // Updated to omit 'beforeInsert'
};


const MapModal: React.FC<MapModalProps> = ({ open, onClose, address }) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [updatedAddress, setUpdatedAddress] = useState<Omit<Address, "beforeInsert"> | null>(address);

  // Editable fields for personal information
  const [firstName, setFirstName] = useState<string>(address.first_name || "");
  const [lastName, setLastName] = useState<string>(address.last_name || "");
  const [company, setCompany] = useState<string>(address.company || "");
  const [phone, setPhone] = useState<string>(address.phone || "");

  useEffect(() => {
    if (typeof window !== "undefined" && address.latitude && address.longitude) {
      setPosition({ lat: address.latitude, lng: address.longitude });
    } else {
      const geocodeAddress = async (addressString: string) => {
        return new Promise<{ lat: number; lng: number }>((resolve) => {
          setTimeout(() => {
            resolve({ lat: 40.7128, lng: -74.006 }); // Example: New York City coordinates
          }, 1000);
        });
      };

      if (address) {
        const fullAddress = `${address.address_1}, ${address.city}, ${address.country_code}`;
        geocodeAddress(fullAddress).then((coords) => {
          setPosition(coords);
        });
      }
    }
  }, [address]);

  // Component to handle clicking on the map to change marker position and update the address
  const LocationSelector = () => {
    // useMapEvents must always be called
    const { useMapEvents } = require("react-leaflet");
  
    useMapEvents({
      click: async (e: LeafletMouseEvent) => {
        if (typeof window === "undefined") return; // Avoid SSR issues
  
        const newPosition = { lat: e.latlng.lat, lng: e.latlng.lng };
        setPosition(newPosition);
  
        // Automatically reverse geocode and update the address
        const newAddress = await reverseGeocode(newPosition.lat, newPosition.lng);
        if (newAddress) {
          setUpdatedAddress(newAddress);
        }
      },
    });
  
    return null;
  };


  // Function to reverse geocode latitude and longitude into an address using Nominatim API
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reverse geocoding data");
      }
      const data = await response.json();
      console.log("changed location ", data);

      // Extract necessary fields from the response
      const address_1 = [
        data.address.road,
        data.address.suburb,
        data.address.city_district,
        data.address.county,
      ]
        .filter(Boolean)
        .join(", ");

        const updatedAddr: Omit<Address, 'beforeInsert'> = {
          ...address,
        address_1: address_1 || address.address_1,
        city: data.address.state_district || address.city,
        postal_code: data.address.postcode || address.postal_code,
        country_code: data.address.country_code || address.country_code,
        province: data.address.state || address.province,
        latitude: lat,
        longitude: lng,
      };

      return updatedAddr;
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      return null;
    }
  };

  const handleSaveAddress = async () => {
    if (updatedAddress && position) {
      // Update the address object with new values from input fields and new position (latitude and longitude)
      const finalAddress = {
        ...updatedAddress,
        first_name: firstName,
        last_name: lastName,
        company: company,
        phone: phone,
        latitude: position.lat,
        longitude: position.lng,
      };

      console.log("Updated Address:", finalAddress);

      // Prepare request body for API call
      const requestBody = {
        customerId: updatedAddress.customer_id, // Assuming the customer ID is part of the address object
        addressId: updatedAddress.id, // Assuming the address ID is part of the address object
        newAddress: {
          first_name: firstName,
          last_name: lastName,
          company: company,
          phone: phone,
          address_1: finalAddress.address_1,
          city: finalAddress.city,
          postal_code: finalAddress.postal_code,
          country_code: finalAddress.country_code,
          province: finalAddress.province,
          latitude: finalAddress.latitude,
          longitude: finalAddress.longitude,
        },
      };

      // Make API request to update the address
      try {
        const response = await fetch(`${MEDUSA_BACKEND_URL}/store/editLatLong`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Address updated successfully:", data);
          // Close the modal upon successful response
          onClose();
        } else {
          console.error("Failed to update address:", response.statusText);
        }
      } catch (error) {
        console.error("Error in updating address:", error);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="map-modal-title"
      aria-describedby="map-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "8px",
          p: 4,
          outline: "none",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
          }}
        >
          <X />
        </IconButton>

        {typeof window !== "undefined" && position && (
          <Box sx={{ height: "45%", mb: 4 }}>
            <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={position}
                icon={L.icon({
                  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })}
              />
              <LocationSelector />
            </MapContainer>
          </Box>
        )}

        <Grid container spacing={2}>
            <Grid item xs={6} sm={6}>
              <TextField
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                label="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                value={updatedAddress?.address_1 || ""}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            {/* Place City, Postal Code, and Province in the same row for screens larger than small */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="City"
                value={updatedAddress?.city || ""}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Postal Code"
                value={updatedAddress?.postal_code || ""}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Province"
                value={updatedAddress?.province || ""}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveAddress}
                sx={{ mt: 2, background:"black", borderRadius:"0px",color:"white" }}
              >
                Save Edited Address
              </Button>
            </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default MapModal;
