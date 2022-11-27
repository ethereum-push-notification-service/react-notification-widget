import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import PageTitle from '../../components/PageTitle';
import { Screen } from 'components/layout/Screen';
import Button from 'components/Button';
import Text from 'components/Text';
import { Bell } from 'components/icons';
import Flex from 'components/layout/Flex';
import { Routes, useRouterContext } from 'context/RouterContext';
import { useAuthContext } from 'context/AuthContext';
import { EmailChannel, TelegramChannel } from 'screens/settings/channels';
import HiddenNotice from 'screens/settings/components/HiddenNotice';
import { useChannelContext } from 'context/ChannelContext';
import WrongNetworkError from 'components/Errors/WrongNetworkError';

const Header = styled(Flex)`
  pointer-events: none;
`;

const HeaderIconContainer = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: ${({ theme }) => theme.spacing(1.5)}px;
`;

const HeaderIcon = styled.div`
  height: 24px;
  width: 24px;
  border-radius: 100px;
  background: ${({ theme }) => theme.colors.primary.main};
`;

const ChannelsContainer = styled(Flex)<{ wrongNetwork?: boolean }>`
  ${({ wrongNetwork }) =>
    wrongNetwork &&
    `
    pointer-events: none;
  `}
`;

enum Channels {
  EMAIL,
  TELEGRAM,
}

export const Settings = () => {
  const { isOnboarding, unsubscribe } = useAuthContext();
  const { setRoute } = useRouterContext();
  const { isWrongNetwork } = useChannelContext();

  const theme = useTheme();

  const [channelOpen, setChannelOpen] = useState<Channels | undefined>(
    isOnboarding ? Channels.EMAIL : undefined
  );

  const toggleChannelOpen = (channel: Channels) => {
    if (isWrongNetwork) return;
    channelOpen === channel ? setChannelOpen(undefined) : setChannelOpen(channel);
  };

  const handleSkip = () => {
    setRoute(Routes.NotificationsFeed);
  };

  const handleUnsubscribe = () => {
    unsubscribe();
  };

  return (
    <Screen
      navbarActionComponent={
        <Button variant={'gray'} fontSize={'sm'} p={1} borderRadius={'sm'} onClick={handleSkip}>
          {isOnboarding ? 'Skip' : 'Back'}
        </Button>
      }
      mb={1}
    >
      <Header justifyContent={'center'} alignItems={'center'} direction={'column'} mb={2} mt={-4}>
        <HeaderIconContainer>
          <HeaderIcon>
            <Bell color={theme.colors.button.text} />
          </HeaderIcon>
        </HeaderIconContainer>
        <PageTitle mb={1}>Set Up Notifications</PageTitle>
        <Text size={'md'} weight={500} mb={0.5} align={'center'}>
          Choose one or more channels to receive alerts when new messages hit your wallet.
        </Text>
      </Header>
      <WrongNetworkError mb={2} />
      <ChannelsContainer
        wrongNetwork={isWrongNetwork}
        gap={1}
        width={'100%'}
        direction={'column'}
        mb={2}
      >
        <EmailChannel
          open={channelOpen === Channels.EMAIL}
          setOpen={() => toggleChannelOpen(Channels.EMAIL)}
        />
        <TelegramChannel
          open={channelOpen === Channels.TELEGRAM}
          setOpen={() => toggleChannelOpen(Channels.TELEGRAM)}
        />
      </ChannelsContainer>
      {process.env.WHEREVER_ENV === 'development' && (
        <Flex width={'100%'} justifyContent={'center'}>
          <Button variant={'outlined'} onClick={handleUnsubscribe} height={20}>
            <Text size={'sm'}>Unsubscribe</Text>
          </Button>
        </Flex>
      )}
      <HiddenNotice />
    </Screen>
  );
};
