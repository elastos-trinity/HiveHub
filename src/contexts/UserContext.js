import { createContext } from 'react';

const UserContext = createContext({
  user: {
    did: localStorage.getItem('did')
  }
});

export default UserContext;
