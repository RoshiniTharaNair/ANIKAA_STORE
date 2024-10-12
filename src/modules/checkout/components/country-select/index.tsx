import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import NativeSelect, { NativeSelectProps } from "@modules/common/components/native-select";
import { Region } from "@medusajs/medusa";

const CountrySelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps & {
    region?: Region;
    value: string; // Controlled value passed from parent
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; // Handle changes
  }
>(({ placeholder = "Country", region, value, onChange, ...props }, ref) => {
  const innerRef = useRef<HTMLSelectElement>(null);

  useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
    ref,
    () => innerRef.current
  );

  // Calculate the available country options from the region
  const countryOptions = useMemo(() => {
    if (!region) {
      return [];
    }

    return region.countries.map((country) => ({
      value: country.iso_2,
      label: country.display_name,
    }));
  }, [region]);

  return (
    <NativeSelect
      ref={innerRef}
      placeholder={placeholder}
      value={value} // Use controlled value here
      onChange={onChange} // Handle change events
      {...props}
    >
      {countryOptions.map(({ value, label }, index) => (
        <option key={index} value={value}>
          {label}
        </option>
      ))}
    </NativeSelect>
  );
});

CountrySelect.displayName = "CountrySelect";

export default CountrySelect;
