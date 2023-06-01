import * as React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import ReactModal from 'react-modal';

export interface ModalDialogProps extends ReactModal.Props {
  readonly children: React.ReactNode | React.ReactNode[];
}

const Container = styled.div`
  padding: 1em;
`;

const ModalDialog: React.ForwardRefRenderFunction<ReactModal, ModalDialogProps> = (props, ref) => {
  const { children, ...otherProps } = props;
  const theme = useTheme();

  return (
    <>
      <ReactModal ref={ref} closeTimeoutMS={200} portalClassName="modal-dialog" {...otherProps}>
        <Container>{children}</Container>
      </ReactModal>
      <Global
        styles={css`
          .modal-dialog .ReactModal__Overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: ${theme.zIndex.modal};
            transition: background-color 120ms ease-in-out;
            background-color: rgba(0, 0, 0, 0);
          }

          .modal-dialog .ReactModal__Overlay--after-open {
            background-color: rgba(0, 0, 0, 0.6);
          }

          .modal-dialog .ReactModal__Overlay--before-close {
            background-color: rgba(0, 0, 0, 0);
          }

          .modal-dialog .ReactModal__Content {
            position: absolute;
            top: 50%;
            left: 50%;
            opacity: 0;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            outline: none;
            background: ${theme.colors.background.area};
            box-shadow: ${theme.shadows.elevation1};
            border-radius: 1em;
            transform: translate(-50%, -40%);
            transition: transform 100ms ease-in-out, opacity 100ms ease-in-out;
          }

          .modal-dialog .ReactModal__Content--after-open {
            opacity: 1;
            transform: translate(-50%, -50%);
            transition-duration: 160ms;
          }

          .modal-dialog .ReactModal__Content--before-close {
            opacity: 0;
            transform: translate(-50%, 300px);
          }
        `}
      />
    </>
  );
};

export default React.forwardRef(ModalDialog);
