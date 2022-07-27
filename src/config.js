export default {
  IsProductEnv: process.env.REACT_APP_PUBLIC_ENV === 'production',
  DIDResolverUrl: process.env.REACT_APP_PUBLIC_ENV === 'production' ? 'mainnet' : 'testnet',
  serverUrl: 'https://service.hivehub.xyz',
  ApplicationDID: 'did:elastos:ik3ngW1tRxzTtwRstgkCWuv4SmUQ6nGcML'
};
