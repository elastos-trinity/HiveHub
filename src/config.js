export default {
  IsProductEnv: process.env.REACT_APP_PUBLIC_ENV === 'production',
  DIDResolverUrl:
    process.env.REACT_APP_PUBLIC_ENV === 'production'
      ? 'https://api.trinity-tech.cn/eid'
      : 'https://api-testnet.trinity-tech.cn/eid',
  NodeProviderUrl:
    process.env.REACT_APP_PUBLIC_ENV === 'production'
      ? 'https://hive1.trinity-tech.io'
      : 'https://hive-testnet1.trinity-tech.io',
  serverUrl: 'https://service.hivehub.xyz',
  ApplicationDID: 'did:elastos:ik3ngW1tRxzTtwRstgkCWuv4SmUQ6nGcML'
};
