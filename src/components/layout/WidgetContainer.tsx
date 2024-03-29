import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Text from '../Text';
import Link from '../Link';
import { changeColorShade } from '../utils';
import Flex from './Flex';
import { WHEREVER_HOMEPAGE } from 'global/const';
import { useEnvironment } from 'context/EnvironmentContext';

const POWERED_BY_HEIGHT = '42px';

const LayoutContainer = styled.div<LayoutProps>(({ theme, width }) => ({
  [`@media (max-width: ${theme.w.breakpoints.mobile}px)`]: {
    position: 'fixed',
    overflowY: 'hidden',
    top: 'env(safe-area-inset-top)',
    left: 0,
    width: '100vw',
    height: 'calc(100% - env(safe-area-inset-top))',
    borderRadius: 0,
    zIndex: 999,
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: width?.desktop || '400px',
  minHeight: 280,
  boxSizing: 'content-box',
  overflowY: 'auto',
  borderRadius: theme.w.borderRadius.md,
  boxShadow: '0 20px 36px rgba(0, 0, 0, 0.25)',
  backgroundColor: theme.w.colors.bg.main,
  color: theme.w.colors.text.primary,
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  // ⬇ solves chakra related css issues
  '& img': { maxWidth: 'unset' },
  '& *': { boxSizing: 'content-box' },
  '& button': { boxSizing: 'border-box' },
}));

const PoweredBy = styled(Flex)<{ hidden: boolean }>`
  height: ${POWERED_BY_HEIGHT};
  display: ${({ hidden }) => (hidden ? 'none' : undefined)};
  font-family: 'Inter var', sans-serif;
  box-sizing: border-box;
  border-top: 1px solid ${({ theme }) => changeColorShade(theme.w.colors.bg.main, 20)};
  backdrop-filter: brightness(0.85);
`;

const ChildrenContainer = styled.div<LayoutProps>(({ theme, maxHeight }) => ({
  height: `calc(100% - ${POWERED_BY_HEIGHT} - 8px)`,
  maxHeight: maxHeight?.desktop || 500,
  overflowY: 'auto',
  '-ms-overflow-style': 'none',
  'scrollbar-width': 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  padding: `24px 12px 0 12px`,
  [`@media (max-width: ${theme.w.breakpoints.mobile}px)`]: {
    paddingTop: 16,
    maxHeight: 'unset',
    paddingBottom: 0,
  },
}));

interface LayoutProps {
  children: ReactNode;
  width?: { desktop: number | string };
  maxHeight?: { desktop: number | string };
}

export const WidgetContainer = (props: LayoutProps) => {
  const { isSubscribeOnlyMode } = useEnvironment();

  return (
    <LayoutContainer {...props}>
      <ChildrenContainer {...props}>{props.children}</ChildrenContainer>

      <PoweredBy hidden={isSubscribeOnlyMode} alignItems={'center'} justifyContent={'center'}>
        <Text size={'sm'} color={'secondary'} opacity={0.8} weight={500}>
          Powered by&nbsp;
        </Text>
        <Link src={WHEREVER_HOMEPAGE}>
          <Text size={'sm'} opacity={0.8} weight={600} color={'secondary'}>
            Wherever
          </Text>
        </Link>
      </PoweredBy>
    </LayoutContainer>
  );
};
