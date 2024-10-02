import { Heading } from "@medusajs/ui";
import '../Shipping.css';

const SecondPage = () => {
  return (
    <div className="shipping-page-container">
      <div className="content-wrapper">
        <Heading level="h1" className="shipping-heading">
          Shipping And Delivery
        </Heading>
        
        <div className="text-section">
          <p>
            At Anikaa Designs Solutions, we offer a diverse range of services, tailored to meet the unique needs of our users. When placing an order through our online platform, you can trust us for timely delivery, facilitated by our reliable third-party service providers.
          </p>
          <p className="section-heading">Shipping Timelines:</p>
        </div>
        
        <div className="shipping-div">
          <p>
            Upon order confirmation, you will receive tracking details via email, enabling you to monitor the progress of your delivery in real-time. The product will be shipped within 2-3 days.
          </p>
          <div className="divider"></div>
          <p>
            All charges are clearly outlined on our website and final invoice, ensuring transparency and no hidden costs.
          </p>
          <div className="divider"></div>
          <p>
            You can also track your delivery using the tracking number provided, available on our website or through third-party service providers.
          </p>
        </div>

        <div className="text-section">
          <p className="section-heading">Delivery Assurance:</p>
        </div>

        <div className="shipping-div">
          <p>
            In case of incomplete or failed deliveries, please reach out to our dedicated customer support team at support@anikaadesignssolutions.com.
          </p>
          <div className="divider"></div>
          <p>
            We will promptly investigate the issue and take necessary action to rectify any discrepancies in our service delivery, ensuring your satisfaction.
          </p>
        </div>

        <div className="text-section">
          <p className="section-heading">Online Tracking:</p>
        </div>

        <div className="shipping-div">
          <p>
            Each online order is assigned a unique tracking ID, allowing you to monitor your delivery progress seamlessly on our third-party service providers&apos; platform.
          </p>
          <div className="divider"></div>
          <p>
            Stay informed and up-to-date with real-time delivery tracking, providing you with peace of mind and convenience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecondPage;
