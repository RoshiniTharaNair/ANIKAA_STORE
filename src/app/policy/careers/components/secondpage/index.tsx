import { Heading } from "@medusajs/ui";
import '../Careers.css';

const SecondPage = () => {
  return (
    <div className="careers-second-page-container">
      <div className="careers-content-container">
        {/* Background and Warranty Info */}
        <div className="flex flex-col items-center text-center pt-12 pb-12">
          <Heading level="h1" className="careers-heading">
            Anikaa Designs Solutions Careers
          </Heading>

          <div className="careers-text-section">
            <p>
              Join our passionate team at Anikaa Designs Solutions, a leading online platform for handcrafted products, and be part of a global community that values creativity, innovation, and craftsmanship. Our mission is to connect artisans and customers, fostering a culture that celebrates the beauty of handmade items.
            </p>
          </div>

          <div className="careers-text-section">
            <p className="careers-bold-text">
              Career Opportunities
            </p>
          </div>

          <div className="careers-div">
            <p>
              Explore our diverse range of career opportunities, from e-commerce and marketing to design and customer support. We are committed to nurturing talent and providing a supportive work environment that encourages growth and development.
            </p>
          </div>

          <div className="careers-text-section">
            <p className="careers-bold-text">
              Current Openings
            </p>
          </div>

          <div className="careers-div">
            <p className="job-title">E-commerce Specialist</p>
            <p className="job-title">Digital Marketing Manager</p>
            <p className="job-title">Graphic Designer</p>
            <p className="job-title">Customer Support Representative</p>
            <p className="job-title">Social Media Coordinator</p>
          </div>

          <div className="careers-text-section">
            <p className="careers-bold-text">
              How to Apply
            </p>
          </div>

          <div className="careers-div">
            <p>
              To apply, please submit your resume and cover letter to <a href="mailto:careers@anikaadesignssolutions.com" className="mail-link">careers@anikaadesignssolutions.com</a>. In your cover letter, tell us why you are passionate about handmade products and what unique skills you bring to the table.
            </p>
          </div>

          <div className="careers-text-section">
            <p className="careers-bold-text">
              Why Join Anikaa Designs Solutions
            </p>
          </div>

          <div className="careers-div">
            <p>Be part of a global community that values creativity and craftsmanship</p>
            <p>Work with a team of passionate and dedicated professionals</p>
            <p>Enjoy a supportive work environment that encourages growth and development</p>
            <p>Make a difference in the lives of artisans and customers</p>
          </div>

          <div className="careers-text-section">
            <p className="careers-bold-text">
              Our Commitment to Diversity and Inclusion
            </p>
          </div>

          <div className="careers-div">
            <p>
              At Anikaa Designs Solutions, we are committed to fostering a diverse and inclusive workplace. We believe that diversity of thought, experience, and background leads to innovation and creativity, and we are dedicated to creating an environment where everyone feels valued and respected.
            </p>
          </div>

          <div className="careers-text-section">
            <p className="careers-bold-text">
              Equal Opportunity Employer
            </p>
          </div>

          <div className="careers-div">
            <p>
              Anikaa Designs Solutions is an equal opportunity employer. We do not discriminate on the basis of race, color, religion, gender, sexual orientation, national origin, age, disability, or any other protected class.
            </p>
          </div>

          <div className="careers-text-section">
            <p className="careers-bold-text">
              Join Our Team
            </p>
          </div>

          <div className="careers-div">
            <p>
              If you are passionate about handmade products and want to make a difference in the lives of artisans and customers, we encourage you to apply. Join our team and be part of a community that celebrates the beauty of handmade items.
            </p>
          </div>

          <div className="careers-text-section">
            <p className="careers-bold-text">
              Contact Us
            </p>
          </div>

          <div className="careers-div">
            <p>
              For any inquiries regarding our career opportunities, please contact us at <a href="mailto:careers@anikaadesignssolutions.com" className="mail-link">careers@anikaadesignssolutions.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondPage;
