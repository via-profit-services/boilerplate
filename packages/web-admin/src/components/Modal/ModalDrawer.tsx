import * as React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import ReactModal from 'react-modal';

import CloseOutlineIcon from '~/components/Icons/CloseOutline';
import Button from '~/components/Button';

export interface ModalDrawerProps extends ReactModal.Props {
  readonly children: React.ReactNode | React.ReactNode[];
  readonly title?: string;
  readonly toolbar?: React.ReactNode | React.ReactNode[] | null;
  readonly footer?: React.ReactNode | React.ReactNode[] | null;
  readonly closeButton?: boolean;
}

const Container = styled.div`
  min-height: 2rem;
  max-height: calc(100vh - 3rem);
  display: flex;
  flex-flow: column;
`;

const Header = styled.div`
  padding: 1em;
  border-bottom: ${({ theme }) => theme.borders.standard1};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Toolbar = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Title = styled.div`
  font-size: 1.3em;
  font-weight: 600;
  margin-right: 1em;
`;

const Footer = styled.div`
  padding: 1em;
  border-top: ${({ theme }) => theme.borders.standard1};
`;

const Inner = styled.div`
  padding: 1em;
  overflow-y: auto;
  flex: 1;
`;

const CloseButton = styled(Button)<{ $withToolbar: boolean }>`
  margin-left: ${props => (props.$withToolbar ? '1em' : 0)};
  color: ${props => props.theme.colors.text.default};
  background: none;
  width: auto;
  height: auto;
  padding: 0.6em;
  font-size: 1em;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ModalDrawer: React.ForwardRefRenderFunction<ReactModal, ModalDrawerProps> = (props, ref) => {
  const { children, onRequestClose, title, toolbar, footer, closeButton, ...otherProps } = props;
  const theme = useTheme();
  const hasFooter = typeof footer !== 'undefined' && footer !== null;
  const hasHeader = typeof title === 'string' || typeof toolbar !== 'undefined' || closeButton;

  return (
    <>
      <ReactModal
        ref={ref}
        closeTimeoutMS={300}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
        portalClassName="modal-drawer"
        onRequestClose={onRequestClose}
        {...otherProps}
      >
        <Container>
          {hasHeader && (
            <Header>
              {typeof title === 'string' && <Title>{title}</Title>}
              <Toolbar>{toolbar}</Toolbar>
              {closeButton && (
                <CloseButton type="button" $withToolbar={Boolean(toolbar)} onClick={onRequestClose}>
                  <CloseOutlineIcon />
                </CloseButton>
              )}
            </Header>
          )}

          <Inner>{children}</Inner>
          {hasFooter && <Footer>{footer}</Footer>}
        </Container>
      </ReactModal>

      <Global
        styles={css`
          .modal-drawer .ReactModal__Overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: ${theme.zIndex.modal};
            background-color: rgba(0, 0, 0, 0);
            transition: background-color 240ms ease-out;
          }

          .modal-drawer .ReactModal__Overlay--after-open {
            background-color: rgba(0, 0, 0, 0.4);
          }

          .modal-drawer .ReactModal__Overlay--before-close {
            background-color: rgba(0, 0, 0, 0);
          }

          .modal-drawer .ReactModal__Content {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            outline: none;
            background: ${theme.colors.background.area};
            box-shadow: ${theme.shadows.elevation0};
            border-radius: 1em 1em 0 0;
            transform: translate(0, 100%);
            transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
          }

          .modal-drawer .ReactModal__Content--after-open {
            transform: translate(0, 0);
          }

          .modal-drawer .ReactModal__Content--before-close {
            transform: translate(0, 100%);
            transition-duration: 160ms;
          }
        `}
      />
    </>
  );
};

export default React.forwardRef(ModalDrawer);
