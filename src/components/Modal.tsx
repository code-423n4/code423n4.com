import React, { useState } from "react";
import { toast } from "react-toastify";

import { useModalContext } from "../hooks/ModalContext";

const Modal = () => {
  const { hideModal, modalProps } = useModalContext();
  const [isLoading, setIsLoading] = useState(false);

  const handlePrimaryButtonClick = async () => {
    setIsLoading(true);
    try {
      if (modalProps && modalProps.primaryButtonAction) {
        await modalProps.primaryButtonAction();
      }
    } catch (error) {
      toast.error("Oops...something went wrong: " + error);
    } finally {
      setIsLoading(false);
      hideModal();
    }
  };

  const handleClose = async () => {
    if (modalProps && modalProps.secondaryButtonAction) {
      await modalProps.secondaryButtonAction();
    }
    setIsLoading(false);
    hideModal();
  };

  return modalProps ? (
    <div className="modal">
      <div className="modal-main">
        <button className="button-div modal-top" onClick={handleClose}>
          <img
            src="/images/x-icon.svg"
            alt="close modal icon"
            className="closeModal-icon"
          />
        </button>
        <div className="modal-main-title">
          <h1>{modalProps.title}</h1>
        </div>
        <div className="modal-main-content">{modalProps.body}</div>
        <div className="modal-main-buttons">
          <button className="button cta-button secondary" onClick={handleClose}>
            {modalProps.secondaryButtonText || "Cancel"}
          </button>
          {modalProps.primaryButtonText && (
            <button
              className="button cta-button primary"
              onClick={handlePrimaryButtonClick}
            >
              {isLoading
                ? "Submitting..."
                : modalProps.primaryButtonText || "Ok"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
