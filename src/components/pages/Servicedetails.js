import React from 'react';
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/service-details/Content';
import { useParams } from 'react-router-dom';

const pagelocation = "Service Details";

const Servicedetails = () => {
  const { id } = useParams();

  return (
    <>
      <Header />
      <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
      <Content detailId={id} />
      <Footer />
    </>
  );
};

export default Servicedetails;
