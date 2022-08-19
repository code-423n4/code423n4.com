import React, { createContext, useContext, ReactNode, useState } from "react";

interface ModalProps {
  title: string | ReactNode;
  body: string | ReactNode;
  primaryButtonAction?: () => Promise<void>;
  primaryButtonText?: string | ReactNode;
  secondaryButtonAction?: () => Promise<void>;
  secondaryButtonText?: string | ReactNode;
}

type ModalContext = {
  showModal: (modalProps: ModalProps) => void;
  hideModal: () => void;
  modalProps: ModalProps | null;
};

const DEFAULT_STATE: ModalContext = {
  showModal: () => {},
  hideModal: () => {},
  modalProps: null,
};

const ModalContext = createContext(DEFAULT_STATE);

export const ModalProvider = ({ children }) => {
  const [modalProps, setModalProps] = useState<ModalProps | null>(
    DEFAULT_STATE.modalProps
  );

  const showModal = (modalProps: ModalProps) => {
    setModalProps(modalProps);
  };

  const hideModal = () => {
    setModalProps(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal, modalProps }}>
      {children}
    </ModalContext.Provider>
  );
};
export const useModalContext = () => useContext(ModalContext);
