import * as React from 'react';
import { useDispatch } from 'react-redux';
import Button, { ButtonProps } from '@via-profit/ui-kit/Button';
import Modal from '@via-profit/ui-kit/Modal';
import { useIntl } from 'react-intl';

import { authActions } from '~/redux/slicers/auth';
import ExitIcon from '~/components/Icons/ExitOutline';

const LogoutButtonWithRef: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  props,
  ref,
) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const [isOpen, setOpen] = React.useState(false);

  return (
    <>
      <Button
        endIcon={<ExitIcon />}
        variant="plain"
        onClick={() => setOpen(true)}
        {...props}
        ref={ref}
      >
        Go away
      </Button>

      <Modal
        isOpen={isOpen}
        variant="confirm-box"
        title={intl.formatMessage({ defaultMessage: 'Выход из системы' })}
        message={intl.formatMessage(
          {
            defaultMessage:
              'Вы действительно хотите выйти из системы?{br}Для возобновления работы вам потребуется ввести{br}логин и пароль от учётной записи',
          },
          {
            br: <br />,
          },
        )}
        onRequestYes={() => dispatch(authActions.reset())}
        onRequestClose={() => setOpen(false)}
      />
    </>
  );
};

const LogoutButton = React.forwardRef(LogoutButtonWithRef);

export default LogoutButton;
