import React from 'react';
import styled from '@emotion/styled';
import ReactModal from 'react-modal';

export interface ModalStandardProps extends ReactModal.Props {
  readonly children: React.ReactNode | React.ReactNode[];
}

const Container = styled.div`
  background-color: #fff;
  border-radius: ${({ theme }) => theme.shape.radiusFactor * 2}em;
  padding: 1em;
`;

const ModalStandard: React.ForwardRefRenderFunction<ReactModal, ModalStandardProps> = (
  props,
  ref,
) => {
  const { children, ...otherProps } = props;

  return (
    <ReactModal ref={ref} closeTimeoutMS={200} {...otherProps}>
      <Container>{children}</Container>
    </ReactModal>
  );
};

export default React.forwardRef(ModalStandard);
