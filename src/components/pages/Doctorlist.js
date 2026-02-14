import React, { Component, Fragment } from 'react';
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/doctor-list/Content';
import DynamicSEOHead from '../common/DynamicSEOHead';

const pagelocation = "Find Our Doctors";

class Doctorlist extends Component {
    render() {
        return (
            <Fragment>
                <DynamicSEOHead
                    title="Find Verified Doctors in Bangalore"
                    description="Browse and book appointments with verified doctors in Bangalore. Filter by specialty, location, availability, and ratings. 30+ medical specialties including Ayurveda, Cardiology, Orthopedics, and more."
                    canonicalPath="/doctor-list"
                    keywords="doctors in Bangalore, find doctor, book appointment, verified doctors, Ayurvedic doctors, specialists Bangalore"
                />
                <Header />
                <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
                <Content />
                <Footer />
            </Fragment>
        );
    }
}

export default Doctorlist;