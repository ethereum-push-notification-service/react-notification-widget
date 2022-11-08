import styled, { css, DefaultTheme } from 'styled-components';
import { Margins, Paddings } from '../types';
import { genSpaces, renderStringNumValue, adjustColor } from '../utils';

const fontSizes = {
  sm: '12px',
  md: '16px',
};

type ButtonVariant = 'gray' | 'primary' | 'outlined' | 'danger';

type ButtonProps = {
  variant?: ButtonVariant;
  fontSize?: keyof typeof fontSizes;
  textColor?: string;
  height?: string | number;
  width?: string | number;
  borderRadius?: keyof DefaultTheme['borderRadius'];
} & Margins &
  Paddings;

const variantStyles = (variant = 'primary', theme: DefaultTheme): any =>
  ({
    primary: css`
      background: ${theme.colors.primary.main};
      &:hover {
        background: ${adjustColor(theme.colors.primary.main, 0.8)};
        border-color: ${adjustColor(theme.colors.primary.main, 0.8)};
      }
    `,
    gray: css`
      background: ${theme.colors.gray[500]};
      color: rgba(255, 255, 255, 0.9);

      &:hover {
        background: ${theme.colors.gray[300]};
        border-color: ${theme.colors.gray[300]};
      }
    `,
    outlined: css`
      background-color: transparent;
    `,
    danger: css`
      background: ${theme.colors.error.main};
      &:hover {
        background: ${adjustColor(theme.colors.error.main, 0.8)};
        border-color: ${adjustColor(theme.colors.error.main, 0.8)};
      }
    `,
  }[variant]);

const Button = styled.button<ButtonProps>`
  ${({
    theme,
    variant = 'primary',
    width = 'unset',
    height = 'unset',
    fontSize = 'md',
    textColor,
    borderRadius = 'md',
    ...rest
  }) => `
    &:active {
      transform: translateY(1px);
    };
    transition: .1s background ease, .1s transform ease;
    border-radius: ${theme.borderRadius[borderRadius]};
    cursor: pointer;
    border: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    font-size: ${fontSizes[fontSize]};
    padding: ${theme.spacing(1)}px ${theme.spacing(3)}px;
    color: ${textColor || theme.colors.button.text};
    width: ${renderStringNumValue(width)};
    height: ${renderStringNumValue(height)};
    ${variantStyles(variant, theme).join('')}
    ${genSpaces(theme, rest)}
    &:disabled {
      transform: unset;
      background: ${theme.colors.gray['300']};
      color: ${theme.colors.gray['50']};
      cursor: default;
    };
  `};
`;

export default Button;
