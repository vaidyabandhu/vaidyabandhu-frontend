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
                        content="#"
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