import { Heading } from "@medusajs/ui";
import '../Tailor.css';

const SecondPage = () => {
  return (
    <div className="tailor-page-container">
      <div className="content-wrapper">
        <Heading level="h1" className="tailor-heading">
          Tailor Made Creative Solutions
        </Heading>
       
        <div className="text-section">
          <p>
            For Anikaa Designs Solutions, a tailor-made creative solution would allow customers to collaborate with our skilled artisans to create bespoke, handcrafted pieces tailored to their unique needs and preferences.
          </p>
        </div>

        <div className="text-section">
          <p>The customization process could involve the following steps:</p>
        </div>

        <div className="steps-section">
          <p><span className="step-title">Consultation:</span> Customers can discuss their ideas and preferences with the Anikaa Designs Solutions team, who will guide them through the design process.</p>
          <p><span className="step-title">Design:</span> Based on the customer&apos;s input, the team will create a unique design for the bespoke piece, ensuring it meets the customer&apos;s expectations and fits within their budget.</p>
          <p><span className="step-title">Production:</span> The skilled artisans at Anikaa Designs Solutions will handcraft the piece, following the approved design and using high-quality materials.</p>
          <p><span className="step-title">Delivery:</span> Once the bespoke piece is complete, it will be delivered to the customer, who can enjoy a truly unique and personalized handicraft.</p>
        </div> 
       
        <div className="text-section">
          <p>The "Custom Creations" service would be subject to its own set of terms and conditions, which could include:</p>
        </div>

        <div className="steps-section">
          <p>A non-refundable deposit to initiate the customization process.</p>
          <p>A longer lead time for production and delivery, compared to standard products.</p>
          <p>The inability to cancel or modify the order once production has started.</p>
          <p>A clear agreement on the design, materials, and budget before production begins.</p>
        </div>

        <div className="text-section">
          <p>This tailor-made creative solution would not only enhance the customer experience but also showcase the skills and expertise of the Anikaa Designs Solutions team, setting the brand apart from its competitors.</p>
        </div>
      </div>
    </div>
  );
};

export default SecondPage;
