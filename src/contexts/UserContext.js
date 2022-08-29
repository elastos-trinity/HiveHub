import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { getCredentialsFromDIDDoc } from '../service/common';
import {
  getActiveHiveNodeUrl,
  getDIDDocumentFromDID,
  getNodeProviderUrl,
  fetchHiveScriptPictureToDataUrl,
  getHiveAvatarUrlFromDIDAvatarCredential
} from '../service/fetch';

const initialState = {
  user: {},
  setDid: () => {}
};

const UserContext = createContext(initialState);

UserContextProvider.propTypes = {
  children: PropTypes.node
};

function UserContextProvider({ children }) {
  const { enqueueSnackbar } = useSnackbar();
  const [ownerDid] = useState(localStorage.getItem('did'));
  const [user, setUser] = useState({
    did: localStorage.getItem('did'),
    avatar: null,
    didDoc: undefined,
    credentials: {},
    nodeProvider: '',
    activeNodes: []
  });

  const getUserInfo = useCallback(
    async (did) => {
      const didDoc = await getDIDDocumentFromDID(did);
      const credentials = getCredentialsFromDIDDoc(didDoc);
      const nodeProvider = await getNodeProviderUrl(did);
      const activeNodes = await getActiveHiveNodeUrl();
      if (!didDoc) {
        enqueueSnackbar('Your DID is not published to the side chain, Please publish your DID.', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
      } else if (!nodeProvider) {
        enqueueSnackbar('Your DID is not bind to any Hive Node, Please bind your DID.', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
      } else if (!activeNodes.includes(nodeProvider)) {
        enqueueSnackbar(
          `You are connected to invalid Hive Node(${nodeProvider}), Please select another one.`,
          {
            variant: 'error',
            anchorOrigin: { horizontal: 'right', vertical: 'top' }
          }
        );
      }

      let avatarUrl = null;
      if (did && credentials && credentials.avatar) {
        const hiveAvatarUrl = getHiveAvatarUrlFromDIDAvatarCredential(credentials.avatar);
        avatarUrl = await fetchHiveScriptPictureToDataUrl(hiveAvatarUrl, did);
      }
      setUser((prevState) => {
        const state = { ...prevState };
        state.did = did;
        state.didDoc = didDoc;
        state.nodeProvider = nodeProvider;
        state.credentials = credentials;
        state.avatar = avatarUrl;
        state.activeNodes = activeNodes;
        return state;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ownerDid]
  );

  useEffect(() => {
    if (ownerDid) getUserInfo(ownerDid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerDid]);

  return (
    <UserContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        user,
        setUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

const useUserContext = () => useContext(UserContext);

export { UserContextProvider, UserContext, useUserContext };
