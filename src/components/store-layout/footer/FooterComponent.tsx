import React from 'react';
import styles from './FooterComponent.module.css';

const FooterComponent: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>© 2024 Powered and secured by Anikaa Designs Solutions.</p>
        <div className={styles.links}>
          <a href="#">PRIVACY POLICY</a>
          <a href="#">PUBLIC OFFER</a>
          <a href="#">SITE MAP</a>
        </div>
        <div className={styles.payments}>
          <img className={styles.paymentImg}  src="/gpay.png" alt="gpay" />
          <img className={styles.paymentImg} src="/applepay.png" alt="applepay" />
          <img className={styles.paymentImg} src="/samsungpay.png" alt="samsungpay" />
          <img className={styles.paymentImg} src="/mastercard.png" alt="mastercard" />
          <img className={styles.paymentImg} src="/visa.png" alt="visa" />
        </div>
      </div>
      <p className={styles.recaptchaNotice}>THIS SITE IS PROTECTED BY RECAPTCHA AND THE GOOGLE PRIVACY POLICY AND TERMS OF SERVICE APPLY.</p>
    </footer>
  );
};

export default FooterComponent;
