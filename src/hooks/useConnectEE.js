import { useNavigate } from 'react-router-dom';
import { DID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { useSnackbar } from 'notistack';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { isInAppBrowser } from '../service/common';
import { essentialsConnector, isUsingEssentialsConnector } from '../service/connectivity';
import { firebaseConfig } from '../config';
import { useUserContext } from '../contexts/UserContext';

if (firebaseConfig.apiKey) {
  const app = initializeApp(firebaseConfig);
  getAnalytics(app);
}

export default function useConnectEE() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, setUser } = useUserContext();

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
      const elastosDID = `did:elastos:${did}`;
      localStorage.setItem('did', elastosDID);
      setUser({ ...user, did: elastosDID });
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
