import React, { Component, Fragment } from 'react';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/clinic-list-details/Content';
import Header from '../layouts/Header';

const pagelocation = "Diagnostics Details";

class ClinicListdetails extends Component {
    render() {
        return (
            <Fragment>
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