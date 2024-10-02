"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import X from '../../common/components/X';
import styles from './ChatFooter.module.css';

const ChatFooter = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className={styles.fixedButtons}>
      <div className={styles.contactUs}>
        <p>Have questions? Contact us</p>
      </div>
      <div
        className={`${styles.chatButtonWrapper} ${isChatOpen ? styles.open : ''}`}
        onClick={toggleChat}
      >
        {!isChatOpen ? (
          <div className={styles.chatButton}>
            <Image src="/messenger.png" alt="Chat" width={35} height={35} className={styles.messengerIcon} />
          </div>
        ) : (
          <div className={styles.chatOptions}>
            <Link href="https://wa.me/919362204990" target="_blank" rel="noopener noreferrer">
              <Image src="/whatsapp.jpg" alt="WhatsApp" width={30} height={30} className={styles.chatIcon} />
            </Link>
            <Link href="tel:+919362204990">
              <Image src="/call.png" alt="Call" width={30} height={30} className={styles.chatIcon} />
            </Link>
            <div className={styles.closeChat} onClick={toggleChat}>
              <X style={{ color: "red", width: "25px", height: "auto" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatFooter;
