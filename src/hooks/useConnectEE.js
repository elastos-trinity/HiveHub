import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import Web3 from 'web3';
import { useSnackbar } from 'notistack';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { isInAppBrowser, isSupportedNetwork } from '../service/common';
import {
  essentialsConnector,
  initConnectivitySDK,
  isUsingEssentialsConnector
} from '../service/connectivity';
import { firebaseConfig } from '../config';

if (firebaseConfig.apiKey) {
  const app = initializeApp(firebaseConfig);
  getAnalytics(app);
}

export default function useConnectEE() {
  const navigate = useNavigate();
  const [walletConnectProvider] = useState(essentialsConnector.getWalletConnectProvider());
  const { enqueueSnackbar } = useSnackbar();
  initConnectivitySDK();

  useEffect(() => {
    const handleEEAccountsChanged = (accounts) => {
      console.log('Account Changed: ', accounts);
    };
    const handleEEChainChanged = (chainId) => {
      console.log('ChainId Changed', chainId);
      if (chainId && !isSupportedNetwork(chainId)) showChainErrorSnackBar();
    };
    const handleEEDisconnect = (code, reason) => {
      console.log('Disconnect code: ', code, ', reason: ', reason);
      signOutWithEssentials();
    };
    const handleEEError = (code, reason) => {
      console.error(code, reason);
    };

    if (isInAppBrowser()) {
      const inAppProvider = window.elastos.getWeb3Provider();
      const inAppWeb3 = new Web3(inAppProvider);
      inAppWeb3.eth.getChainId().then((chainId) => {
        if (chainId && !isSupportedNetwork(chainId)) showChainErrorSnackBar();
      });
    } else {
      walletConnectProvider.on('accountsChanged', handleEEAccountsChanged);
      walletConnectProvider.on('chainChanged', handleEEChainChanged);
      walletConnectProvider.on('disconnect', handleEEDisconnect);
      walletConnectProvider.on('error', handleEEError);
    }
    return () => {
      if (walletConnectProvider.removeListener) {
        walletConnectProvider.removeListener('accountsChanged', handleEEAccountsChanged);
        walletConnectProvider.removeListener('chainChanged', handleEEChainChanged);
        walletConnectProvider.removeListener('disconnect', handleEEDisconnect);
        walletConnectProvider.removeListener('error', handleEEError);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletConnectProvider]);

  const showChainErrorSnackBar = async () => {
    // enqueueSnackbar('', {
    //   anchorOrigin: { horizontal: 'right', vertical: 'top' },
    //   autoHideDuration: 5000,
    //   content: (key) => (
    //     <SnackMessage
    //       id={key}
    //       message="Wrong network, only Elastos Smart Chain is supported"
    //       variant="error"
    //     />
    //   )
    // });
    enqueueSnackbar('Wrong network, only Elastos Smart Chain is supported', {
      variant: 'error',
      anchorOrigin: { horizontal: 'right', vertical: 'top' }
    });
  };

  const signInWithEssentials = async () => {
    const didAccess = new DID.DIDAccess();
    let presentation;
    console.log('Trying to sign in using the connectivity SDK');
    try {
      presentation = await didAccess.requestCredentials({
        claims: [
          DID.simpleIdClaim('Your avatar', 'avatar', false),
          DID.simpleIdClaim('Your name', 'name', false),
          DID.simpleIdClaim('Your description', 'description', false)
        ]
      });
    } catch (e) {
      console.warn('Error while getting credentials', e);
      try {
        await essentialsConnector.getWalletConnectProvider().disconnect();
      } catch (e) {
        console.error('Error while trying to disconnect wallet connect session', e);
      }
      return;
    }

    if (presentation) {
      const did = presentation.getHolder().getMethodSpecificId();
      localStorage.setItem('did', `did:elastos:${did}`);
      enqueueSnackbar('success', {
        variant: 'success',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
      navigate('/dashboard');
    }
  };

  const signOutWithEssentialsWithoutRefresh = async () => {
    console.log('Signing out user. Deleting session info');
    localStorage.removeItem('did');
    try {
      if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession())
        await essentialsConnector.getWalletConnectProvider().disconnect();
      if (isInAppBrowser() && (await window.elastos.getWeb3Provider().isConnected()))
        await window.elastos.getWeb3Provider().disconnect();
    } catch (e) {
      console.error('Error while disconnecting the wallet', e);
    }
  };

  const signOutWithEssentials = async () => {
    console.log('Signing out user. Deleting session info');
    localStorage.removeItem('did');
    try {
      if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession())
        await essentialsConnector.getWalletConnectProvider().disconnect();
      if (isInAppBrowser() && (await window.elastos.getWeb3Provider().isConnected()))
        await window.elastos.getWeb3Provider().disconnect();
    } catch (e) {
      console.error('Error while disconnecting the wallet', e);
    }
    window.location.reload();
  };

  const isConnectedEE =
    isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession();

  return {
    isConnectedEE,
    signInWithEssentials,
    signOutWithEssentialsWithoutRefresh,
    signOutWithEssentials
  };
}
