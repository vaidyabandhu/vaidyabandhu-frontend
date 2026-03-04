import React, { Component, Fragment } from 'react';
import { Helmet } from "react-helmet-async";
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import HospitalListContent from '../sections/hospital';

const pagelocation = "Find a Hospital";

class HospitalList extends Component {
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>VaidyaBandhu </title>
                    <meta
                        name="description"
                        content="Vaidya Bandhu helps you find trusted clinics, doctors, and affordable healthcare services in India with guided support, transparent care options, and easy booking."
                    />
                </Helmet>
                <Header />
                <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
                <HospitalListContent />
                <Footer />
            </Fragment>
        );
    }
}

export default HospitalList;