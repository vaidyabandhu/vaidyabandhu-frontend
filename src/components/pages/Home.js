import React, { Component, Fragment } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Content from '../sections/home/Content';
import Banner from '../sections/home/Banner';
import DynamicSEOHead from '../common/DynamicSEOHead';
import { WebSiteSchema, FAQPageSchema } from '../common/JsonLdSchema';

const homeFaqs = [
    {
        question: "How do I find a verified doctor in Bangalore on Vaidyabandhu?",
        answer: "Visit our Doctor List page, use the search bar or filters to find specialists by name, specialty, location, or availability. All listed doctors have verified medical registration numbers."
    },
    {
        question: "What types of doctors are available on Vaidyabandhu?",
        answer: "Vaidyabandhu covers 30+ specialties including Ayurvedic Medicine, General Practice, Cardiology, Orthopedics, Dermatology, Pediatrics, Dental Care, and more — all verified practitioners in Bangalore."
    },
    {
        question: "How does Vaidyabandhu verify its doctors?",
        answer: "Every doctor undergoes a multi-step verification process including medical registration number validation with state medical councils, credential checks, and ongoing patient review monitoring for E-E-A-T compliance."
    },
    {
        question: "Can I book a doctor appointment online in Bangalore?",
        answer: "Yes! Vaidyabandhu allows you to book appointments online with verified doctors across Bangalore neighborhoods including Indiranagar, Koramangala, Jayanagar, Whitefield, and more."
    },
];

class Home extends Component {
    render() {
        return (
            <Fragment>
                <DynamicSEOHead
                    title="Bangalore's Verified Medical Directory - Find Trusted Doctors"
                    description="Find verified doctors, clinics, and hospitals in Bangalore. Book appointments with trusted Ayurvedic and medical specialists. Verified registration numbers, patient trust scores, 30+ specialties."
                    canonicalPath="/"
                    keywords="doctors in Bangalore, Ayurvedic doctors Bangalore, book doctor appointment, verified doctors, clinics Bangalore, hospitals Bangalore, Vaidyabandhu"
                />
                <WebSiteSchema />
                <FAQPageSchema faqs={homeFaqs} />
                <Header />
                <Banner />
                <Content />
                <Footer />
            </Fragment>
        );
    }
}

export default Home;
