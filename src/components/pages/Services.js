import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/services/Content';
import DynamicSEOHead from '../common/DynamicSEOHead';

const pagelocation = "Bandhu Seva";

// Class component (renamed)
class ServicesClass extends React.Component {
    render() {
        return (
            <>
                <DynamicSEOHead
                    title="Healthcare Services - Bandhu Seva"
                    description="Explore Vaidyabandhu's healthcare services in Bangalore — Ayurvedic consultations, specialist doctor appointments, diagnostic tests, wellness packages, and more. Book verified practitioners today."
                    canonicalPath="/services"
                    keywords="healthcare services Bangalore, Ayurvedic consultation, doctor appointment, diagnostic tests, wellness packages"
                />
                <Header />
                <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
                <Content
                    catId={this.props.catId}
                />
                <Footer />
            </>
        );
    }
}

// Wrapper function component using hooks
function Services() {
    const { catId } = useParams();

    return <ServicesClass catId={catId} />;
}

export default Services;