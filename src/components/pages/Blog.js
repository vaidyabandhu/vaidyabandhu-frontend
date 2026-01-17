import React from 'react';
import { Helmet } from "react-helmet-async";
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/blog/Content';
import { useParams } from 'react-router-dom'; // To get the params from the URL
import Header from '../layouts/Header';

const pagelocation = "Blog Grid";

const Blog = () => {
  // Using useParams hook to get the dynamic parameters from the URL
  const { catId, tagId, authorId, query } = useParams();

  return (
    <>
      <Helmet>
        <title>VaidyaBandhu - Doctors Appointment Booking | {pagelocation}</title>
        <meta
          name="description"
          content="#"
        />
      </Helmet>
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
