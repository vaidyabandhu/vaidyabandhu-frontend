/**
 * AutoSEO — Centralized route-level SEO configuration.
 * 
 * HOW IT WORKS:
 * - Wraps the entire app in App.js
 * - Reads the current route and automatically injects the right SEO tags
 * - No need to manually add DynamicSEOHead to every page
 * - New pages get sensible default SEO automatically
 * - To customize a page's SEO, just add an entry to SEO_CONFIG below
 * 
 * For dynamic pages (doctor details, clinic details), the page-level
 * DynamicSEOHead will override these defaults via react-helmet-async's
 * last-wins behavior.
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://www.vaidyabandhu.com';

/**
 * CENTRAL SEO CONFIG — Add entries here for any route.
 * Routes are matched from top to bottom; first match wins.
 */
const SEO_CONFIG = {
    '/': {
        title: "Bangalore's Verified Medical Directory - Find Trusted Doctors",
        description: "Find verified doctors, clinics, and hospitals in Bangalore. Book appointments with trusted Ayurvedic and medical specialists. 30+ specialties, verified registration numbers.",
        keywords: "doctors Bangalore, Ayurvedic doctors, book doctor appointment, verified doctors, Vaidyabandhu",
    },
    '/home-v2': {
        title: "Bangalore's Verified Medical Directory - Find Trusted Doctors",
        description: "Find verified doctors, clinics, and hospitals in Bangalore. Book appointments with trusted Ayurvedic and medical specialists. 30+ specialties.",
        keywords: "doctors Bangalore, Ayurvedic doctors, book doctor appointment, Vaidyabandhu",
    },
    '/doctor-list': {
        title: "Find Verified Doctors in Bangalore",
        description: "Browse and book appointments with verified doctors in Bangalore. Filter by specialty, location, availability, and ratings. 30+ medical specialties.",
        keywords: "doctors in Bangalore, find doctor, book appointment, verified doctors, specialists",
    },
    '/doctor-grid': {
        title: "Expert Care Areas - Browse Doctors by Specialty",
        description: "Explore doctors by specialty in Bangalore. Browse verified medical professionals across Ayurveda, Cardiology, Dermatology, Orthopedics, and 25+ more specialties.",
        keywords: "doctor specialties Bangalore, Ayurveda specialist, cardiologist, dermatologist",
    },
    '/clinic-list': {
        title: "Clinics & Diagnostics in Bangalore",
        description: "Find verified clinics and diagnostic centers in Bangalore. Book lab tests, health checkups, and wellness packages at trusted healthcare facilities.",
        keywords: "clinics Bangalore, diagnostic centers, lab tests, health checkup, verified clinics",
    },
    '/clinic-grid': {
        title: "Browse Clinics by Category in Bangalore",
        description: "Explore clinics and diagnostic centers by category in Bangalore. Find specialized healthcare facilities for your medical needs.",
        keywords: "clinic categories Bangalore, diagnostic specialties, healthcare facilities",
    },
    '/hospital-list': {
        title: "Hospitals in Bangalore - Verified Hospital Directory",
        description: "Find verified hospitals in Bangalore and across India. Compare facilities, specialties, bed availability, and NABH accreditation.",
        keywords: "hospitals Bangalore, hospital directory, NABH hospitals, multispecialty hospital",
    },
    '/about': {
        title: "About Vaidyabandhu - Bangalore's Trusted Medical Directory",
        description: "Learn about Vaidyabandhu — Bangalore's verified medical directory connecting patients with trusted Ayurvedic doctors, clinics, and hospitals.",
        keywords: "about Vaidyabandhu, medical directory Bangalore, verified doctors, healthcare platform",
    },
    '/contact': {
        title: "Contact Vaidyabandhu - Get in Touch",
        description: "Contact Vaidyabandhu for doctor appointments, clinic inquiries, or partnership opportunities in Bangalore. Call +91 8535853589.",
        keywords: "contact Vaidyabandhu, doctor appointment help, Bangalore healthcare contact",
    },
    '/services': {
        title: "Healthcare Services - Bandhu Seva",
        description: "Explore Vaidyabandhu's healthcare services — Ayurvedic consultations, specialist doctor appointments, diagnostic tests, and wellness packages in Bangalore.",
        keywords: "healthcare services Bangalore, Ayurvedic consultation, doctor appointment, diagnostic tests",
    },
    '/blogs': {
        title: "Health Blog - Medical Tips & Wellness Articles",
        description: "Read expert health articles, Ayurvedic wellness tips, and medical advice from verified doctors in Bangalore.",
        keywords: "health blog, medical articles, Ayurvedic tips, wellness advice, doctor articles",
    },
    '/blog-standard': {
        title: "Health Articles - Latest Medical News",
        description: "Read the latest health articles and medical insights from Vaidyabandhu's verified healthcare professionals in Bangalore.",
        keywords: "health articles, medical news, wellness blog, doctor insights",
    },
    '/faqs': {
        title: "Frequently Asked Questions - Vaidyabandhu",
        description: "Find answers to common questions about Vaidyabandhu — doctor verification, appointment booking, specialties, and Bangalore coverage.",
        keywords: "Vaidyabandhu FAQ, doctor appointment questions, verified doctors FAQ",
    },
    '/appointment': {
        title: "Book Doctor Appointment Online in Bangalore",
        description: "Book your doctor appointment online with verified medical specialists in Bangalore. Quick, easy, and trusted healthcare booking on Vaidyabandhu.",
        keywords: "book appointment online, doctor appointment Bangalore, online consultation",
    },
    '/diagnostic-list': {
        title: "Diagnostic Centers in Bangalore",
        description: "Find verified diagnostic centers and labs in Bangalore. Book lab tests, scans, and health checkups at trusted facilities near you.",
        keywords: "diagnostic centers Bangalore, lab tests, health checkup, pathology labs",
    },
};

