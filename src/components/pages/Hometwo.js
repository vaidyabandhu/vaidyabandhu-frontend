import React, { Component, Fragment } from 'react';
import Header from '../layouts/Headertwo';
import Footer from '../layouts/Footer';
import Content from '../sections/home-two/Content';

class Hometwo extends Component {
    render() {
        return (
            <Fragment>
                <Header />
                <Content />
                <Footer />
            </Fragment>
        );
    }
}

export default Hometwo;