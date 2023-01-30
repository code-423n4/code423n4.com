import React from "react";
import Helmet from "react-helmet";
import { ToastContainer } from "react-toastify";
import "../styles/_global.scss";

import Footer from "../components/content/Footer";
import Header from "../components/content/Header";
import LoginModal from "../components/Login/LoginModal";
import Modal from "../components/Modal";
import WrapperLayout from "./WrapperLayout";

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
      <WrapperLayout
        bodyClass={bodyClass}
        url={url}
        pageDescription={pageDescription}
        pageTitle={pageTitle}
      >
        <Header hideConnectWalletDropdown={hideConnectWalletDropdown} />
        {/* <ToastContainer /> */}
        {/* <Modal /> */}
        {/* <LoginModal /> */}
        <main>{children}</main>
        <Footer />
      </WrapperLayout>
    </>
  );
};

export default DefaultLayout;
