import * as React from 'react';
import type ReactModal from 'react-modal';

import ModalDialog, { ModalDialogProps } from './ModalDialog';
import ModalConfirmBox, { ModalConfirmBoxProps } from './ModalConfirmBox';
import ModalMessageBox, { ModalMessageBoxProps } from './ModalMessageBox';
import ModalDrawer, { ModalDrawerProps } from './ModalDrawer';

interface BaseProps {
  readonly variant?: 'dialog' | 'message-box' | 'confirm-box' | 'drawer';
}

export type ModalProps =
  | (ModalDialogProps & BaseProps)
  | (ModalConfirmBoxProps & BaseProps)
  | (ModalMessageBoxProps & BaseProps)
  | (ModalDrawerProps & BaseProps);

const isDialog = (props: ModalProps): props is ModalDialogProps =>
  ('variant' in props && props.variant === 'dialog') || typeof props.variant === 'undefined';

const isConfirmBox = (props: ModalProps): props is ModalConfirmBoxProps =>
  'variant' in props && props.variant === 'confirm-box';

const isMessageBox = (props: ModalProps): props is ModalMessageBoxProps =>
  'variant' in props && props.variant === 'message-box';

const isDrawer = (props: ModalProps): props is ModalDrawerProps =>
  'variant' in props && props.variant === 'drawer';

const Modal: React.ForwardRefRenderFunction<ReactModal, ModalProps> = (props, ref) => {
  if (isDialog(props)) {
    return <ModalDialog {...props} ref={ref} />;
  }
  if (isConfirmBox(props)) {
    return <ModalConfirmBox {...props} ref={ref} />;
  }
  if (isMessageBox(props)) {
    return <ModalMessageBox {...props} ref={ref} />;
  }
  if (isDrawer(props)) {
    return <ModalDrawer {...(props as any)} ref={ref} />;
  }
  const { variant } = props;

  throw new Error(
    `Expected «variant» property is «dialog», «drawer», «message-box» or «confirm-box», but got «${variant}»`,
  );
};

export default React.forwardRef(Modal);
