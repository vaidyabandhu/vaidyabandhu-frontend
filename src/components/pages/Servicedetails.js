import React from 'react';
import { Helmet } from "react-helmet-async";
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/service-details/Content';
import { useParams } from 'react-router-dom'; // Import the useParams hook to access URL parameters

const pagelocation = "Service Details";

const Servicedetails = () => {
  // Use the useParams hook to extract the 'id' parameter from the URL
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>VaidyaBandhu - Doctors Appointment Booking | {pagelocation}</title>
        <meta name="description" content="#" />
      </Helmet>
      <Header />
      <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
      <Content detailId={id} /> {/* Pass the 'id' to the Content component */}
      <Footer />
    </>
  );
};

export default Servicedetails;
