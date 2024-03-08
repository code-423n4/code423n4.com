import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Footer from "../components/content/Footer";
import Header from "../components/content/Header";
import LoginModal from "../components/Login/LoginModal";
import Modal from "../components/Modal";
import WrapperLayout from "./WrapperLayout";
import EyebrowBar from "../components/EyebrowBar";

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
        <ToastContainer />
        <Modal />
        <LoginModal />
        <main>{children}</main>
        <Footer />
      </WrapperLayout>
    </>
  );
};

export default DefaultLayout;
