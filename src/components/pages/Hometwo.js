import React, { Component, Fragment } from 'react';
import { Helmet } from "react-helmet-async";
import Header from '../layouts/Headertwo';
import Footer from '../layouts/Footer';
import Content from '../sections/home-two/Content';

const pagelocation = "Homepage";

class Hometwo extends Component {
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>VaidyaBandhu - Doctors Appointment Booking | {pagelocation}</title>
                    <meta
                        name="description"
                        content="Vaidya Bandhu helps you find trusted clinics, doctors, and affordable healthcare services in India with guided support, transparent care options, and easy booking."
                    />
                </Helmet>
                <Header />
                <Content />
                <Footer />
            </Fragment>
        );
    }
}

export default Hometwo;