import React, { Fragment } from 'react';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/clinic-details/Content';
import { useParams } from 'react-router-dom';
import Header from '../layouts/Header';
import DynamicSEOHead from '../common/DynamicSEOHead';

const pagelocation = "Clinic Details";

const Clinicdetails = () => {
  const { id } = useParams();

  return (
    <Fragment>
      <DynamicSEOHead
        title="Clinic Details - Verified Healthcare Facility"
        description="View verified clinic details, services, contact information, and patient reviews. Book appointments at trusted healthcare facilities in Bangalore."
        canonicalPath={`/clinic-details/${id}`}
        keywords="clinic details, verified clinic Bangalore, healthcare facility, book appointment"
      />
      <Header />
      <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
      <Content detailId={id} />
      <Footer />
    </Fragment>
  );
};

export default Clinicdetails;
