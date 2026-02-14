import React from 'react';
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/clinic-grid/Content';
import { useParams } from 'react-router-dom';

const pagelocation = "Clinic Grid";

const Clinicgrid = () => {
  const { catId } = useParams();

  return (
    <>
      <Header />
      <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
      <Content catId={catId} />
      <Footer />
    </>
  );
};

export default Clinicgrid;
