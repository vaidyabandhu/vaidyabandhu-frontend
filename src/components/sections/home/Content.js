import React, { Component, Fragment } from "react";
import Banner from "./Banner";
import Searchform from "./Searchform";
import Services from "./Services";
import Whyus from "./Whyus";
import Counter from "./Counter";
import Servicesimage from "./Servicesimage";
import Newsletter from "./Newsletter";
import Clients from "./Clients";
import Workprocess from "./Workprocess";
import Team from "./Team";
import Blogs from "./Blogs";
import Testimonials from "./Testimonials";
import ClientLogosCarousel from "./ClientLogosCarousel";
import HealthcareReality from "./HealthcareReality";
import MembershipCardBenefits from "./MembershipCardBenefits";
import FAQSection from "./FAQSection";
import DoctorsComponent from "./DoctorsComponent";
import ClientTestimonials from "./Client";

class Content extends Component {
  render() {
    return (
      <Fragment>
        <Banner />
        {/* <Searchform /> */}
        <HealthcareReality />
        <Services />
        <div className="section bg-secondary-1">
          <div className="container">
            <Whyus />
            <Counter />
          </div>
        </div>
        <div style={{ marginTop: "130px" }}>
          <Workprocess />
        </div>
        <MembershipCardBenefits />
        {/* <DoctorsComponent /> */}
        <ClientLogosCarousel />
        <Testimonials />
        <ClientTestimonials />
        <FAQSection />
        {/* <div className="container-fluid p-0">
                    <Galleryslider />
                </div> */}
      </Fragment>
    );
  }
}

export default Content;
