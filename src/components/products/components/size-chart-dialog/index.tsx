import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import styles from "./SizeChartDialog.module.css";

interface SizeChartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  categoryId: string; // Added categoryId prop
}

type MeasurementFields = {
  [key: string]: string; // Dynamically handle measurement names
};

type MeasurementData = {
  attributeName: string;
  imageUrl: string | null;
  attributeValue: string;
};

const SizeChartDialog: React.FC<SizeChartDialogProps> = ({ isOpen, onClose, productTitle, categoryId }) => {
  const [formValues, setFormValues] = useState<MeasurementFields>({});
  const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    // Fetch category measurements when the dialog is open
    if (isOpen && categoryId) {
      const fetchMeasurements = async () => {
        try {
          const response = await axios.get(
            `http://localhost:9000/store/categoryMeasurement?category_id=${categoryId}`
          );
          const data = response.data.data[0]?.measurements || [];

          // Initialize form values
          const initialFormValues: MeasurementFields = {};
          data.forEach((measurement) => {
            initialFormValues[measurement.attributeName] = measurement.attributeValue || "";
          });

          setFormValues(initialFormValues);
          setMeasurements(data);
        } catch (error) {
          console.error("Error fetching measurements:", error);
        }
      };

      fetchMeasurements();
    }
  }, [isOpen, categoryId]);

  useEffect(() => {
    // Prevent body scroll when the dialog is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Clean up function to restore body scroll when the dialog closes
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in formValues) {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

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
                    value={formValues[attributeName]}
                    onChange={handleInputChange}
                    placeholder="Enter measurement (in cms)"
                    className={styles.inputField}
                  />
                  <span className={styles.unit}>cm</span>
                </div>
              </div>
            ))}
            <button type="submit" className={styles.submitButton}>
              Submit {productTitle}'s Measurements
            </button>
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
                    <td>{value}</td>
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
