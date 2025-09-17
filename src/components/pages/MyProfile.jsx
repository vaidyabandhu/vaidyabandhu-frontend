import React from "react";
import Header from "../layouts/Header";
import ProfileContent from "../sections/myprofile/ProfileContent";
import Footer from "../layouts/Footer";

const MyProfile = () => {
  return (
    <>
      <Header />
      <div style={{ height: '200px' }}></div> 
      <ProfileContent />
      <Footer/>
    </>
  );
};

export default MyProfile;
