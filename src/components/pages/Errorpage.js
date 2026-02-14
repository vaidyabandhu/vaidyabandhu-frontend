import React, { Component, Fragment } from 'react';
import Header from '../layouts/Headertwo';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/error-page/Content';
import DynamicSEOHead from '../common/DynamicSEOHead';

const pagelocation = "Error 404";

class Errorpage extends Component {
    render() {
        return (
            <Fragment>
                <DynamicSEOHead
                    title="Page Not Found"
                    description="The page you are looking for does not exist. Return to Vaidyabandhu to find verified doctors, clinics, and hospitals in Bangalore."
                    noIndex={true}
                />
                <Header />
                <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
                <Content />
                <Footer />
            </Fragment>
        );
    }
}

export default Errorpage;