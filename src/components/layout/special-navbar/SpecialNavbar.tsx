// components/SpecialNavbar.tsx
import React from 'react';
import styles from './SpecialNavbar.module.css';

const SpecialNavbar: React.FC = () => {
  return (
    <div className={styles.specialNavbar}>
      <span className={styles.message}>Measurement Tape is on Sale !</span>
    </div>
  );
};

export default SpecialNavbar;
