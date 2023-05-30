import React from 'react';
import ReactModal from 'react-modal';

export type ModalCustomProps = ReactModal.Props;

const ModalMessageBox: React.ForwardRefRenderFunction<ReactModal, ModalCustomProps> = (
  props,
  ref,
) => {
  const { children, onRequestClose, isOpen, ...otherProps } = props;

  return (
    <ReactModal
      ref={ref}
      closeTimeoutMS={200}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick={false}
      onRequestClose={onRequestClose}
      isOpen={isOpen}
      {...otherProps}
    >
      {children}
    </ReactModal>
  );
};

export default React.forwardRef(ModalMessageBox);