/**
 * Match the current pathname to a SEO config entry.
 * Supports exact matches and prefix matches for dynamic routes.
 */
function getSEOForPath(pathname) {
    // Exact match first
    if (SEO_CONFIG[pathname]) {
        return { ...SEO_CONFIG[pathname], canonicalPath: pathname };
    }

    // Prefix match for dynamic routes
    const prefixMap = [
        { prefix: '/doctor/', fallbackKey: '/doctor-list' },
        { prefix: '/clinic-details/', fallbackKey: '/clinic-list' },
        { prefix: '/clinic/', fallbackKey: '/clinic-list' },
        { prefix: '/blog-details/', fallbackKey: '/blogs' },
        { prefix: '/blog/', fallbackKey: '/blogs' },
        { prefix: '/service-details/', fallbackKey: '/services' },
        { prefix: '/service/cat/', fallbackKey: '/services' },
        { prefix: '/doctor/cat/', fallbackKey: '/doctor-grid' },
        { prefix: '/clinic/cat/', fallbackKey: '/clinic-grid' },
    ];

    for (const { prefix, fallbackKey } of prefixMap) {
        if (pathname.startsWith(prefix) && SEO_CONFIG[fallbackKey]) {
            return { ...SEO_CONFIG[fallbackKey], canonicalPath: pathname };
        }
    }

    // Default fallback — every page gets valid SEO, never "#"
    return {
        title: formatPathAsTitle(pathname),
        description: "Vaidyabandhu — Bangalore's verified medical directory. Find trusted doctors, clinics, and hospitals. Book appointments with 30+ specialties.",
        keywords: "Vaidyabandhu, doctors Bangalore, medical directory, healthcare",
        canonicalPath: pathname,
    };
}

/**
 * Convert a path like "/basic-details" to "Basic Details | Vaidyabandhu"
 */
function formatPathAsTitle(path) {
    const segment = path.split('/').filter(Boolean)[0] || 'Page';
    return segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * AutoSEO Component — place this inside <Router> in App.js.
 * It auto-injects proper SEO meta tags for every route.
 * Page-level DynamicSEOHead components will override these defaults.
 */
function AutoSEO() {
    const { pathname } = useLocation();
    const seo = getSEOForPath(pathname);

    const fullTitle = seo.title
        ? (seo.title.includes('Vaidyabandhu') || seo.title.includes('Vaidyabandhu')
            ? seo.title
            : `${seo.title} | Vaidyabandhu`)
        : "Vaidyabandhu - Bangalore's Verified Medical Directory";

    const canonicalUrl = `${BASE_URL}${seo.canonicalPath || pathname}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={seo.description} />
            {seo.keywords && <meta name="keywords" content={seo.keywords} />}
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Vaidyabandhu" />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={seo.description} />

            {/* Local SEO Geo Tags */}
            <meta name="geo.region" content="IN-KA" />
            <meta name="geo.placename" content="Bangalore" />
        </Helmet>
    );
}

export default AutoSEO;
export { SEO_CONFIG, getSEOForPath };
