import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as epns from '@epnsproject/sdk-restapi';
import { useChannelContext } from '../ChannelContext';
import { usePrevious } from '../../hooks/usePrevious';
import { Routes, useRouterContext } from '../RouterContext';
import { useAuthenticate } from '../../hooks/useAuthenticate';
import { useSignerContext, EthTypedData } from '../SignerContext';
import { isMainnnet } from '../../global/helpers';
import { getApolloClient } from '../../services/apolloClient';
import { UserSubscribeDocument } from '../../screens/subscribe/operations.generated';
import {
  ChannelsDiscoveryDocument,
  GetUserSubscriptionsDocument,
} from '../../screens/settings/operations.generated';
import useLoadAuthFromStorage from './useLoadAuthFromStorage';
import authStorage from 'services/authStorage';
import analytics from 'services/analytics';

export type AuthInfo = {
  subscribe(channelAddress?: string): void;
  unsubscribe(channelAddress?: string): void;
  isLoading: boolean;
  error: boolean;
  isLoggedIn?: boolean;
  loggedInAddress?: string;
  discordToken?: string;
  login(callback?: () => void): Promise<void>;
  logout(): void;
  isOnboarding: boolean;
  isSubscribed?: boolean;
  setIsOnboarding(isFirst: boolean): void;
};

const isUserSubscribed = async (args: {
  userAddress: string;
  channelAddress: string;
  chainId: number;
}): Promise<boolean> => {
  const { userAddress, channelAddress, chainId } = args;
  const subbedChannels: { channel: string }[] = await epns.user.getSubscriptions({
    user: `eip155:${chainId}:${userAddress}`,
    env: isMainnnet(chainId) ? undefined : 'staging',
  });
  const subbedChannelsLower = subbedChannels.map((s) => s.channel.toLowerCase());
  return subbedChannelsLower.indexOf(channelAddress.toLowerCase()) !== -1;
};

const AuthContext = createContext<AuthInfo & { loading?: boolean; handleGetUserInfo?: () => void }>(
  {} as AuthInfo
);

const AuthProvider = ({
  children,
  partnerKey,
  discordToken,
}: {
  partnerKey: string;
  children: ReactNode;
  discordToken?: string;
}) => {
  const { setRoute } = useRouterContext();
  const { channelAddress, chainId } = useChannelContext();
  const { signTypedData, refetchSigner, address, isConnected, disconnect } = useSignerContext();
  const { login: _login } = useAuthenticate();

  const [isSubscribed, setIsSubscribed] = useState<boolean>();
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
  const [loggedInAddress, setLoggedInAddress] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useLoadAuthFromStorage({ address, setLoggedInAddress, setIsLoggedIn, partnerKey });

  useEffect(() => {
    if (!isConnected || !channelAddress) {
      return;
    }

    (async () => {
      setIsLoading(true);
      setIsSubscribed(
        await isUserSubscribed({
          userAddress: address as string,
          channelAddress,
          chainId,
        })
      );
      setIsLoading(false);
    })();
  }, [channelAddress, address, isConnected, chainId]);

  const login = async (callback?: () => void) => {
    if (isLoggedIn) {
      callback && callback();
      return;
    }

    analytics.track('backend login started');
    setIsLoading(true);
    setError(false);

    try {
      const result = await _login(channelAddress);
      analytics.track('backend login successful');

      if (address) {
        authStorage.saveAndSetTokensForAddress({ ...result, address });
      }

      setLoggedInAddress(address);
      setIsLoggedIn(true);

      callback && callback();
    } catch (e) {
      setError(true);
      _resetLoginState();
    } finally {
      setIsLoading(false);
    }
  };

  const _resetLoginState = async () => {
    if (address && authStorage.switchActiveWalletTokens(address)) {
      setIsLoggedIn(true);
      setLoggedInAddress(address);
      await refetchSigner(); // must be refetched to instantiate with new wallet
    } else {
      setIsLoggedIn(false);
      setLoggedInAddress('');
    }
  };

  const logout = useCallback(() => {
    disconnect();
    _resetLoginState();
    setIsSubscribed(false);
    setError(false);
    setIsLoading(false);
  }, [disconnect]);

  useEffect(() => {
    if (!isConnected) {
      logout();
    } else if (!isSubscribed) {
      setRoute(Routes.Subscribe);
    }
  }, [isConnected, isSubscribed]);

  const prevAddress = usePrevious(address);
  // usePrevious is needed to detect address change and remove AUTH_KEY from local storage
  // for cases when user switches accounts manually
  useEffect(() => {
    if (prevAddress && prevAddress !== address) {
      _resetLoginState();
      const client = getApolloClient({ endpoint: '' });
      // refetch local queries that are dependant on address
      client.refetchQueries({ include: [ChannelsDiscoveryDocument, GetUserSubscriptionsDocument] });
      setIsOnboarding(false);
    }
  }, [address]);

  const toggleSubscription = async (action: 'sub' | 'unsub', subbedChannel?: string) => {
    setIsLoading(true);
    const params = {
      signer: {
        _signTypedData: (
          domain: EthTypedData['domain'],
          types: EthTypedData['types'],
          message: EthTypedData['message']
        ) => signTypedData({ message, domain, types, primaryType: Object.keys(types)[0] }),
      } as any,
      channelAddress: `eip155:${chainId}:${subbedChannel || channelAddress}`,
      userAddress: `eip155:${chainId}:${address}`,
      env: isMainnnet(chainId) ? undefined : 'staging',
    };

    const response =
      action == 'sub'
        ? await epns.channels.subscribe(params)
        : await epns.channels.unsubscribe(params);

    setIsLoading(false);

    if (response.status == 'success') {
      // if action is not related to logged in channel do nothing
      if (subbedChannel) return;
      setIsSubscribed(action === 'sub');
    } else {
      throw `Wherever: error ${action}scribing to channel: ${response.message}`;
    }
  };

  const subscribe = async (address?: string) => toggleSubscription('sub', address);
  const unsubscribe = async (address?: string) => toggleSubscription('unsub', address);

  return (
    <AuthContext.Provider
      value={{
        subscribe,
        isSubscribed,
        unsubscribe,
        isLoggedIn,
        loggedInAddress,
        isLoading,
        error,
        login,
        logout,
        isOnboarding,
        setIsOnboarding,
        discordToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuthContext() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuthContext };
