const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const BASE_URL = process.env.SITEMAP_BASE_URL || "https://www.vaidyabandhu.com";

const blogDataPath = path.join(ROOT, "src", "data", "blog", "blog.json");
const serviceDataPath = path.join(ROOT, "src", "data", "service", "service.json");
const clinicDataPath = path.join(ROOT, "src", "data", "clinic", "clinic.json");
const doctorDataPath = path.join(ROOT, "src", "data", "doctor", "doctor.json");
const sitemapPath = path.join(ROOT, "public", "sitemap.xml");

const readJson = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return [];
  }
};

const blogItems = readJson(blogDataPath);
const serviceItems = readJson(serviceDataPath);
const clinicItems = readJson(clinicDataPath);
const doctorItems = readJson(doctorDataPath);

const staticRoutes = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/about", changefreq: "weekly", priority: "0.8" },
  { path: "/services", changefreq: "weekly", priority: "0.8" },
  { path: "/appointment", changefreq: "weekly", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/faqs", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
  { path: "/clinic-grid", changefreq: "weekly", priority: "0.7" },
  { path: "/doctor-grid", changefreq: "weekly", priority: "0.7" },
  { path: "/hospital-list", changefreq: "weekly", priority: "0.7" },
];

const dynamicRoutes = [
  ...blogItems
    .filter((item) => item?.id !== undefined && item?.id !== null)
    .map((item) => ({
      path: `/blog-details/${item.id}`,
      changefreq: "weekly",
      priority: "0.6",
    })),
  ...serviceItems
    .filter((item) => item?.id !== undefined && item?.id !== null)
    .map((item) => ({
      path: `/service-details/${item.id}`,
      changefreq: "weekly",
      priority: "0.6",
    })),
  ...clinicItems
    .filter((item) => item?.id !== undefined && item?.id !== null)
    .map((item) => ({
      path: `/clinic-details/${item.id}`,
      changefreq: "weekly",
      priority: "0.6",
    })),
  ...doctorItems
    .filter((item) => item?.id !== undefined && item?.id !== null)
    .map((item) => ({
      path: `/doctor-details?id=${item.id}`,
      changefreq: "weekly",
      priority: "0.6",
    })),
];

const routeMap = new Map();
[...staticRoutes, ...dynamicRoutes].forEach((route) => {
  if (!routeMap.has(route.path)) {
    routeMap.set(route.path, route);
  }
});

const routes = Array.from(routeMap.values());
const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(sitemapPath, xml, "utf8");
console.log(`Generated sitemap with ${routes.length} URLs at ${sitemapPath}`);
