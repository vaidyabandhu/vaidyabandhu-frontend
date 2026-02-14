/**
 * Dynamic Sitemap Generator — Vercel Serverless Function
 * 
 * Fetches all doctors and clinics from the API and generates
 * a complete XML sitemap including individual profile URLs.
 * 
 * Endpoint: /api/sitemap → serves as /sitemap.xml via vercel.json rewrite
 */

const BASE_URL = 'https://www.vaidyabandhu.com';
const API_BASE = 'https://admin.vaidyabandhu.com/api';

function slugify(str) {
    if (!str) return '';
    return str
        .toString()
        .toLowerCase()
        .trim()
        .replace(/['']/g, '')
        .replace(/&/g, 'and')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function generateDoctorSlug(doctor) {
    const parts = [doctor.id];
    if (doctor.full_name) parts.push(slugify(doctor.full_name));
    if (doctor.speciality?.[0]?.title) parts.push(slugify(doctor.speciality[0].title));
    parts.push('bangalore');
    return parts.filter(Boolean).join('-');
}

function generateClinicSlug(clinic) {
    const parts = [clinic.id];
    if (clinic.name) parts.push(slugify(clinic.name));
    if (clinic.specialist) parts.push(slugify(clinic.specialist));
    parts.push('bangalore');
    return parts.filter(Boolean).join('-');
}

// Static pages with priorities
const STATIC_PAGES = [
    { path: '/', changefreq: 'daily', priority: '1.0' },
    { path: '/doctor-list', changefreq: 'daily', priority: '0.9' },
    { path: '/doctor-grid', changefreq: 'daily', priority: '0.8' },
    { path: '/clinic-list', changefreq: 'daily', priority: '0.9' },
    { path: '/hospital-list', changefreq: 'weekly', priority: '0.8' },
    { path: '/about', changefreq: 'monthly', priority: '0.7' },
    { path: '/contact', changefreq: 'monthly', priority: '0.6' },
    { path: '/services', changefreq: 'monthly', priority: '0.7' },
    { path: '/blogs', changefreq: 'weekly', priority: '0.7' },
    { path: '/llms.txt', changefreq: 'monthly', priority: '0.5' },
    { path: '/llms-full.txt', changefreq: 'monthly', priority: '0.5' },
];

function buildUrlEntry(path, changefreq, priority, lastmod) {
    return `  <url>
    <loc>${BASE_URL}${path}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

module.exports = async function handler(req, res) {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Fetch doctors and clinics in parallel
        const [doctorsRes, clinicsRes] = await Promise.allSettled([
            fetch(`${API_BASE}/doctors`).then(r => r.json()),
            fetch(`${API_BASE}/clinics`).then(r => r.json()),
        ]);

        const doctors = doctorsRes.status === 'fulfilled'
            ? (doctorsRes.value?.data || doctorsRes.value || [])
            : [];

        const clinics = clinicsRes.status === 'fulfilled'
            ? (clinicsRes.value?.data || clinicsRes.value || [])
            : [];

        // Build URL entries
        const urls = [];

        // Static pages
        for (const page of STATIC_PAGES) {
            urls.push(buildUrlEntry(page.path, page.changefreq, page.priority, today));
        }

        // Dynamic doctor pages
        if (Array.isArray(doctors)) {
            for (const doctor of doctors) {
                if (!doctor.id) continue;
                const slug = generateDoctorSlug(doctor);
                const lastmod = doctor.updated_at
                    ? new Date(doctor.updated_at).toISOString().split('T')[0]
                    : today;
                urls.push(buildUrlEntry(`/doctor/${slug}`, 'weekly', '0.8', lastmod));
            }
        }

        // Dynamic clinic pages
        if (Array.isArray(clinics)) {
            for (const clinic of clinics) {
                if (!clinic.id) continue;
                const slug = generateClinicSlug(clinic);
                const lastmod = clinic.updated_at
                    ? new Date(clinic.updated_at).toISOString().split('T')[0]
                    : today;
                urls.push(buildUrlEntry(`/clinic/${slug}`, 'weekly', '0.7', lastmod));
            }
        }

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

        // Cache for 1 hour
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
        res.status(200).send(sitemap);

    } catch (error) {
        console.error('Sitemap generation error:', error);

        // Fallback to static-only sitemap
        const fallbackUrls = STATIC_PAGES.map(p =>
            buildUrlEntry(p.path, p.changefreq, p.priority)
        );
        const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${fallbackUrls.join('\n')}
</urlset>`;

        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(fallback);
    }
};
