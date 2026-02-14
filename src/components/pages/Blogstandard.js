import React, { Component, Fragment } from 'react';
import Header from '../layouts/Headertwo';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/blog-standard/Content';

const pagelocation = "Blog Standard";

class Blogstandard extends Component {
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

export default Blogstandard;