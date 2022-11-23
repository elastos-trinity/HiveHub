import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const initialState = {
  dlgState: {},
  setDlgState: () => {}
};

const DialogContext = createContext(initialState);

DialogContextProvider.propTypes = {
  children: PropTypes.node
};

function DialogContextProvider({ children }) {
  const [dlgState, setDlgState] = useState({
    // remove node
    confirmDlgOpened: false,
    removeNodeNid: 0,
    removeNodeOwnerDid: '',
    // select backup / migrate node
    selectBackupNodeDlgOpened: false,
    selectMigrateNodeDlgOpened: false,
    backupNodeUrl: ''
  });

  return (
    <DialogContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        dlgState,
        setDlgState
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

const useDialogContext = () => useContext(DialogContext);

export { DialogContextProvider, DialogContext, useDialogContext };
