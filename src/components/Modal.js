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
      <div className="modal-main" onClick={handleClose}>
        <button className="button-div modal-top">
          <img
            src="/images/x-icon.svg"
            alt="close modal icon"
            className="closeModal-icon"
          />
        </button>
        <div className="modal-main-title">
          <h1>{title}</h1>
        </div>
        <div className="modal-main-content">
          <p>{body}</p>
        </div>
        <div className="modal-main-buttons">
          <button
            className={`button button-modal ${
              !secondaryButtonAction && !secondaryButtonText
                ? "button-close"
                : "button-action"
            }`}
            onClick={secondaryButtonAction || handleClose}
          >
            {secondaryButtonText || "Cancel"}
          </button>
          <button
            className="button button-modal button-action "
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
