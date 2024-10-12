import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Box, Button, IconButton, Checkbox, FormControlLabel } from "@mui/material";
import X from "@modules/common/icons/x"; // Assuming you have an X icon component
import { MEDUSA_BACKEND_URL } from "@lib/config";

const DesignPreferencesModal = ({
  isOpen,
  onClose,
  onSubmit,
  categoryId,
  productTitle,
  designPreferences,
  materialImageUrl, // New prop for material image URL
  matchingItem,   // The ID of the line item
}: any) => {
  const [formValues, setFormValues] = useState(designPreferences.measurement_values || {});
  const [designImages, setDesignImages] = useState<string[]>(designPreferences.design_images || []);
  const [measurementDressImages, setMeasurementDressImages] = useState<string[]>(designPreferences.measurement_dress_images || []);
  const [designPreference, setDesignPreference] = useState(designPreferences.design_preference || "");
  const [measurements, setMeasurements] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false); // Track image uploads
  const [uploadingDressImages, setUploadingDressImages] = useState(false); // Track dress image uploads
  const [attachLining, setAttachLining] = useState(designPreferences.attach_lining || false); // Track the checkbox state
  const [showWarningModal, setShowWarningModal] = useState(false); // To display the warning modal for measurement or dress image
  const [showDesignImageWarning, setShowDesignImageWarning] = useState(false); // To display the warning modal for missing design image

  useEffect(() => {
    // Update form fields when the modal opens and design preferences change
    if (designPreferences) {
      setFormValues(designPreferences.measurement_values || {});
      setDesignImages(designPreferences.design_images || []);
      setMeasurementDressImages(designPreferences.measurement_dress_images || []);
      setDesignPreference(designPreferences.design_preference || "");
      setAttachLining(designPreferences.attach_lining || false);
    }
  }, [designPreferences]);

  // Fetch measurements when modal is open
  useEffect(() => {
    if (isOpen && categoryId) {
      const fetchMeasurements = async () => {
        try {
          const response = await axios.get(
            `${MEDUSA_BACKEND_URL}/store/categoryMeasurement?category_id=${categoryId}`
          );
          const data = response.data.data[0]?.measurements || [];
          console.log("fetchMeasurements ",data)
          setMeasurements(data);
        } catch (error) {
          console.error("Error fetching measurements:", error);
        }
      };
      fetchMeasurements();
    }
  }, [isOpen, categoryId]);

  // Handle multiple image uploads and send to server to get URLs
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "design" | "dress") => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (type === "design") setUploadingImages(true);
    if (type === "dress") setUploadingDressImages(true);

    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        try {
          const response = await axios.post(`${MEDUSA_BACKEND_URL}/store/designImageUpload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          return response.data.files.image[0].url;
        } catch (error) {
          console.error("Error uploading image:", error);
          return "";
        }
      })
    );

    const validImageUrls = imageUrls.filter((url) => url);

    if (type === "design") {
      setDesignImages((prevImages) => [...prevImages, ...validImageUrls]);
    } else {
      setMeasurementDressImages((prevImages) => [...prevImages, ...validImageUrls]);
    }

    if (type === "design") setUploadingImages(false);
    if (type === "dress") setUploadingDressImages(false);
  };

  // Remove image by index
  const handleRemoveImage = async (index: number, type: "design" | "dress") => {
    const selectedImageUrl = type === "design" ? designImages[index] : measurementDressImages[index];
    console.log(`Selected image to remove: ${selectedImageUrl}`);

    if (type === "design") {
      setDesignImages((prevImages) => prevImages.filter((_, i) => i !== index));
    } else {
      setMeasurementDressImages((prevImages) => prevImages.filter((_, i) => i !== index));
    }

    const reqBody = {
      image_urls: [selectedImageUrl], // Pass the selected image URL in an array
    };

    try {
      const response = await axios.delete(`${MEDUSA_BACKEND_URL}/store/deleteImage`, {
        data: reqBody,
      });

      if (response.status === 200) {
        console.log("Image deleted successfully:", selectedImageUrl);
      } else {
        console.log("Failed to delete the image:", selectedImageUrl);
      }
    } catch (error) {
      console.error("Error deleting the image:", error);
    }
  };

  // Handle input changes for measurements and design preferences
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleDesignPreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesignPreference(e.target.value);
  };

  const handleAttachLiningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachLining(e.target.checked);
  };

  // Validate if the form fulfills the required conditions
  const validateForm = () => {
    const allFieldsFilled = measurements.every(
      ({ attributeName }: any) => formValues[attributeName] && Number(formValues[attributeName]) > 0
    );
    const hasAtLeastOneDressImage = measurementDressImages.length > 0;
    const hasAtLeastOneDesignImage = designImages.length > 0;

    return { valid: hasAtLeastOneDressImage || (allFieldsFilled && hasAtLeastOneDesignImage), hasAtLeastOneDesignImage };
  };

  // Handle form submission and show warning modal if necessary
  const handleSubmit = async () => {
    const { valid: formIsValid, hasAtLeastOneDesignImage } = validateForm();

    if (!formIsValid) {
      setShowWarningModal(true);
      return;
    }

    if (!hasAtLeastOneDesignImage) {
      setShowDesignImageWarning(true); // Show design image warning modal
      return;
    }

    const postData = {
      id: matchingItem?.id,
      material_image_url: materialImageUrl,
      design_preference: designPreference,
      design_images: designImages,
      measurement_values: formValues,
      measurement_dress_images: measurementDressImages,
      attach_lining: attachLining,
    };

    try {
      await axios.post(`${MEDUSA_BACKEND_URL}/store/customizeDesign`, postData);
      onSubmit(postData);
    } catch (error) {
      console.error("Error submitting design preferences:", error);
    }
  };

// Function to combine and delete images on modal close
const handleModalClose = async () => {
    // Combine all the URLs into a single array
    const allImageUrls = [
      materialImageUrl, // Material Image URL
      ...designImages, // Design Image URLs
      ...measurementDressImages, // Measurement Dress Image URLs
    ];
  
    // Log the URLs to verify
    console.log("Combined Image URLs to delete:", allImageUrls);
  
    // Prepare the request body
    const reqBody = {
      image_urls: allImageUrls, // Pass the combined URLs array
    };
  
    try {
      // Make the DELETE request to delete the images
      const response = await axios.delete(`${MEDUSA_BACKEND_URL}/store/deleteImage`, {
        data: reqBody, // Pass the request body with image_urls
      });
  
      if (response.status === 200) {
        console.log("All images deleted successfully.");
      } else {
        console.log("Failed to delete the images.");
      }
    } catch (error) {
      console.error("Error deleting the images:", error);
    }
  
    // Close the modal after handling the deletion
    onClose();
  };
  

  return (
    <>
      <Modal open={isOpen} onClose={handleModalClose}>
        <Box
          sx={{
            width: "95vw",
            height: "95vh",
            padding: 4,
            backgroundColor: "white",
            margin: "auto",
            borderRadius: 8,
            position: "relative",
            overflowY: "auto",
            marginTop: "20px",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleModalClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
            }}
          >
            <X />
          </IconButton>

          {materialImageUrl && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 4,
              }}
            >
              <img
                src={materialImageUrl}
                alt="Material Image"
                style={{
                  maxWidth: "200px",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            </Box>
          )}

          <h2>{`Design Preferences for ${productTitle}`}</h2>

          <div style={{ marginBottom: 16 }}>
            <label>Design Preference:</label>
            <input
              type="text"
              value={designPreference}
              onChange={handleDesignPreferenceChange}
              placeholder="Enter design preference"
              style={{ width: "100%", padding: "8px", marginTop: "8px" }}
            />
          </div>

          {/* Upload Design Photos */}
          <div style={{ marginBottom: 16 }}>
            <label>Upload Design Photos:</label>
            <Button variant="contained" component="label" disabled={uploadingImages}>
              {uploadingImages ? "Uploading..." : "Upload Design Photos"}
              <input type="file" hidden multiple onChange={(e) => handleImageUpload(e, "design")} />
            </Button>
          </div>

          {/* Preview Design Photos */}
          <div style={{ marginBottom: 16, display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {designImages.map((image, index) => (
              <div key={index} style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={image}
                  alt={`Design Image ${index + 1}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "white",
                    padding: "2px",
                    borderRadius: "50%",
                  }}
                  size="small"
                  onClick={() => handleRemoveImage(index, "design")}
                >
                  <X />
                </IconButton>
              </div>
            ))}
          </div>

          {/* Checkbox for attach lining */}
          <FormControlLabel
            control={
              <Checkbox
                checked={attachLining}
                onChange={handleAttachLiningChange}
                color="primary"
              />
            }
            label={`Do you have the lining for the ${productTitle} with you?`}
            style={{ marginBottom: 16 }}
          />

          {/* Upload Measurement Dress Images */}
          <div style={{ marginBottom: 16 }}>
            <label>Upload Measurement Dress Images:</label>
            <Button variant="contained" component="label" disabled={uploadingDressImages}>
              {uploadingDressImages ? "Uploading..." : "Upload Dress Images"}
              <input type="file" hidden multiple onChange={(e) => handleImageUpload(e, "dress")} />
            </Button>
          </div>

          {/* Preview Measurement Dress Photos */}
          <div style={{ marginBottom: 16, display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {measurementDressImages.map((image, index) => (
              <div key={index} style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={image}
                  alt={`Dress Image ${index + 1}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "white",
                    padding: "2px",
                    borderRadius: "50%",
                  }}
                  size="small"
                  onClick={() => handleRemoveImage(index, "dress")}
                >
                  <X />
                </IconButton>
              </div>
            ))}
          </div>

          <h3>Measurement Table</h3>
          {measurements.map(({ attributeName }: any) => (
            <div key={attributeName} style={{ marginBottom: 16 }}>
              <label>{attributeName}</label>
              <input
                type="number"
                name={attributeName}
                value={formValues[attributeName] || ""}
                onChange={handleInputChange}
                placeholder={`Enter ${attributeName} measurement`}
                style={{ width: "100%", padding: "8px", marginTop: "8px" }}
                min="1"
              />
            </div>
          ))}

          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{ marginTop: 16 }}
            disabled={uploadingImages || uploadingDressImages}
          >
            Submit Design Preferences
          </Button>
        </Box>
      </Modal>

      {/* Warning Modal */}
      <Modal open={showWarningModal} onClose={() => setShowWarningModal(false)}>
        <Box
          sx={{
            width: 400,
            backgroundColor: "white",
            p: 4,
            margin: "auto",
            top: "50%",
            transform: "translateY(-50%)",
            position: "relative",
          }}
        >
          <h2>Incomplete Form</h2>
          <p>Please upload at least one measurement dress image or fill out the entire measurement table with values greater than 0.</p>
          <Button onClick={() => setShowWarningModal(false)} variant="contained" color="primary">
            Close
          </Button>
        </Box>
      </Modal>

      {/* Design Image Warning Modal */}
      <Modal open={showDesignImageWarning} onClose={() => setShowDesignImageWarning(false)}>
        <Box
          sx={{
            width: 400,
            backgroundColor: "white",
            p: 4,
            margin: "auto",
            top: "50%",
            transform: "translateY(-50%)",
            position: "relative",
          }}
        >
          <h2>Missing Design Image</h2>
          <p>Please upload at least one design image before submitting the form.</p>
          <Button onClick={() => setShowDesignImageWarning(false)} variant="contained" color="primary">
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default DesignPreferencesModal;
