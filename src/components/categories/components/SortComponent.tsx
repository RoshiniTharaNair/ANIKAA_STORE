import { FC, useEffect, useState } from "react";
import Select from "react-select";
import styles from "../styles/SortComponent.module.css";

interface SortComponentProps {
  onSort: (sortOption: string) => void;
  isSortApplied: (status: boolean) => void;
  clearTrigger: boolean; // New prop to trigger clearing
}

const SortComponent: FC<SortComponentProps> = ({ onSort, isSortApplied, clearTrigger }) => {
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    if (clearTrigger) {
      setSortOption("");
      onSort("");
      isSortApplied(false);
    }
  }, [clearTrigger]);

  const handleSortChange = (selectedOption: any) => {
    setSortOption(selectedOption ? selectedOption.value : "");
    onSort(selectedOption ? selectedOption.value : "");
  };

  useEffect(() => {
    isSortApplied(sortOption !== "");
  }, [sortOption]);

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
    <div className={styles.sortContainer}>
      <Select
        styles={customStyles}
        options={[
          { value: "bestseller", label: "Bestseller" },
          { value: "relevance", label: "Relevance" },
          { value: "latest-arrivals", label: "Latest Arrivals" },
          { value: "price-asc", label: "Price: Low to High" },
          { value: "price-desc", label: "Price: High to Low" },
        ]}
        onChange={handleSortChange}
        placeholder="Sort By:"
        value={sortOption ? { value: sortOption, label: sortOption.replace("-", " ").replace(/\b\w/g, char => char.toUpperCase()) } : null}
      />
    </div>
  );
};

export default SortComponent;
