import React, { Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/doctor-details/Content';
import Header from '../layouts/Header';

const pagelocation = "Doctor Details";

function Doctordetails() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

    return (
        <Fragment>
            <Helmet>
                <title>VaidyaBandhu</title>
                <meta name="description" content="Vaidya Bandhu helps you find trusted clinics, doctors, and affordable healthcare services in India with guided support, transparent care options, and easy booking." />
            </Helmet>
            <Header />
            <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
            <Content detailId={id} />
            <Footer />
        </Fragment>
    );
}

export default Doctordetails;
