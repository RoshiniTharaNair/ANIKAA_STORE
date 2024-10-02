import { FC, useState, useEffect } from "react";
import Select from "react-select";
import styles from "../styles/FilterComponent.module.css";

interface FilterComponentProps {
  onFilter: (filters: any) => void;
  onClearFilters: () => void;
  isFilterApplied: (status: boolean) => void;
  clearTrigger: boolean;
  onManualChange: () => void; // New prop to track manual changes
}

const FilterComponent: FC<FilterComponentProps> = ({ onFilter, onClearFilters, isFilterApplied, clearTrigger, onManualChange }) => {
  const [filters, setFilters] = useState({ discount: false, priceRange: "", deliveryTimeRange: "" });

  useEffect(() => {
    if (clearTrigger) {
      setFilters({ discount: false, priceRange: "", deliveryTimeRange: "" });
      onFilter({ discount: false, priceRange: "", deliveryTimeRange: "" });
      isFilterApplied(false);
    }
  }, [clearTrigger]);

  const handleFilterChange = (selectedOption: any, action: any) => {
    const { name } = action;
    setFilters({ ...filters, [name]: selectedOption ? selectedOption.value : "" });
    onManualChange(); // Set manual change to true
  };

  useEffect(() => {
    onFilter({
      ...filters,
      priceRange: filters.priceRange ? filters.priceRange.split(',').map(Number) : [0, 100],
      deliveryTimeRange: filters.deliveryTimeRange ? filters.deliveryTimeRange.split(',').map(Number) : [0, 14],
    });
    isFilterApplied(!!filters.discount || !!filters.priceRange || !!filters.deliveryTimeRange);
  }, [filters]);

  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.isSelected ? "white" : "black",
      backgroundColor: state.isSelected ? "black" : state.isFocused ? "#00000080" : "white",
    }),
    control: (provided: any) => ({
      ...provided,
      minWidth: 200,
    }),
  };

  return (
    <div className={styles.filterContainer}>
      <label className={styles.filterLabel}>
        <input
          type="checkbox"
          name="discount"
          checked={filters.discount}
          onChange={(e) => {
            setFilters({ ...filters, discount: e.target.checked });
            onManualChange();
          }}
        /> Show only products with Discount Offers
      </label>
      <label className={styles.filterLabel}>
        <Select
          name="priceRange"
          styles={customStyles}
          options={[
            { value: "0,100", label: "0 - 100" },
            { value: "0,50", label: "0 - 50" },
            { value: "50,100", label: "50 - 100" },
            { value: "100,200", label: "100 - 200" },
          ]}
          onChange={handleFilterChange}
          placeholder="Price Range:"
          value={filters.priceRange ? { value: filters.priceRange, label: filters.priceRange.replace(",", " - ") } : null}
        />
      </label>
      <label className={styles.filterLabel}>
        <Select
          name="deliveryTimeRange"
          styles={customStyles}
          options={[
            { value: "0,14", label: "0 - 14" },
            { value: "0,7", label: "0 - 7" },
            { value: "7,14", label: "7 - 14" },
          ]}
          onChange={handleFilterChange}
          placeholder="Delivery Time Range (days):"
          value={filters.deliveryTimeRange ? { value: filters.deliveryTimeRange, label: filters.deliveryTimeRange.replace(",", " - ") } : null}
        />
      </label>
    </div>
  );
};

export default FilterComponent;
