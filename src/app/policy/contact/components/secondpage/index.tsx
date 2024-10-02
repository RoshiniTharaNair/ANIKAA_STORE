import { Heading } from "@medusajs/ui";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkerAlt';
import '../Contact.css';



const SecondPage = () => {
  return (
    <div style={{ fontFamily: "Times New Roman,serif", backgroundColor: "#FFF", display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop:"4%" }}>
    {/* Background and Warranty Info */}
    <div className="flex flex-col items-center text-center pt-12 pb-12 main-div-contact" style={{ display: 'flex'}}>
      <div className="responsive-flex" >
        {/* Contact Information Section */}
        <div style={{ flex: '1', padding: '20px' }}>
  <Heading 
    level="h1" 
    style={{ 
      fontFamily: "AvenirNextCyr-Regular", 
      color: "#7F3F98", 
      fontWeight: 600, 
      fontSize: "16px", 
      textTransform: "uppercase", 
      letterSpacing: "0.1em", 
      marginBottom: "10px"  // Add margin-bottom to create space
    }}
  >
    TamilNadu, INDIA
  </Heading>

  <Heading 
    level="h1" 
    style={{ 
      fontFamily: "AvenirNextCyr-Regular", 
      color: "black", 
      fontWeight: 500, 
      fontSize: "16px", 
      letterSpacing: "0.01em", 
      marginBottom: "10px"  // Add margin-bottom to create space
    }}
  >
    2247, Trichy Road,
  </Heading>

  <Heading 
    level="h1" 
    style={{ 
      fontFamily: "AvenirNextCyr-Regular", 
      color: "black", 
      fontWeight: 500, 
      fontSize: "16px", 
      letterSpacing: "0.01em", 
      marginBottom: "10px"  // Add margin-bottom to create space
    }}
  >
    Coimbatore - 641005
  </Heading>

  <Heading 
    level="h1" 
    style={{ 
      fontFamily: "Times New Roman,serif", 
      color: "#7F3F98", 
      fontWeight: 500, 
      fontSize: "16px", 
      fontStyle: "italic", 
      textDecoration: "underline", 
      marginBottom: "10px"  // Add margin-bottom to create space
    }}
  >
    anikaadesignssolutions@gmail.com
  </Heading>

  <Heading 
    level="h1" 
    style={{ 
      fontFamily: "AvenirNextCyr-Regular", 
      color: "black", 
      fontWeight: 500, 
      fontSize: "16px", 
      letterSpacing: "0.01em", 
      marginBottom: "10px"  // Add margin-bottom to create space
    }}
  >
    Tel: (+91) 9362204990
  </Heading>
</div>
   
   <div style={{ flex: '1', padding: '7.5px' }}>
  <Heading 
    level="h2" 
    style={{ 
      margin: "17px", 
      fontFamily: "AvenirNextCyr-Regular", 
      color: "#7F3F98", 
      fontWeight: 600, 
      fontSize: "16px", 
      textTransform: "uppercase", 
      letterSpacing: "0.1em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }}
  >
    Operating Hours
  </Heading>
  <Heading 
    level="h3" 
    style={{ 
      margin: "10px", 
      fontFamily: "AvenirNextCyr-Regular", 
      color: "black", 
      fontWeight: 500, 
      fontSize: "16px", 
      letterSpacing: "0.05em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }}
  >
    Mon - Fri: 9am - 5pm
  </Heading>
  <Heading 
    level="h3" 
    style={{ 
      margin: "10px", 
      fontFamily: "AvenirNextCyr-Regular", 
      color: "black", 
      fontWeight: 500, 
      fontSize: "16px", 
      letterSpacing: "0.05em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }}
  >
    Saturday: 9am - 1pm
  </Heading>
  <Heading 
    level="h3" 
    style={{ 
      margin: "10px", 
      fontFamily: "AvenirNextCyr-Regular", 
      color: "black", 
      fontWeight: 500, 
      fontSize: "16px", 
      letterSpacing: "0.05em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }}
  >
    Sunday: 9am - 11 am
  </Heading>
</div>

        </div>
      </div>
    </div>
  );
};

export default SecondPage;