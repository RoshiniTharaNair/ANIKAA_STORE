import React from 'react';
import Link from 'next/link';
import styles from './MeasurementTapeSale.module.css';

interface MeasurementTapeSaleProps {
  className?: string;
}

const MeasurementTapeSale: React.FC<MeasurementTapeSaleProps> = ({ className }) => {
  return (
    <Link href="/measurement-tape" className={`${styles.saleBanner} ${className}`}>
      <div className={styles.textContainer}>
        <span className={styles.saleText}>Measurement Tape</span>
        <span className={styles.newLabel}>SALE</span>
      </div>
    </Link>
  );
};

export default MeasurementTapeSale;
