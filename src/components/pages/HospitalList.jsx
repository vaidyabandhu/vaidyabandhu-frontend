import React, { Component, Fragment } from 'react';
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import HospitalListContent from '../sections/hospital';
import DynamicSEOHead from '../common/DynamicSEOHead';

const pagelocation = "Find a Hospital";

class HospitalList extends Component {
    render() {
        return (
            <Fragment>
                <DynamicSEOHead
                    title="Hospitals in Bangalore - Verified Hospital Directory"
                    description="Find verified hospitals in Bangalore and across India. Compare facilities, specialties, bed availability, and NABH accreditation. Book consultations at trusted hospitals."
                    canonicalPath="/hospital-list"
                    keywords="hospitals Bangalore, hospital directory, NABH hospitals, multispecialty hospital, verified hospitals India"
                />
                <Header />
                <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
                <HospitalListContent />
                <Footer />
            </Fragment>
        );
    }
}

export default HospitalList;