import styled from 'styled-components';
import { Margins, Paddings } from '../types';
import { conditionalRenderProp, genSpaces, valToPx } from '../utils';

export const textSizes = {
  xs: 10,
  sm: 13,
  md: 14,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
};

type ColorKeys = 'primary' | 'secondary';

export type TextProps = {
  display?: 'inline-block' | 'block' | 'flex';
  size?: keyof typeof textSizes;
  color?: ColorKeys | string;
  weight?: string | number;
  opacity?: number;
  align?: 'left' | 'center' | 'right';
  fontFamily?: string;
  flexBasis?: number;
  lineHeight?: number;
} & Margins &
  Paddings;

const Text = styled.p<TextProps>`
  ${({
    theme,
    size,
    color,
    lineHeight,
    flexBasis,
    weight,
    opacity,
    align,
    fontFamily,
    display,
    ...rest
  }) => `
    ${conditionalRenderProp(
      'color',
      color ? theme.w.colors.text[color as ColorKeys] || color : theme.w.colors.text.primary
    )};
    ${conditionalRenderProp('font-size', valToPx(size ? textSizes[size] : textSizes.md))};
    ${conditionalRenderProp('font-weight', weight)};
    ${conditionalRenderProp('font-family', fontFamily || theme.w.fontFamily || 'inherit')};
    ${conditionalRenderProp('text-align', align)};
    ${conditionalRenderProp('opacity', opacity)};
    ${conditionalRenderProp('flex-basis', flexBasis)};
    ${conditionalRenderProp('display', display)};
    ${conditionalRenderProp('line-height', lineHeight)};
    ${genSpaces(theme, rest)}
  `};
`;

export default Text;
