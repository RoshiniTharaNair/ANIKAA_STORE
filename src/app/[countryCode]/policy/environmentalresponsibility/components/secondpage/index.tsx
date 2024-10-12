import { Heading } from "@medusajs/ui";
import '../Environment.css';

const SecondPage = () => {
  return (
    <div className="environment-page-container">
      {/* Background and Warranty Info */}
      <div className="content-wrapper">
        <Heading
          level="h1"
          className="environment-heading"
          style={{textAlign:"center", display:"flex",  justifyContent:"center"}}
        >
          Environmental Responsibility
        </Heading>

        <div className="text-section">
          <p>
            At Anikaa Designs Solutions, we are committed to environmental responsibility and have implemented various initiatives to minimize our impact on the environment. Here are some specific environmental initiatives we have taken:
          </p>
        </div>

        <div className="section">
          <div className="environment-div">
            <p><span className="bold-text">Water Conservation:</span> We strive to conserve water by reducing water intake from external sources and implementing a system of recycling water in our production process. This involves filtering and reusing water multiple times to minimize freshwater usage.</p>
            <p><span className="bold-text">Waste Management:</span> We aim to minimize waste and emissions, focusing on reducing the use of harmful substances in our production process. Our production cycle does not include processes like pyrolysis that could release harmful substances into the environment.</p>
            <p><span className="bold-text">Sustainable Materials:</span> We prioritize the use of sustainable materials in our products, focusing on recycling and repurposing waste materials whenever possible. For example, we use excess materials for other purposes, such as filling or insulation.</p>
            <p><span className="bold-text">Biodiversity Conservation:</span> We are committed to preserving biodiversity in the areas where we operate. This includes rehabilitating damaged areas, planting trees, and protecting local wildlife populations.</p>
            <p><span className="bold-text">Community Engagement:</span> We engage with local communities to promote environmental awareness and encourage sustainable practices. This includes participating in local conservation initiatives and supporting local environmental organizations.</p>
            <p><span className="bold-text">Continuous Improvement:</span> We regularly review and update our environmental policies and practices to ensure that we are continually improving our environmental performance. This includes setting ambitious sustainability goals and working towards achieving them.</p>
          </div>
        </div>

        <div className="text-section">
          <p>
            By implementing these environmental initiatives, we aim to minimize our impact on the environment, promote sustainability, and contribute to a better future for all.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecondPage;
