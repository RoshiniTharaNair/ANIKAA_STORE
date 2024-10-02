"use client";
import HeadingPage from "./components/headingpage"; 
import SecondPage from "./components/secondpage"



const PrivacyPolicyTemplate = () => {
  return (
    <div className="h-auto w-full border-b border-ui-border-base relative flex flex-col " style={{ fontFamily: "Warnock Pro Display",background: "#fff" }}>
     <HeadingPage />
     <SecondPage />
    </div>
  );
};

export default PrivacyPolicyTemplate;
