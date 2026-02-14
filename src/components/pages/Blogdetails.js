import React from 'react';
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/blog-details/Content';
import { useParams } from 'react-router-dom';
import DynamicSEOHead from '../common/DynamicSEOHead';

const pagelocation = "Blog Details";

const Blogdetails = () => {
  const { id } = useParams();

  return (
    <>
      <DynamicSEOHead
        title="Health Article - Vaidyabandhu Blog"
        description="Read this expert health article by verified medical professionals. Get evidence-based medical insights, Ayurvedic wellness tips, and healthcare guidance from Bangalore's trusted doctors."
        canonicalPath={`/blog-details/${id}`}
        keywords="health article, medical blog, doctor advice, Ayurveda, wellness tips Bangalore"
        ogType="article"
      />
      <Header />
      <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
      <Content detailId={id} />
      <Footer />
    </>
  );
};

export default Blogdetails;
