import React, { Component, Fragment } from 'react';
import Header from '../layouts/Headertwo';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/appointment/Content';

const pagelocation = "Appointment";

class Appointment extends Component {
    render() {
        return (
            <Fragment>
                <Header />
                <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
                <Content />
                <Footer />
            </Fragment>
        );
    }
}

export default Appointment;