import React from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';

const Example = () => {
  const [referenceElement, setReferenceElement] = React.useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = React.useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  return (
    <>
      {/* <button type="button" ref={setReferenceElement}>
        Reference
      </button> */}
      <button type="button" onClick={event => setReferenceElement(event.currentTarget)}>
        Reference
      </button>
      {ReactDOM.createPortal(
        <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
          <div style={{ backgroundColor: 'blue' }}>
            <p>start Popper</p>
            <p>Popper</p>
            <p>Popper</p>
            <p>Popper</p>
            <p>Popper</p>
            <p>Popper</p>
            <p>end Popper</p>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default Example;
