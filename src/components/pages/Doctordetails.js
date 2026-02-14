import React, { Fragment } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/doctor-details/Content';
import Header from '../layouts/Header';
import { extractIdFromSlug } from '../../helper/slugHelper';

const pagelocation = "Doctor Details";

function Doctordetails() {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();

    // Support both slug-based (/doctor/:slug) and legacy query param (?id=) routing
    let id;
    if (slug) {
        id = extractIdFromSlug(slug);
    } else {
        id = searchParams.get("id");
    }

    return (
        <Fragment>
            <Header />
            <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
            <Content detailId={id} />
            <Footer />
        </Fragment>
    );
}

export default Doctordetails;
