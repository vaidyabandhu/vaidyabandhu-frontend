import React from 'react';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/blog/Content';
import { useParams } from 'react-router-dom';
import Header from '../layouts/Header';
import DynamicSEOHead from '../common/DynamicSEOHead';

const pagelocation = "Blog Grid";

const Blog = () => {
  const { catId, tagId, authorId, query } = useParams();

  return (
    <>
      <DynamicSEOHead
        title="Health Blog - Medical Tips & Wellness Articles"
        description="Read expert health articles, Ayurvedic wellness tips, and medical advice from verified doctors in Bangalore. Stay informed about health, nutrition, and preventive care."
        canonicalPath="/blogs"
        keywords="health blog, medical articles, Ayurvedic tips, wellness advice, doctor articles Bangalore"
      />
      <Header />
      <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
      <Content
        catId={catId}
        tagId={tagId}
        authorId={authorId}
        query={query}
      />
      <Footer />
    </>
  );
};

export default Blog;
