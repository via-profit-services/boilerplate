import React from 'react';
import styled from '@emotion/styled';
import ReactModal from 'react-modal';
import { FormattedMessage } from 'react-intl';

import Button from '../../Button';

export interface ModalMessageBoxProps extends ReactModal.Props {
  readonly title: string;
  readonly message: React.ReactNode;
}

const Container = styled.div`
  background-color: #fff;
  border-radius: ${({ theme }) => theme.shape.radiusFactor * 2}em;
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
  padding: 1em 1em 2em 1em;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1em 1em 1em 1em;
  border-top: 1px solid rgba(0, 0, 0, 0.4);

  & > button {
    border-radius: 0;
  }

  & > button:first-of-type {
    border-top-left-radius: 1em;
    border-bottom-left-radius: 1em;
  }

  & > button:last-of-type {
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
  const okButtonRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (isOpen && okButtonRef.current) {
          okButtonRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

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
          <Button onClick={onRequestClose} ref={okButtonRef}>
            <FormattedMessage defaultMessage="OK" description="Диалог. Кнопка OK" />
          </Button>
        </Footer>
      </Container>
    </ReactModal>
  );
};

export default React.forwardRef(ModalMessageBox);
