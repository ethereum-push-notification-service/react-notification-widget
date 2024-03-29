import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';
import { usePartnerInfoQuery, PartnerInfoQuery } from '../ChannelContext/operations.generated';

export type ChannelInfo = {
  icon: string;
  name: string;
  slug: string;
  channelAddress: string;
  chainId: number;
  messageCategories: PartnerInfoQuery['partnerInfo']['messageCategories'];
  discordGuildUrl?: string | null;
};

const emptyChannel = {
  channelAddress: '',
  icon: '',
  name: '',
  slug: '',
  chainId: 0,
  messageCategories: [],
  preferences: [],
  userPreferences: {},
  userChannels: [],
};

const ChannelContext = createContext<ChannelInfo & { loading?: boolean; error?: ApolloError }>(
  {} as ChannelInfo
);

const ChannelProvider = ({
  partnerKey,
  children,
}: {
  partnerKey: string;
  discordToken?: string;
  children: ReactNode;
}) => {
  const [channel, setChannel] = useState<ChannelInfo>();
  const { data, loading, error } = usePartnerInfoQuery({
    variables: {
      input: { partnerApiKey: partnerKey },
    },
    skip: !partnerKey,
  });

  useEffect(() => {
    if (!data) return;

    setChannel({
      channelAddress: data.partnerInfo.channelAddress,
      messageCategories: data.partnerInfo.messageCategories,
      icon: data.partnerInfo.logo as string,
      name: data.partnerInfo.name,
      slug: data.partnerInfo.slug as string,
      chainId: data.partnerInfo.chainId,
      discordGuildUrl: data.partnerInfo.discordGuildUrl,
    });
  }, [data]);

  return (
    <ChannelContext.Provider value={{ ...(channel || emptyChannel), loading, error }}>
      {children}
    </ChannelContext.Provider>
  );
};

function useChannelContext() {
  return useContext(ChannelContext);
}

export { ChannelProvider, useChannelContext };
