import React, { Component, Fragment } from 'react';
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/clinic-list/Content';
import DynamicSEOHead from '../common/DynamicSEOHead';

const pagelocation = "Diagnostics & Tests";

class Cliniclist extends Component {
    render() {
        return (
            <Fragment>
                <DynamicSEOHead
                    title="Clinics & Diagnostics in Bangalore"
                    description="Find verified clinics and diagnostic centers in Bangalore. Book lab tests, health checkups, and wellness packages at trusted healthcare facilities near you."
                    canonicalPath="/clinic-list"
                    keywords="clinics Bangalore, diagnostic centers, lab tests, health checkup, wellness packages, verified clinics"
                />
                <Header />
                <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
                <Content />
                <Footer />
            </Fragment>
        );
    }
}

export default Cliniclist;