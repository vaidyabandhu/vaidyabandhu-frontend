import React, { Component, Fragment } from 'react';
import { Helmet } from "react-helmet-async";
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Content from '../sections/about/Content';
import Footer from '../layouts/Footer';

const pagelocation = "About Vaidya Bandhu";

class About extends Component {
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>VaidyaBandhu</title>
                    <meta
                        name="description"
                        content="Vaidya Bandhu helps you find trusted clinics, doctors, and affordable healthcare services in India with guided support, transparent care options, and easy booking."
                    />
                </Helmet>
               <Header />
                <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
                <Content />
               <Footer/>
            </Fragment>
        );
    }
}

export default About;