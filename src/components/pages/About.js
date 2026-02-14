import React, { Component, Fragment } from 'react';
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Content from '../sections/about/Content';
import Footer from '../layouts/Footer';
import DynamicSEOHead from '../common/DynamicSEOHead';

const pagelocation = "About Vaidya Bandhu";

class About extends Component {
    render() {
        return (
            <Fragment>
                <DynamicSEOHead
                    title="About Vaidyabandhu - Bangalore's Trusted Medical Directory"
                    description="Learn about Vaidyabandhu — Bangalore's verified medical directory connecting patients with trusted Ayurvedic doctors, clinics, and hospitals. Our verification process ensures E-E-A-T compliance."
                    canonicalPath="/about"
                    keywords="about Vaidyabandhu, medical directory Bangalore, verified doctors, healthcare platform India"
                />
                <Header />
                <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
                <Content />
                <Footer />
            </Fragment>
        );
    }
}

export default About;