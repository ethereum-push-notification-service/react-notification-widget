import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useAccount, useDisconnect, useNetwork, useSigner } from 'wagmi';
import { utils } from 'ethers';
import useValidateProps from './useValidateProps';

type Signature = string;

export type EthTypedData = {
  types: Record<string, { name: string; type: string }[]>;
  primaryType: string;
  domain: Record<string, any>;
  message: Record<string, any>;
};

export type CustomSigner = {
  address?: string;
  chainId?: number | string;
  signMessage?: (msgToSign: string) => Promise<Signature | undefined>;
  signTypedData?: (args: EthTypedData) => Promise<Signature | undefined>;
};

export type SignerContextProps = PropsWithChildren<CustomSigner>;

type SignerContextT = {
  isConnected: boolean;
  disconnect: () => void;
  refetchSigner: () => undefined | ReturnType<ReturnType<typeof useSigner>['refetch']>;
  signMessage: (msgToSign: string) => Promise<Signature | undefined>;
  signTypedData: (args: EthTypedData) => Promise<Signature | undefined>;
  address?: `0x${string}`;
  chainId?: number;
};

const SignerContext = createContext<SignerContextT>({} as SignerContextT);

const SignerProvider = (props: SignerContextProps) => {
  const { isConnected: wagmiConnected, address: wagmiAddress } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { data: signer, refetch } = useSigner();

  const isCustomSigner = useValidateProps(props);

  // handle signer null case when reloading window after clearing storage
  const [refetchCounter, setRefetchCounter] = useState(0);

  useEffect(() => {
    if (isCustomSigner || !wagmiConnected || signer || refetchCounter > 10) return;

    const timeout = setInterval(async () => {
      refetch();
      setRefetchCounter((counter) => counter + 1);
    }, 500);

    return () => clearInterval(timeout);
  }, [signer]);

  const isConnected = isCustomSigner ? Boolean(props.address && props.chainId) : wagmiConnected;
  const chainId = isCustomSigner ? Number(props.chainId || 0) : chain?.id;
  const address = isCustomSigner ? props.address && utils.getAddress(props.address) : wagmiAddress;

  const signMessage = async (msg: string): Promise<string | undefined> => {
    if (isCustomSigner) {
      try {
        return await props.signMessage?.(msg);
      } catch (e) {
        console.error(`Wherever: Error signing message - ${e}`);
        return;
      }
    }

    if (wagmiConnected) {
      const refetchedSigner = await refetch();
      return refetchedSigner.data?.signMessage(msg);
    }
  };

  const signTypedData = async (args: EthTypedData) => {
    if (isCustomSigner) {
      // When relying on the ethers library for signing typed data, this EIP712Domain type, which describes
      // the type of the "domain" is not provided (i.e PUSH subscribe call), as it is
      // added internally by ethers when signing the data. For custom signers, this needs to be added for signing to work.
      const { domain, types } = args;
      args.types = {
        // added first so that it is replaced by spread if already included
        EIP712Domain: [
          ...(domain.name ? [{ name: 'name', type: 'string' }] : []),
          ...(domain.chainId ? [{ name: 'chainId', type: 'uint256' }] : []),
          ...(domain.verifyingContract ? [{ name: 'verifyingContract', type: 'address' }] : []),
          ...(domain.version ? [{ name: 'version', type: 'string' }] : []),
          ...(domain.salt ? [{ name: 'salt', type: 'string' }] : []),
        ],
        ...types,
      };

      try {
        return await props.signTypedData?.(args);
      } catch (e) {
        console.error(`Wherever: Error signing typed data - ${e}`);
        return;
      }
    }

    if (wagmiConnected) {
      const refetchedSigner = await refetch();
      return (refetchedSigner.data as any)?._signTypedData(args.domain, args.types, args.message);
    }
  };

  const refetchSigner = () => {
    if (isCustomSigner) {
      return;
    }

    if (wagmiConnected) {
      return refetch();
    }
  };

  const disconnect = () => {
    if (isCustomSigner) {
      return;
    }

    if (wagmiConnected) {
      return wagmiDisconnect();
    }

    return;
  };

  return (
    <SignerContext.Provider
      value={{
        disconnect,
        refetchSigner,
        signTypedData,
        signMessage,
        isConnected,
        chainId,
        address: address as `0x${string}`,
      }}
    >
      {props.children}
    </SignerContext.Provider>
  );
};

function useSignerContext() {
  return useContext(SignerContext);
}

export { SignerProvider, useSignerContext };
