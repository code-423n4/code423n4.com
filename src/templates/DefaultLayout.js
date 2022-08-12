import React from "react";
import Helmet from "react-helmet";
import { ToastContainer } from "react-toastify";

import Footer from "../components/content/Footer";
import Header from "../components/content/Header";
import Modal from "../components/Modal";

const DefaultLayout = (props) => {
  const {
    pageDescription,
    pageTitle,
    bodyClass,
    children,
    url,
    preview,
    hideConnectWalletDropdown = false,
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="" />
        <meta property="og:site_name" content="Code4rena" />
        <meta property="og:title" content={pageTitle} />
        {pageDescription ? (
          <meta property="og:description" content={pageDescription} />
        ) : (
          <meta
            property="og:description"
            content="The future of audits is decentralized."
          />
        )}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://code4rena.com/${url}`} />
        {preview ? (
          <meta property="og:image" content={preview} />
        ) : (
          <meta
            property="og:image"
            content="https://code4rena.com/images/C4-banner.png"
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono&family=Roboto:wght@400;700&family=Space+Mono&display=swap"
          rel="stylesheet"
        />
        <title>
          {pageTitle ? `${pageTitle} — ` : ""}
          Code4rena
        </title>
        <body className={bodyClass} />
      </Helmet>
      <Header hideConnectWalletDropdown={hideConnectWalletDropdown} />
      <ToastContainer />
      <Modal />
      <main>
        {children}
        <Footer />
      </main>
    </>
  );
};

export default DefaultLayout;
