import React from 'react';
import type ReactModal from 'react-modal';
import { Global, css, useTheme } from '@emotion/react';

import ModalStandard, { ModalStandardProps } from '../Modal/ModalStandard';
import ModalConfirmBox, { ModalConfirmBoxProps } from '../Modal/ModalConfirmBox';
import ModalMessageBox, { ModalMessageBoxProps } from '../Modal/ModalMessageBox';
import ModalCustom, { ModalCustomProps } from '../Modal/ModalCustom';

export interface BaseProps {
  readonly variant?: 'standard' | 'message-box' | 'confirm-box' | 'custom';
}

export type ReactModalProps = ReactModal.Props;

export type ModalProps =
  | (ModalStandardProps & BaseProps)
  | (ModalConfirmBoxProps & BaseProps)
  | (ModalMessageBoxProps & BaseProps)
  | (ModalCustomProps & BaseProps);

const isStandard = (props: ModalProps): props is ModalStandardProps =>
  ('variant' in props && props.variant === 'standard') || typeof props.variant === 'undefined';

const isConfirmBox = (props: ModalProps): props is ModalConfirmBoxProps =>
  'variant' in props && props.variant === 'confirm-box';

const isMessageBox = (props: ModalProps): props is ModalMessageBoxProps =>
  'variant' in props && props.variant === 'message-box';

const isCustom = (props: ModalProps): props is ModalCustomProps =>
  'variant' in props && props.variant === 'custom';

const Modal: React.ForwardRefRenderFunction<ReactModal, ModalProps> = (props, ref) => {
  const theme = useTheme();
  const renderModal = React.useCallback(() => {
    if (isStandard(props)) {
      return <ModalStandard {...props} ref={ref} />;
    }

    if (isConfirmBox(props)) {
      return <ModalConfirmBox {...props} ref={ref} />;
    }

    if (isMessageBox(props)) {
      return <ModalMessageBox {...props} ref={ref} />;
    }

    if (isCustom(props)) {
      return <ModalCustom {...props} ref={ref} />;
    }

    const { variant } = props;

    throw new Error(
      `Expected «variant» property is «standard», «custom», «message-box» or «confirm-box», but got «${variant}»`,
    );
  }, [props, ref]);

  return (
    <>
      <Global
        styles={css`
          .ReactModal__Overlay {
            opacity: 0;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: ${theme.zIndex.modal};
            transition: opacity 120ms ease-in-out;
            background-color: rgba(0, 0, 0, 0.6);
          }

          .ReactModal__Overlay--after-open {
            opacity: 1;
          }

          .ReactModal__Overlay--before-close {
            opacity: 0;
          }

          .ReactModal__Content {
            position: absolute;
            top: 50%;
            left: 50%;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            outline: none;
            transform: translate(-50%, -40%);
            transition: transform 100ms ease-in-out;
          }

          .ReactModal__Content--after-open {
            transform: translate(-50%, -50%);
            transition-duration: 160ms;
          }

          .ReactModal__Content--before-close {
            transform: translate(-50%, 300px);
          }
        `}
      />
      {renderModal()}
    </>
  );
};

export default React.forwardRef(Modal);
