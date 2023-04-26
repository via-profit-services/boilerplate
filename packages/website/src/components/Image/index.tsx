import React from 'react';
import styled from '@emotion/styled';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  readonly src: string;
  readonly thumb?: string | null;
}

const Img = styled.img`
  object-fit: cover;
  object-position: center center;
  filter: ${({ theme }) => (theme.isDark ? 'brightness(0.86)' : 'none')};
`;

const Image: React.ForwardRefRenderFunction<HTMLImageElement, ImageProps> = (props, ref) => {
  const { src, thumb, ...otherProps } = props;
  const srcRef = React.useRef<string | null>(null);
  const [currentSrc, setSrc] = React.useState(typeof thumb === 'string' ? thumb : src);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    isMountedRef.current = true;
    if (typeof thumb === 'string' && srcRef.current !== thumb) {
      srcRef.current = thumb;

      const imageElement = new window.Image();
      imageElement.onload = () => {
        if (isMountedRef.current) {
          setSrc(src);
        }
      };

      imageElement.src = src;
    }
  }, [src, thumb]);

  React.useEffect(() => () => void (isMountedRef.current = false), []);

  return <Img src={currentSrc} {...otherProps} ref={ref} />;
};

export default React.forwardRef(Image);
