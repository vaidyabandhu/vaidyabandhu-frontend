import React, { Component, Fragment } from 'react';
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/contact/Content';
import DynamicSEOHead from '../common/DynamicSEOHead';

const pagelocation = "We're Here to Help";

class Contact extends Component {
    render() {
        return (
            <Fragment>
                <DynamicSEOHead
                    title="Contact Vaidyabandhu - Get in Touch"
                    description="Contact Vaidyabandhu for doctor appointments, clinic inquiries, or partnership opportunities in Bangalore. Call +91 8535853589 or email support@vaidyabandhu.com."
                    canonicalPath="/contact"
                    keywords="contact Vaidyabandhu, doctor appointment help, Bangalore healthcare contact"
                />
                <Header />
                <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
                <Content />
                <Footer />
            </Fragment>
        );
    }
}

export default Contact;