import { Heading } from "@medusajs/ui";
import '../Refund.css';

const SecondPage = () => {
  return (
    <div className="refund-page-container">
      {/* Background and Refund Info */}
      <div className="content-wrapper">
        <Heading level="h1" className="refund-heading">
          "Refund and Cancellation" Policy
        </Heading>

        <div className="text-section">
          <p>
            At anikaadesignssolutions.com, we prioritize exceptional customer service, ensuring satisfaction before and after every purchase. Our dedication lies in delivering products promptly and in pristine condition.
          </p>
        </div>

        <div className="section">
          <p className="section-heading">Refunds:</p>
          <div className="refund-div">
            <p>
              If you receive a damaged or defective item, contact us immediately for a replacement or refund. If the item is not damaged, returns are not entertained. The replacement item will be sent within 7-10 business days upon receiving the returned items.
            </p>
            <p>
              We offer a full refund within 7 days of purchase for items returned in their original condition and packaging, with intact tags.
            </p>
            <p>
              Refunds are processed back to the original payment method within 7-10 business days upon receiving the returned items.
            </p>
          </div>
        </div>

        <div className="section">
          <p className="section-heading">Cancellations:</p>
          <div className="refund-div">
            <p>
              You can cancel your order before it is shipped by contacting us promptly.
            </p>
            <p>
              Once your order has been shipped, cancellation is not possible.
            </p>
            <p>
              Custom orders or personalized items cannot be returned or cancelled, except in cases of damage or defect.
            </p>
          </div>
        </div>

        <div className="text-section">
          <p>
            We aim for your complete satisfaction with your purchase. If you have any queries or require clarification on our refund and cancellation policy, feel free to reach out to us.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecondPage;
