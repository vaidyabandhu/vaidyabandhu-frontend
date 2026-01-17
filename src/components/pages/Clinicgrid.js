import React from 'react';
import { Helmet } from "react-helmet-async";
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/clinic-grid/Content';
import { useParams } from 'react-router-dom'; // Import the useParams hook to get URL params

const pagelocation = "Clinic Grid";

const Clinicgrid = () => {
  // Use the useParams hook to extract 'catId' from the URL
  const { catId } = useParams();

  return (
    <>
      <Helmet>
        <title>VaidyaBandhu - Doctors Appointment Booking  | {pagelocation}</title>
        <meta name="description" content="#" />
      </Helmet>
      <Header />
      <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
      <Content catId={catId} /> {/* Pass the catId to the Content component */}
      <Footer />
    </>
  );
};

export default Clinicgrid;
