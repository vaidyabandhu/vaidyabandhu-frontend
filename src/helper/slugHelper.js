/**
 * SEO Slug Helper Utilities
 * Generates SEO-friendly URL slugs for doctors, clinics, and other entities.
 * Pattern: {id}-{name}-{specialty}-{city} → e.g., "63-dr-suresh-kumar-ayurveda-bangalore"
 */

/**
 * Sanitize a string into a URL-safe slug segment.
 * @param {string} str - The string to slugify
 * @returns {string} URL-safe lowercase slug
 */
function slugify(str) {
    if (!str) return '';
    return str
        .toString()
        .toLowerCase()
        .trim()
        .replace(/['']/g, '')              // Remove apostrophes
        .replace(/&/g, 'and')              // Replace & with 'and'
        .replace(/[^\w\s-]/g, '')          // Remove non-word chars (except spaces & hyphens)
        .replace(/[\s_]+/g, '-')           // Replace spaces/underscores with hyphens
        .replace(/-+/g, '-')               // Collapse multiple hyphens
        .replace(/^-+|-+$/g, '');          // Trim leading/trailing hyphens
}

/**
 * Generate an SEO-friendly slug for a doctor.
 * @param {Object} doctor - Doctor object from API
 * @param {number|string} doctor.id - Doctor ID
 * @param {string} doctor.full_name - Doctor's full name
 * @param {Array} [doctor.speciality] - Array of { title } specialty objects
 * @param {Array} [doctor.hospital] - Array of hospital objects with address/city
 * @returns {string} SEO slug like "63-dr-suresh-kumar-ayurveda-bangalore"
 */
export function generateDoctorSlug(doctor) {
    if (!doctor || !doctor.id) return '';

    const parts = [doctor.id];

    // Add doctor name
    if (doctor.full_name) {
        parts.push(slugify(doctor.full_name));
    }

    // Add first specialty
    if (doctor.speciality && doctor.speciality.length > 0 && doctor.speciality[0].title) {
        parts.push(slugify(doctor.speciality[0].title));
    }

    // Add city from hospital address (default to bangalore)
    let city = 'bangalore';
    if (doctor.hospital && doctor.hospital.length > 0) {
        const addr = doctor.hospital[0].address || doctor.hospital[0].city || '';
        const extracted = extractCity(addr);
        if (extracted) city = slugify(extracted);
    }
    parts.push(city);

    return parts.filter(Boolean).join('-');
}

/**
 * Extract numeric ID from a slug string.
 * Slugs start with the numeric ID: "63-dr-suresh-kumar" → 63
 * @param {string} slug - The URL slug
 * @returns {number|null} Extracted numeric ID or null
 */
export function extractIdFromSlug(slug) {
    if (!slug) return null;
    const match = slug.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : null;
}

/**
 * Generate an SEO-friendly slug for a clinic.
 * @param {Object} clinic - Clinic object
 * @returns {string} SEO slug
 */
export function generateClinicSlug(clinic) {
    if (!clinic || !clinic.id) return '';

    const parts = [clinic.id];

    if (clinic.name) {
        parts.push(slugify(clinic.name));
    }

    if (clinic.specialist) {
        parts.push(slugify(clinic.specialist));
    }

    parts.push('bangalore');

    return parts.filter(Boolean).join('-');
}

/**
 * Extract numeric ID from a clinic slug.
 * @param {string} slug - The URL slug
 * @returns {number|null} Extracted numeric ID or null
 */
export function extractClinicIdFromSlug(slug) {
    return extractIdFromSlug(slug);
}

/**
 * Generate an SEO-friendly slug for a blog post.
 * @param {Object} blog - Blog post object
 * @returns {string} SEO slug
 */
export function generateBlogSlug(blog) {
    if (!blog || !blog.id) return '';
    const parts = [blog.id];
    if (blog.title) parts.push(slugify(blog.title));
    return parts.filter(Boolean).join('-');
}

/**
 * Generate the full URL path for a doctor.
 * @param {Object} doctor - Doctor object
 * @returns {string} Full path like "/doctor/63-dr-suresh-kumar-ayurveda-bangalore"
 */
export function getDoctorUrl(doctor) {
    const slug = generateDoctorSlug(doctor);
    return slug ? `/doctor/${slug}` : '/doctor-list';
}

/**
 * Generate the full URL path for a clinic.
 * @param {Object} clinic - Clinic object
 * @returns {string} Full path like "/clinic/5-wellness-center-bangalore"
 */
export function getClinicUrl(clinic) {
    const slug = generateClinicSlug(clinic);
    return slug ? `/clinic/${slug}` : '/clinic-list';
}

/**
 * Extract a city name from an address string.
 * Common Bangalore neighborhood patterns.
 * @param {string} address - Full address string
 * @returns {string} City name or 'Bangalore' as default
 */
function extractCity(address) {
    if (!address) return 'Bangalore';

    const lowered = address.toLowerCase();

    // Check for Bangalore neighborhoods
    const neighborhoods = [
        'indiranagar', 'koramangala', 'jayanagar', 'whitefield',
        'malleshwaram', 'rajajinagar', 'hsr layout', 'btm layout',
        'jp nagar', 'basavanagudi', 'banashankari', 'hebbal',
        'yeshwanthpur', 'marathahalli', 'kr puram', 'vijayanagar',
        'electronic city', 'sarjapur', 'bellandur', 'yelahanka'
    ];

    for (const hood of neighborhoods) {
        if (lowered.includes(hood)) return hood;
    }

    // Default
    if (lowered.includes('bangalore') || lowered.includes('bengaluru')) {
        return 'Bangalore';
    }

    return 'Bangalore';
}
