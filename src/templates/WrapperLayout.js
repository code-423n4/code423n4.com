import React from "react";
import Helmet from "react-helmet";
import "../styles/_global.scss";

const WrapperLayout = (props) => {
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
          // TODO: Brand update
          <meta
            property="og:image"
            content="https://code4rena.com/images/C4-banner.png"
          />
        )}
        {/* TODO: Brand update */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        {/* TODO: Brand update */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32.png"
        />
        {/* TODO: Brand update */}
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16.png"
        />
        <title>
          {pageTitle ? `${pageTitle} — ` : ""}
          Code4rena
        </title>
        <body className={bodyClass} />
      </Helmet>
      {children}
    </>
  );
};

export default WrapperLayout;
