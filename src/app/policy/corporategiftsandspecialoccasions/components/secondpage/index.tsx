import { Heading } from "@medusajs/ui";
import '../Corporate.css';

const SecondPage = () => {
  return (
    <div className="corporate-page-container">
      {/* Background and Warranty Info */}
      <div className="content-wrapper">
        <Heading
          level="h1"
          className="main-heading"
        >
          Anikaa Designs Solutions Corporate Gifts and Special Occasions
        </Heading>

        <div className="text-section">
          <p>
            At Anikaa Designs Solutions, we understand the importance of expressing gratitude and appreciation in both personal and professional relationships. Our carefully curated collection of handcrafted gifts is designed to celebrate special occasions, corporate milestones, and personal achievements. Explore our range of exquisite gifts, each one a testament to the craftsmanship and creativity that defines Anikaa Designs Solutions.
          </p>
        </div>

        <div className="section">
          <Heading level="h2" className="sub-heading">Corporate Gifts</Heading>
          <div className="corporate-div">
            <p><span className="bold-text">Business Anniversaries:</span> Mark your company&apos;s milestones with unique and thoughtful gifts that reflect your brand&apos;s values and commitment to excellence.</p>
            <p><span className="bold-text">Incentives and Loyalty Programs:</span> Reward your employees and clients with gifts that inspire and motivate, fostering a culture of appreciation and loyalty.</p>
            <p><span className="bold-text">Special Times of the Year:</span> Celebrate holidays, festivals, and other special times of the year with gifts that bring joy and warmth to your professional relationships.</p>
          </div>
        </div>

        <div className="section">
          <Heading level="h2" className="sub-heading">Special Occasions</Heading>
          <div className="corporate-div">
            <p><span className="bold-text">Weddings:</span> Find the perfect gift for the newlyweds, symbolizing love, unity, and a bright future together.</p>
            <p><span className="bold-text">Baptisms:</span> Welcome new members to your family or community with a meaningful and memorable gift.</p>
            <p><span className="bold-text">Anniversaries:</span> Celebrate love, commitment, and togetherness with a gift that marks the significance of the occasion.</p>
          </div>
        </div>

        <div className="section">
          <Heading level="h2" className="sub-heading">Customization and Personalization</Heading>
          <div className="corporate-div">
            <p><span className="bold-text">Personalized Cards:</span> Add a personal touch with custom cards that convey your message of gratitude, appreciation, or celebration.</p>
            <p><span className="bold-text">Logo Customization:</span> Enhance your corporate gifts with your company logo, creating a lasting impression and reinforcing your brand identity.</p>
            <p><span className="bold-text">Packaging:</span> Choose from a wide range of packaging options to create beautifully branded gifts that reflect your company&apos;s style and color scheme.</p>
          </div>
        </div>

        <div className="section">
          <Heading level="h2" className="sub-heading">Special Occasion Gifts</Heading>
          <div className="corporate-div">
            <p><span className="bold-text">Birthdays:</span> Celebrate your employees&apos;, clients&apos;, or partners&apos; special day with a gift that shows you remember and appreciate them.</p>
            <p><span className="bold-text">Retirement:</span> Honor the contributions and dedication of employees or clients who are retiring with a thoughtful and meaningful gift.</p>
            <p><span className="bold-text">Achievements and Milestones:</span> Recognize and reward employees, clients, or partners for their achievements, goals, or milestones within the company or their personal lives.</p>
          </div>
        </div>

        <div className="text-section">
          <p>
            At Anikaa Designs Solutions, we are committed to providing you with a wide range of handcrafted gifts that celebrate life&apos;s special moments and strengthen your professional relationships. If you cannot find what you are looking for, please contact us, and we will be happy to assist you in finding the perfect gift for your occasion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecondPage;
