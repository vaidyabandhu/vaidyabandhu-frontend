import React, { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { SuspenseFallback } from '../SuspenseFallback';

/**
 * RedirectLegacyDoctor
 * Catches old /doctor-details?id=63 URLs and redirects to /doctor/63-slug format.
 * Fetches doctor data to generate a proper slug, with fallback to ID-only redirect.
 */
function RedirectLegacyDoctor() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [slug, setSlug] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        // Try to fetch doctor data for a proper slug, but fall back to ID-only
        const fetchDoctor = async () => {
            try {
                const response = await fetch(`https://admin.vaidyabandhu.com/api/doctors/${id}`);
                if (response.ok) {
                    const result = await response.json();
                    const doctor = result.data || result;

                    // Build slug parts
                    const parts = [id];
                    if (doctor.full_name) {
                        parts.push(
                            doctor.full_name
                                .toLowerCase()
                                .trim()
                                .replace(/[^\w\s-]/g, '')
                                .replace(/[\s_]+/g, '-')
                                .replace(/-+/g, '-')
                        );
                    }
                    if (doctor.speciality?.[0]?.title) {
                        parts.push(
                            doctor.speciality[0].title
                                .toLowerCase()
                                .trim()
                                .replace(/[^\w\s-]/g, '')
                                .replace(/[\s_]+/g, '-')
                        );
                    }
                    parts.push('bangalore');
                    setSlug(parts.filter(Boolean).join('-'));
                } else {
                    // Fallback: redirect with just the ID
                    setSlug(id);
                }
            } catch {
                // Fallback: redirect with just the ID
                setSlug(id);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [id]);

    // No ID provided — redirect to doctor list
    if (!id && !loading) {
        return <Navigate to="/doctor-list" replace />;
    }

    // Still loading
    if (loading) {
        return <SuspenseFallback text="Redirecting..." variant="success" centered={true} />;
    }

    // Redirect to new slug URL
    return <Navigate to={`/doctor/${slug}`} replace />;
}

export default RedirectLegacyDoctor;
