import React from 'react';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/doctor-grid/Content';
import Header from '../layouts/Header';
import DynamicSEOHead from '../common/DynamicSEOHead';

const pagelocation = "Expert Care Areas";

const Doctorgrid = () => {

    return (
        <>
            <DynamicSEOHead
                title="Expert Care Areas - Browse Doctors by Specialty"
                description="Explore doctors by specialty in Bangalore. Browse our verified medical professionals across Ayurveda, Cardiology, Dermatology, Orthopedics, Pediatrics, and 25+ more specialties."
                canonicalPath="/doctor-grid"
                keywords="doctor specialties Bangalore, Ayurveda specialist, cardiologist Bangalore, dermatologist, orthopedic doctor"
            />
            <Header />
            <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
            <Content />
            <Footer />
        </>
    );
};

export default Doctorgrid;
