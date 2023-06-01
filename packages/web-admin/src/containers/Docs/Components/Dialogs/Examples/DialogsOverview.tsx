import * as React from 'react';
import Modal from '@boilerplate/ui-kit/src/Modal';
import Button from '@boilerplate/ui-kit/src/Button';

import Card from '~/components/Card';

const DialogsOverview: React.FC = () => {
  const [messageboxOpen, setMessageboxOpen] = React.useState(false);
  const [longDrawerOpen, setLongDrawerOpen] = React.useState(false);
  const [basicDrawerOpen, setBasicDrawerOpen] = React.useState(false);
  const [confirmboxOpen, setConfirmboxOpen] = React.useState(false);

  return (
    <>
      <Card color="background">
        <Button type="button" onClick={() => setMessageboxOpen(true)}>
          Open message box
        </Button>

        <Button type="button" onClick={() => setConfirmboxOpen(true)}>
          Open confirmation dialog
        </Button>

        <Button type="button" onClick={() => setBasicDrawerOpen(true)}>
          Open basic Drawer
        </Button>

        <Button type="button" onClick={() => setLongDrawerOpen(true)}>
          Open long Drawer
        </Button>
      </Card>

      <Modal
        message="Sime message"
        title="some title"
        variant="message-box"
        onRequestClose={() => setMessageboxOpen(false)}
        isOpen={messageboxOpen}
      />
      <Modal
        message="Sime message"
        title="some title"
        variant="confirm-box"
        onRequestClose={() => setConfirmboxOpen(false)}
        onRequestYes={() => setConfirmboxOpen(false)}
        isOpen={confirmboxOpen}
      />
      <Modal
        variant="drawer"
        isOpen={longDrawerOpen}
        onRequestClose={() => setLongDrawerOpen(false)}
        closeButton
        title="Long drawer"
        toolbar={
          <>
            <Button type="button" onClick={() => setLongDrawerOpen(false)}>
              Close
            </Button>
            <div style={{ width: '10px' }} />
            <Button type="button" onClick={() => console.debug('click')}>
              Just click
            </Button>
          </>
        }
        footer={
          <Button type="button" onClick={() => setLongDrawerOpen(false)}>
            Close
          </Button>
        }
      >
        {[...new Array(15).keys()].map(key => (
          <div
            key={key.toString()}
            style={{ border: '1px solid grey', height: '120px', margin: '0 0 10px 0' }}
          ></div>
        ))}
      </Modal>
      <Modal
        variant="drawer"
        closeButton
        shouldCloseOnOverlayClick
        onRequestClose={() => setBasicDrawerOpen(false)}
        isOpen={basicDrawerOpen}
      >
        Lorem ipsum
      </Modal>
    </>
  );
};

export default DialogsOverview;
