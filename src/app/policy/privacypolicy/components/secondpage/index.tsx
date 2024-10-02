import { Heading } from "@medusajs/ui";
import '../Privacy.css';

const SecondPage = () => {
  return (
    <div className="privacy-page-container">
      <div className="content-wrapper">
        <Heading
          level="h1"
          className="privacy-heading"
        >
          Privacy Policy for Anikaa Designs Solutions
        </Heading>

        <div className="text-section">
          <p className="section-heading">Introduction</p>
          <p>At Anikaa Designs Solutions, we value your privacy and are committed to protecting your personal information in accordance with applicable data protection laws.</p>
        </div>

        <div className="section">
          <p className="section-heading">Information Collection</p>
          <p>We collect personal data when you make a purchase, register, or interact with our products and services. This may include information like name, email address, physical address, phone number, and other relevant details voluntarily provided by you.</p>
        </div>

        <div className="section">
          <p className="section-heading">Use of Information</p>
          <p>The personal information collected is used for various purposes such as product activations, service usage, and site visit records. We may also invite you to participate in voluntary improvement programs to enhance our services.</p>
        </div>

        <div className="section">
          <p className="section-heading">Cookies and Tracking</p>
          <p>Our website may use cookies to enhance user experience and track site usage. By using our website, you consent to the use of cookies in line with our Cookie Policy.</p>
        </div>

        <div className="section">
          <p className="section-heading">Data Security</p>
          <p>We implement security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. Your data is stored securely and handled with the utmost confidentiality.</p>
        </div>

        <div className="section">
          <p className="section-heading">Third-Party Disclosure</p>
          <p>We do not sell, trade, or transfer your personal information to third parties without your consent, except as required by law or for service provision.</p>
        </div>

        <div className="section">
          <p className="section-heading">Data Transfer</p>
          <p>Your personal data may be transferred outside your country of residence for processing and storage, ensuring compliance with data protection regulations.</p>
        </div>

        <div className="section">
          <p className="section-heading">Your Rights</p>
          <p>You have the right to access, correct, or delete your personal information held by Anikaa Designs Solutions. If you have any concerns or queries regarding your data, please contact our Data Protection Officer.</p>
        </div>

        <div className="section">
          <p className="section-heading">Changes to Privacy Policy</p>
          <p>We reserve the right to update our Privacy Policy to reflect changes in data protection laws or our business practices. Any significant changes will be communicated on our website.</p>
        </div>

        <div className="section">
          <p className="section-heading">Contact Information</p>
          <p>For any inquiries or requests related to your privacy or our Privacy Policy, please contact us at support@anikaadesignssolutions.com. You can also reach out to our Data Protection Officer at the provided contact details.</p>
        </div>

        <div className="text-section">
          <p>By using Anikaa Designs Solutions, you agree to the terms outlined in this Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default SecondPage;
