import React, { Component, Fragment } from 'react';
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/basic-detail/Content';
import DynamicSEOHead from '../common/DynamicSEOHead';

const pagelocation = "Membership Form";

class BasicDetail extends Component {
    render() {
        return (
            <Fragment>
                <DynamicSEOHead
                    title="Membership Form"
                    description="Complete your Vaidyabandhu membership registration to access verified doctor profiles, appointment booking, and healthcare services in Bangalore."
                    noIndex={true}
                />
                <Header />
                <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
                <Content
                />
                <Footer />
            </Fragment>
        );
    }
}

export default BasicDetail;