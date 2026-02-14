import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://www.vaidyabandhu.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/logo512.png`;

/**
 * DynamicSEOHead — Reusable per-page SEO meta tag component.
 * Replaces generic <Helmet> blocks with proper dynamic meta data.
 *
 * @param {Object} props
 * @param {string} props.title - Page title (appended with " | Vaidyabandhu")
 * @param {string} props.description - Meta description (max 160 chars recommended)
 * @param {string} [props.canonicalPath] - Canonical URL path (e.g., "/doctor/63-dr-name")
 * @param {string} [props.ogImage] - Open Graph image URL
 * @param {string} [props.ogType] - Open Graph type (default: "website")
 * @param {string} [props.keywords] - Meta keywords (comma-separated)
 * @param {boolean} [props.noIndex] - If true, adds noindex meta tag
 */
function DynamicSEOHead({
    title,
    description,
    canonicalPath,
    ogImage,
    ogType = 'website',
    keywords,
    noIndex = false,
}) {
    const fullTitle = title ? `${title} | Vaidyabandhu` : 'Vaidyabandhu - Bangalore\'s Verified Medical Directory';
    const metaDescription = description || "Find verified doctors, clinics, and hospitals in Bangalore. Book appointments with trusted Ayurvedic and medical specialists on Vaidyabandhu.";
    const canonicalUrl = canonicalPath ? `${BASE_URL}${canonicalPath}` : BASE_URL;
    const imageUrl = ogImage || DEFAULT_OG_IMAGE;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={canonicalUrl} />

            {/* Robots */}
            {noIndex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="Vaidyabandhu" />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={imageUrl} />

            {/* Geo Tags for local SEO */}
            <meta name="geo.region" content="IN-KA" />
            <meta name="geo.placename" content="Bangalore" />
        </Helmet>
    );
}

export default DynamicSEOHead;
