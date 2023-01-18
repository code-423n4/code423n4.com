import React from "react";
import Helmet from "react-helmet";

import Footer from "../components/content/Footer";
import Header from "../components/content/Header";

const DefaultLayout = (props) => {
  const {
    pageDescription,
    pageTitle,
    bodyClass,
    children,
    url,
    preview,
  } = props;
  return (
    <>
      <Helmet
        htmlAttributes={{
          lang: "en",
        }}
      >
        <meta charset="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="chrome-1" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="" />
        <meta property="og:site_name" content="Code 423n4" />
        <meta property="og:title" content={pageTitle} />

        <meta
          property="og:description"
          content="Hack DeFi. Compete. Get paid."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://code423n4.com/${url}`} />
        {preview ? (
          <meta property="og:image" content={preview} />
        ) : (
          <meta
            property="og:image"
            content="https://code423n4/images/C4-banner.png"
          />
        )}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16.png"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono&display=swap"
          rel="stylesheet"
        />
        <title>
          {pageTitle ? `${pageTitle} — ` : ""}
          Code 423n4
        </title>
        <body className={bodyClass} />
      </Helmet>
      <main>
        <Header />
        {children}
        <Footer />
      </main>
    </>
  );
};

export default DefaultLayout;
