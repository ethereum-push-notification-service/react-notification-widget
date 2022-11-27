import React, { ReactNode } from 'react';
import styled, { useTheme, keyframes } from 'styled-components';
import Flex from 'components/layout/Flex';
import Text from 'components/Text';
import { ArrowRight } from 'components/icons';

const Container = styled(Flex)<{ open?: boolean }>`
  border-radius: ${({ theme }) => theme.borderRadius.md};
  backdrop-filter: ${({ open }) => (open ? 'contrast(0.8)' : 'unset')};
  :hover {
    backdrop-filter: contrast(0.8);
  }
`;

const Header = styled(Flex)`
  padding: 8px;
  cursor: pointer;
  background: transparent;
  display: flex;
  justify-content: space-between;
`;

const HeaderInfo = styled(Flex)`
  height: 32px;
  display: flex;
  align-items: center;
`;

const DropdownIcon = styled(Flex)<{ open?: boolean }>`
  height: 18px;
  width: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.primary};
  transform: ${({ open }) => (open ? `rotate(90deg)` : `rotate(0deg)`)};
  transition: all 0.2s ease-in-out;
`;

const IconContainer = styled(Flex)`
  height: 16px;
  width: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const openDropdown = keyframes`
  0%   { max-height: 0; }
  100% { max-height: 500px; }
`;

const Content = styled(Flex)<{ open?: boolean }>`
  padding: 8px;
  background: transparent;
  max-height: 500px;
  overflow: hidden;
  animation: ${openDropdown} 1s linear;
`;

type SettingsItemProps = {
  icon?: ReactNode;
  title?: string;
  children?: ReactNode;
  open?: boolean;
  setOpen?: () => void;
  isConnected?: boolean;
};

const ChannelDropdown = ({
  children,
  icon,
  title,
  open,
  setOpen,
  isConnected,
}: SettingsItemProps) => {
  const theme = useTheme();
  return (
    <Container gap={1} direction={'column'} open={open}>
      <Header alignItems={'center'} onClick={setOpen}>
        <HeaderInfo gap={1}>
          <DropdownIcon open={open}>
            <ArrowRight />
          </DropdownIcon>
          <IconContainer>{icon}</IconContainer>
          <Text size={'md'} weight={600}>
            {title}
          </Text>
        </HeaderInfo>
        {isConnected && (
          <Text size={'sm'} color={theme.colors.success.main} weight={600}>
            • CONNECTED
          </Text>
        )}
      </Header>
      {open && <Content>{children}</Content>}
    </Container>
  );
};

export default ChannelDropdown;