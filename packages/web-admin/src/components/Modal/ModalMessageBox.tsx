import * as React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import ReactModal from 'react-modal';
import { FormattedMessage } from 'react-intl';

import Button from '~/components/Button';

export interface ModalMessageBoxProps extends ReactModal.Props {
  readonly title: string;
  readonly message: React.ReactNode;
}

const Container = styled.div`
  display: flex;
  flex-flow: column;
  min-width: 20em;
`;

const Header = styled.div`
  padding: 1em 1em 0 1em;
`;

const HeaderTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
`;

const Content = styled.div`
  flex: 1;
  padding: 1em 1em;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1em 1em 1em 1em;
  border-top: ${({ theme }) => theme.borders.standard1};

  & > button {
    border-radius: 0;
  }

  & > button:first-of-type {
    border-top-left-radius: 1em;
    border-bottom-left-radius: 1em;
  }

  & > button:last-child {
    border-top-right-radius: 1em;
    border-bottom-right-radius: 1em;
  }
`;

const ModalMessageBox: React.ForwardRefRenderFunction<ReactModal, ModalMessageBoxProps> = (
  props,
  ref,
) => {
  const { title, message, onRequestClose, isOpen, ...otherProps } = props;
  const dialogID = React.useMemo(() => `dialog-Message-${new Date().getTime()}`, []);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const theme = useTheme();

  React.useEffect(() => {
    setTimeout(() => {
      if (isOpen && buttonRef.current) {
        buttonRef.current.focus();
      }
    }, 15);
  }, [isOpen]);

  return (
    <>
      <ReactModal
        ref={ref}
        portalClassName="modal-messagebox"
        closeTimeoutMS={200}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick={false}
        onRequestClose={onRequestClose}
        isOpen={isOpen}
        {...otherProps}
      >
        <Container
          role="dialog"
          aria-labelledby={`${dialogID}-title`}
          aria-describedby={`${dialogID}-description`}
        >
          <Header>
            <HeaderTitle id={`${dialogID}-title`}>{title}</HeaderTitle>
          </Header>
          <Content id={`${dialogID}-description`}>{message}</Content>
          <Footer>
            <Button onClick={onRequestClose} ref={buttonRef}>
              <FormattedMessage defaultMessage="OK" description="Messagbox dialog. OK button" />
            </Button>
          </Footer>
        </Container>
      </ReactModal>
      <Global
        styles={css`
          .modal-messagebox .ReactModal__Overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: ${theme.zIndex.modal};
            transition: background-color 120ms ease-in-out;
            background-color: rgba(0, 0, 0, 0);
          }

          .modal-messagebox .ReactModal__Overlay--after-open {
            background-color: rgba(0, 0, 0, 0.6);
          }

          .modal-messagebox .ReactModal__Overlay--before-close {
            background-color: rgba(0, 0, 0, 0);
          }

          .modal-messagebox .ReactModal__Content {
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

          .modal-messagebox .ReactModal__Content--after-open {
            opacity: 1;
            transform: translate(-50%, -50%);
            transition-duration: 160ms;
          }

          .modal-messagebox .ReactModal__Content--before-close {
            opacity: 0;
            transform: translate(-50%, 300px);
          }
        `}
      />
    </>
  );
};

export default React.forwardRef(ModalMessageBox);
