// import React from 'react';
// import styled from '@emotion/styled';
// import Color from 'color';

// import ErrorBoundary from '~/components/ErrorBoundary';
// import H3 from '~/components/Typography/H3';
// import Button from '~/components/Button';
// import Popper from '~/components/Popper';

// const Section = styled.section`
//   display: flex;
//   flex-direction: column;
// `;

// const PopperContent = styled.div`
//   display: flex;
//   flex-direction: column;
//   background-color: ${({ theme }) => theme.colors.backgroundPrimary};
//   box-shadow: 0 4px 12px
//     ${({ theme }) => Color(theme.colors.backgroundPrimary).darken(0.4).alpha(0.6).rgb().string()};
//   border-radius: 0.25em;
//   padding: 2em;
// `;

// const PopperElement: React.FC = () => {
//   const [anchorRef, setAnchorRef] = React.useState<HTMLButtonElement | null>(null);

//   return (
//     <>
//       <Button
//         variant="accent"
//         onClick={event => setAnchorRef(current => (current ? null : event.currentTarget))}
//       >
//         Toggle popper
//       </Button>
//       <Popper anchorRef={anchorRef} onRequestClose={() => setAnchorRef(null)}>
//         <PopperContent>Popper content</PopperContent>
//       </Popper>
//     </>
//   );
// };

// const Poppers: React.FC = () => (
//   <ErrorBoundary>
//     <Section>
//       <H3>Poppers</H3>
//       <div>
//         <PopperElement />
//       </div>
//     </Section>
//   </ErrorBoundary>
// );

// export default Poppers;
