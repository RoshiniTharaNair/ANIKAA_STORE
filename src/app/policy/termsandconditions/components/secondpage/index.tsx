import { Heading } from "@medusajs/ui";
import '../Terms.css';

const SecondPage = () => {
  return (
    <div className="terms-page-container">
      <div className="content-wrapper">
        <Heading level="h1" className="terms-heading">
          Enhanced Terms and Conditions for Anikaa Designs Solutions
        </Heading>
        
        <div className="text-section">
          <p className="section-title">Product Descriptions and Pricing</p>
          <p>Each product is sold as described on the website.</p>
          <p>Transparent pricing is provided on our platform and final invoices, ensuring clarity for all costs.</p>
        </div>

        <div className="text-section">
          <p className="section-title">Payment</p>
          <p>Payment is processed at the point of sale.</p>
          <p>We accept various payment methods including credit/debit cards, Google Pay, and PayPal.</p>
          <p>International delivery charges are clearly indicated at checkout for products with international shipping.</p>
          <p>International shipping prices cover delivery only and do not include local import duties or taxes.</p>
        </div>

        <div className="text-section">
          <p className="section-title">Ordering and Delivery</p>
          <p>Your personal and payment details are securely processed for each order.</p>
          <p>We do not store credit/debit card information for security reasons.</p>
          <p>You will receive confirmation of your order and shipping details via email.</p>
          <p>Providing a contact telephone number is recommended for efficient communication regarding your order.</p>
        </div>

        <div className="text-section">
          <p className="section-title">Cancellation, Returns, and Refunds</p>
          <p>Please refer to our detailed Refund and Cancellation Policy on our website for specific guidelines.</p>
        </div>

        <div className="text-section">
          <p className="section-title">Commissioned Items</p>
          <p>Commissioned pieces, once ordered and paid for, are generally non-cancellable.</p>
          <p>Refunds are not typically offered for completed commissioned or bespoke items.</p>
        </div>

        <div className="text-section">
          <p className="section-title">Safe Shopping and Privacy</p>
          <p>Your privacy is paramount, and we do not share or misuse your personal information.</p>
          <p>By placing an order, you agree to our Terms & Conditions of Sale.</p>
        </div>

        <div className="text-section">
          <p className="section-title">Dispute Resolution</p>
          <p>Any disputes will be governed by the laws of the company&apos;s jurisdiction.</p>
        </div>

        <div className="text-section">
          <p className="section-title">Changes to Terms and Conditions</p>
          <p>We reserve the right to update our terms and conditions without prior notice.</p>
          <p>Continued use of our website post changes indicates acceptance of the updated terms.</p>
        </div>

        <div className="text-section">
          <p className="section-title">Contact Us</p>
          <p>For any queries regarding our terms and conditions, reach out to us at support@anikaadesignssolutions.com or through the provided customer support email in our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default SecondPage;
