import React from "react";
import Header from "../layouts/Header";
import ProfileContent from "../sections/myprofile/ProfileContent";
import Footer from "../layouts/Footer";

const MyProfile = () => {
  return (
    <>
      <Header />
      <div className="vb-global-header-spacer" />
      <main className="vb-profile-page-wrap">
        <ProfileContent />
      </main>
      <Footer />
    </>
  );
};

export default MyProfile;
