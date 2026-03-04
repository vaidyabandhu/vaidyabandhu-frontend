import React, { Component, Fragment } from 'react';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/clinic-list-details/Content';
import Header from '../layouts/Header';
import { Helmet } from 'react-helmet-async';

const pagelocation = "Diagnostics Details";

class ClinicListdetails extends Component {
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>VaidyaBandhu - Doctors Appointment Booking - Diagnostics details | {pagelocation}</title>
                    <meta
                        name="description"
                        content="Vaidya Bandhu helps you find trusted clinics, doctors, and affordable healthcare services in India with guided support, transparent care options, and easy booking."
                    />
                </Helmet>
                <Header />
                <Breadcrumbs breadcrumb={{ pagename: pagelocation, lastPagePath: '/clinic-list', page: 'Diagnostics' }} />
                <Content
                />
                <Footer />
            </Fragment>
        );
    }
}

export default ClinicListdetails;