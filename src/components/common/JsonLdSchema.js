import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://www.vaidyabandhu.com';

/**
 * Physician Schema (schema.org/Physician)
 * For individual doctor profile pages.
 */
export function PhysicianSchema({ doctor }) {
    if (!doctor) return null;

    const specialties = doctor.speciality?.map(s => s.title).filter(Boolean) || [];
    const hospitalName = doctor.hospital?.[0]?.name || 'Vaidyabandhu Partner Clinic';
    const hospitalAddress = doctor.hospital?.[0]?.address || 'Bangalore, Karnataka, India';

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Physician',
        name: doctor.full_name || 'Doctor',
        image: doctor.photo || `${BASE_URL}/assets/img/default-img.jpg`,
        description: `${doctor.full_name} is a verified ${specialties[0] || 'medical'} specialist in Bangalore with ${doctor.experience || 'several'} years of experience. ${doctor.qualification || ''}`.trim(),
        medicalSpecialty: specialties[0] || 'General Practice',
        knowsAbout: specialties,
        jobTitle: doctor.designation || 'Medical Practitioner',
        qualification: doctor.qualification || '',
        experience: doctor.experience ? `${doctor.experience} years` : undefined,
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Bangalore',
            addressRegion: 'Karnataka',
            addressCountry: 'IN',
            streetAddress: hospitalAddress,
        },
        worksFor: {
            '@type': 'MedicalBusiness',
            name: hospitalName,
            address: hospitalAddress,
        },
        url: `${BASE_URL}/doctor/${doctor.id}-${encodeURIComponent((doctor.full_name || '').toLowerCase().replace(/\s+/g, '-'))}`,
        telephone: doctor.hospital?.[0]?.mobile || '+91 8535853589',
        email: doctor.email || 'support@vaidyabandhu.com',
        isAcceptingNewPatients: true,
        availableService: specialties.map(s => ({
            '@type': 'MedicalProcedure',
            name: s,
        })),
    };

    // Remove undefined values
    const cleanSchema = JSON.parse(JSON.stringify(schema));

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(cleanSchema)}
            </script>
        </Helmet>
    );
}

/**
 * MedicalBusiness Schema (schema.org/MedicalBusiness)
 * For clinic and hospital pages.
 */
export function MedicalBusinessSchema({ clinic }) {
    if (!clinic) return null;

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'MedicalBusiness',
        name: clinic.name || 'Medical Clinic',
        image: clinic.photo || clinic.image || `${BASE_URL}/assets/img/default-img.jpg`,
        description: `${clinic.name} is a verified healthcare facility in Bangalore offering ${clinic.specialist || 'medical'} services.`,
        address: {
            '@type': 'PostalAddress',
            streetAddress: clinic.address || '',
            addressLocality: 'Bangalore',
            addressRegion: 'Karnataka',
            addressCountry: 'IN',
        },
        telephone: clinic.mobile || clinic.phone || '+91 8535853589',
        url: `${BASE_URL}/clinic/${clinic.id}`,
        priceRange: '₹₹',
        medicalSpecialty: clinic.specialist || 'General Practice',
        isAcceptingNewPatients: true,
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}

/**
 * FAQPage Schema (schema.org/FAQPage)
 * For FAQ sections on any page.
 * @param {Array} faqs - Array of { question, answer } objects
 */
export function FAQPageSchema({ faqs }) {
    if (!faqs || faqs.length === 0) return null;

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}

/**
 * WebSite Schema (schema.org/WebSite)
 * For the homepage — enables sitelinks search box in Google.
 */
export function WebSiteSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Vaidyabandhu',
        alternateName: 'VaidyaBandhu - Bangalore Medical Directory',
        url: BASE_URL,
        description: "Bangalore's premier verified medical directory connecting patients with trusted Ayurvedic doctors, clinics, and hospitals.",
        publisher: {
            '@type': 'Organization',
            name: 'Vaidyabandhu',
            logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/logo512.png`,
            },
        },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${BASE_URL}/doctor-list?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}

/**
 * LocalBusiness Schema (schema.org/LocalBusiness)
 * For hyper-local neighborhood landing pages.
 */
export function LocalBusinessSchema({ neighborhood, specialty }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: `Vaidyabandhu - ${specialty || 'Healthcare'} in ${neighborhood || 'Bangalore'}`,
        description: `Find verified ${specialty || 'healthcare'} practitioners in ${neighborhood || 'Bangalore'}. Book appointments with trusted doctors on Vaidyabandhu.`,
        address: {
            '@type': 'PostalAddress',
            addressLocality: neighborhood || 'Bangalore',
            addressRegion: 'Karnataka',
            addressCountry: 'IN',
        },
        url: BASE_URL,
        telephone: '+91 8535853589',
        priceRange: '₹₹',
        areaServed: {
            '@type': 'City',
            name: 'Bangalore',
        },
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}

/**
 * BreadcrumbList Schema (schema.org/BreadcrumbList)
 * Helps search engines understand page hierarchy.
 */
export function BreadcrumbSchema({ items }) {
    if (!items || items.length === 0) return null;

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url ? `${BASE_URL}${item.url}` : undefined,
        })),
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}
