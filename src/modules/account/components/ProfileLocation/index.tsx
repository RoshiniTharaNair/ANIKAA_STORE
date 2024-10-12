"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button, IconButton } from "@medusajs/ui";
import { Grid, Modal, Box, TextField } from "@mui/material";
import X from "@modules/common/icons/x";
import { MEDUSA_BACKEND_URL } from "@lib/config";
// Dynamically import ProfileLocationMap with no SSR
const ProfileLocationMap = dynamic(() => import('./ProfileLocationMap'), { ssr: false });

type ProfileLocationProps = {
  modalState: boolean;
  closeModal: () => void;
  customerId: string;
};

const ProfileLocation: React.FC<ProfileLocationProps> = ({
  modalState,
  closeModal,
  customerId,
}) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [address_1, setAddress_1] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(13);
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);

  // Input field state variables
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [company, setCompany] = useState<string>("");

  const isClient = typeof window !== "undefined";

  // Get the current location of the user as soon as the component loads
  useEffect(() => {
    if (isClient && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const coords = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          };
          setPosition(coords);
          setZoom(15); // Zoom in closer when current location is retrieved
          setLoading(false);
        },
        (error) => {
          console.error("Error getting initial location:", error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, [isClient]);

  // Function to get the current location when the button is clicked
  const handleUseCurrentLocation = () => {
    if (isClient && navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const coords = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          };
          setPosition(coords);
          setZoom(15); // Zoom in closer when current location is retrieved
          setLoading(false);
        },
        (error) => {
          console.error("Error getting current location:", error);
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Function to fetch the address using reverse geocoding
  useEffect(() => {
    if (position) {
      const fetchAddress = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json`
          );
          const data = await response.json();
          // console.log("data ", data);

          if (data && data.address) {
            const {
              road,
              neighbourhood,
              suburb,
              shop,
              county,
              state_district,
              city_district,
              city,
              postcode,
              state,
              country_code,
            } = data.address;

            const addressLine1Parts = [
              shop,
              road,
              neighbourhood,
              suburb,
              city_district,
              county,
            ].filter(Boolean);
            setAddress_1(addressLine1Parts.join(", "));

            setCountryCode(country_code || "");
            setCity(city || state_district || "");
            setPostalCode(postcode || "");
            setProvince(state || "");
          }
        } catch (err) {
          console.error("Failed to fetch address:", err);
        }
      };
      fetchAddress();
    }
  }, [position]);

  // Function to handle the "Confirm Address" button click
  const handleConfirmAddress = async () => {
    if (position) {
      const { lat, lng } = position;

      const newAddress = {
        first_name: firstName,
        last_name: lastName,
        phone,
        address_1,
        city,
        country_code: countryCode,
        province,
        company,
        postal_code: postalCode,
        latitude: lat,
        longitude: lng,
      };

      // Make a POST request to update the address in the server
      try {
        const response = await fetch(`${MEDUSA_BACKEND_URL}/store/updateLatLong`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId,
            newAddress,
          }),
        });

        const responseData = await response.json();
        if (response.ok) {
          // console.log("Address updated successfully:", responseData);
          closeModal();
        } else {
          console.error("Failed to update address:", responseData.message);
        }
      } catch (error) {
        console.error("Error updating address:", error);
      }
    } else {
      console.log("No location selected.");
    }
  };

  return (
    <Modal
      open={modalState}
      onClose={closeModal}
      aria-labelledby="set-address-map-modal"
      aria-describedby="modal-modal-description"
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          position: "relative",
          width: "90vw",
          height: "85vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "8px",
          p: 4,
          outline: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Close button in the top-right corner */}
        <IconButton
          onClick={closeModal}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000, // Ensures the button appears above all other elements in the modal
          }}
          
        >
          <X />
        </IconButton>

        <Button
          variant="primary"
          onClick={handleUseCurrentLocation}
          disabled={loading}
          className="h-10 mb-4"
        >
          {loading ? "Getting Current Location..." : "Use Current Location"}
        </Button>
        <div style={{ flex: 1 }}>
          {isClient && (
            <ProfileLocationMap
              position={position}
              setPosition={setPosition}
              zoom={zoom}
              setZoom={setZoom}
            />
          )}
        </div>
        <div style={{ marginTop: "20px" }}>
          {showAddressForm ? (
            <>
              <Grid container spacing={2} className="mb-4">
                <Grid item xs={6} sm={6}>
                  <TextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6} sm={6}>
                  <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6} sm={6}>
                  <TextField
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6} sm={6}>
                  <TextField
                    label="Location Name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                  />
                </Grid>
              </Grid>
              <Button
                variant="primary"
                onClick={handleConfirmAddress}
                className="h-10"
                data-testid="confirm-address-button"
              >
                Confirm Address
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                if (position) {
                  setShowAddressForm(true);
                } else {
                  console.log("No location selected.");
                }
              }}
              className="h-10"
              data-testid="set-address-button"
            >
              Set Address with This Location
            </Button>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default ProfileLocation;
