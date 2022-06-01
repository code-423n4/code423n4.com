import React from "react";

const Modal = ({
  handleClose,
  show,
  title,
  body,
  primaryButtonAction,
  primaryButtonText,
  secondaryButtonAction,
  secondaryButtonText,
}) => {
  return (
    <div className={show ? "modal display-block" : "modal display-none"}>
      <div className="modal-main">
        <button className="button-div modal-top" onClick={handleClose}>
          <img
            src="/images/x-icon.svg"
            alt="close modal icon"
            className="closeModal-icon"
          />
        </button>
        <div className="modal-main-title">
          <h1>{title}</h1>
        </div>
        <div className="modal-main-content">{body}</div>
        <div className="modal-main-buttons">
          <button
            className={`button ${
              !secondaryButtonAction && !secondaryButtonText
                ? "cta-button secondary"
                : "cta-button primary"
            }`}
            onClick={secondaryButtonAction || handleClose}
          >
            {secondaryButtonText || "Cancel"}
          </button>
          <button
            className="button cta-button primary"
            onClick={primaryButtonAction}
          >
            {primaryButtonText || "Ok"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
