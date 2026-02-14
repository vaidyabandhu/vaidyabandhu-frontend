import React, { Component, Fragment } from 'react';
import Header from '../layouts/Headertwo';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/faqs/Content';
import DynamicSEOHead from '../common/DynamicSEOHead';
import { FAQPageSchema } from '../common/JsonLdSchema';

const pagelocation = "FAQ's";

const faqItems = [
    {
        question: "How do I book a doctor appointment on Vaidyabandhu?",
        answer: "Browse our doctor list, select a verified doctor, and click 'Book Appointment'. You can filter by specialty, location, and availability to find the right doctor."
    },
    {
        question: "Are all doctors on Vaidyabandhu verified?",
        answer: "Yes, every doctor on Vaidyabandhu undergoes a multi-step verification process including medical registration number validation with state medical councils."
    },
    {
        question: "What specialties are available on Vaidyabandhu?",
        answer: "We offer 30+ specialties including Ayurvedic Medicine, General Practice, Cardiology, Orthopedics, Dermatology, Pediatrics, Dental Care, ENT, Ophthalmology, and more."
    },
    {
        question: "Does Vaidyabandhu cover all areas in Bangalore?",
        answer: "Yes, we cover 50+ neighborhoods in Bangalore including Indiranagar, Koramangala, Jayanagar, Whitefield, HSR Layout, JP Nagar, Malleshwaram, and more."
    },
];

class Faqs extends Component {
    render() {
        return (
            <Fragment>
                <DynamicSEOHead
                    title="Frequently Asked Questions - Vaidyabandhu"
                    description="Find answers to common questions about Vaidyabandhu — doctor verification, appointment booking, specialties available, Bangalore coverage, and more."
                    canonicalPath="/faqs"
                    keywords="Vaidyabandhu FAQ, doctor appointment questions, verified doctors FAQ, Bangalore healthcare"
                />
                <FAQPageSchema faqs={faqItems} />
                <Header />
                <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
                <Content />
                <Footer />
            </Fragment>
        );
    }
}

export default Faqs;