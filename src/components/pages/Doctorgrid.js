import React from 'react';
import { Helmet } from "react-helmet-async";
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/doctor-grid/Content';
import Header from '../layouts/Header';

const pagelocation = "Expert Care Areas";

const Doctorgrid = () => {
    
    return (
        <>
            <Helmet>
                <title>VaidyaBandhu</title>
                <meta name="description" content="Vaidya Bandhu helps you find trusted clinics, doctors, and affordable healthcare services in India with guided support, transparent care options, and easy booking." />
            </Helmet>
            <Header />
            <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
            <Content />
            <Footer />
        </>
    );
};

export default Doctorgrid;
