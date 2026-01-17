import React from 'react';
import { Helmet } from "react-helmet-async";
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/blog-details/Content';
import { useParams } from 'react-router-dom'; // To get the params from the URL

const pagelocation = "Blog Details";

const Blogdetails = () => {
  // Using useParams hook to get the 'id' from the URL
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>VaidyaBandhu - Doctors Appointment Booking | {pagelocation}</title>
        <meta
          name="description"
          content="#"
        />
      </Helmet>
      <Header />
      <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
      <Content detailId={id} /> {/* Pass the 'id' as prop to the Content component */}
      <Footer />
    </>
  );
};

export default Blogdetails;
