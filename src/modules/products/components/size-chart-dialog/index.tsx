import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import styles from "./SizeChartDialog.module.css";
import { MEDUSA_BACKEND_URL } from "@lib/config";

interface SizeChartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  categoryId: string;
  onSubmitMeasurements: (measurements: { [key: string]: string }) => void;
  initialMeasurements: { [key: string]: string };
  matchingItemId: string | undefined;
}

type MeasurementFields = {
  [key: string]: string;
};

type MeasurementData = {
  attributeName: string;
  imageUrl: string | null;
  attributeValue: string;
};

const SizeChartDialog: React.FC<SizeChartDialogProps> = ({
  isOpen,
  onClose,
  productTitle,
  categoryId,
  onSubmitMeasurements,
  initialMeasurements,
  matchingItemId
}) => {
  const [formValues, setFormValues] = useState<MeasurementFields>({}); // State to store form values
  const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
  const [isEditing, setIsEditing] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [temporaryStorage, setTemporaryStorage] = useState<MeasurementFields>({}); // Temp state for measurements

  // Effect to fetch category measurements when the dialog is open
  useEffect(() => {
    if (isOpen && categoryId) {
      const fetchMeasurements = async () => {
        try {
          const response = await axios.get(
            `${MEDUSA_BACKEND_URL}/store/categoryMeasurement?category_id=${categoryId}`
          );
          const data = response.data.data[0]?.measurements || [];

          // Initialize form values with fetched data or initialMeasurements
          const initialFormValues: MeasurementFields = { ...initialMeasurements };
          data.forEach((measurement: MeasurementData) => {
            if (!initialFormValues[measurement.attributeName]) {
              initialFormValues[measurement.attributeName] = measurement.attributeValue || "";
            }
          });

          setFormValues(initialFormValues);
          setMeasurements(data);
        } catch (error) {
          console.error("Error fetching measurements:", error);
        }
      };

      fetchMeasurements();
    }
  }, [isOpen, categoryId, initialMeasurements]);

  // Effect to track changes in form values
  useEffect(() => {
    const areValuesChanged = Object.entries(formValues).some(
      ([key, value]) => value !== initialMeasurements[key]
    );
    setHasChanges(areValuesChanged);
  }, [formValues, initialMeasurements]);

  // Prevent body scroll when the dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    // Also update temporary storage if matchingItemId is not present
    if (!matchingItemId) {
      setTemporaryStorage({ ...temporaryStorage, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsEditing(false);

    if (matchingItemId) {
      try {
        // API call to update design preferences
        const response = await axios.post(
          `${MEDUSA_BACKEND_URL}/store/updateDesignPreference`,
          {
            id: matchingItemId,
            measurement_values: formValues, // Send measurements
          }
        );

        console.log("API Response: ", response.data);
      } catch (error) {
        console.error("Error updating design preference: ", error);
      }
    } else {
      console.log("No matchingItemId, storing measurements temporarily");
    }

    // Call the parent handler to update measurements in the parent component
    onSubmitMeasurements(formValues);
  };

  // Handle editing
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle closing preview
  const handleClosePreview = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialog}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.dialogTitle}>Enter Your Measurements for {productTitle}</h2>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            {measurements.map(({ attributeName, imageUrl }) => (
              <div key={attributeName} className={styles.formGroup}>
                <div className={styles.imageLabelWrapper}>
                  {imageUrl && <img src={imageUrl} alt={attributeName} className={styles.image} />}
                  <label htmlFor={attributeName} className={styles.label}>
                    {attributeName}
                  </label>
                </div>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id={attributeName}
                    name={attributeName}
                    value={formValues[attributeName] || temporaryStorage[attributeName] || ""}
                    onChange={handleInputChange}
                    placeholder="Enter measurement (in cms)"
                    className={styles.inputField}
                  />
                  <span className={styles.unit}>cm</span>
                </div>
              </div>
            ))}

            {hasChanges && (
              <button type="submit" className={styles.submitButton}>
                Submit {productTitle}&apos;s Measurements
              </button>
            )}
          </form>
        ) : (
          <div className={styles.previewContainer}>
            <table className={styles.measurementTable}>
              <thead>
                <tr>
                  <th>Measurement</th>
                  <th>Value (cm)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(formValues).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</td>
                    <td>{value || temporaryStorage[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.previewActions}>
              <button onClick={handleEdit} className={styles.editButton}>
                Edit Measurements
              </button>
              <button onClick={handleClosePreview} className={styles.closePreviewButton}>
                Close Table Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeChartDialog;
