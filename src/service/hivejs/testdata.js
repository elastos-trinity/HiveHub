import {
  Claims,
  DefaultDIDAdapter,
  DIDBackend,
  DIDDocument,
  JWTParserBuilder,
  VerifiableCredential,
  VerifiablePresentation,
  DID
} from '@elastosfoundation/did-js-sdk';
import {
  AppContext,
  BackupService,
  HiveException,
  VaultServices,
  Backup
} from '@elastosfoundation/hive-js-sdk';
import { connectivity, DID as ConDID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { AppDID } from './did/appdid';
import { UserDID } from './did/userdid';
import ClientConfig from './config/clientconfig';
import { NoLoginError } from './error';

export default class SdkContext {
  static INSTANCE;

  static DID_NET = 'mainnet';

  static APPLICATION_DID = 'did:elastos:iqtWRVjz7gsYhyuQEb1hYNNmWQt1Z9geXg';

  static RESOLVE_CACHE = 'data/didCache';

  static USER_DIR = '/data/userDir';

  static isTest = false;

  // for test.
  isInit = false;

  clientConfig = ClientConfig.CUSTOM;

  userDid;

  callerDid;

  appInstanceDid;

  context;

  callerContext;

  appIdCredential;

  curLoginUserDidStr;

  curLoginUserNodeUrl; // maybe null

  static async getInstance() {
    if (!SdkContext.INSTANCE) {
      SdkContext.INSTANCE = new SdkContext();
    }
    if (SdkContext.isTest) await SdkContext.INSTANCE.initByTestDid();
    else await SdkContext.INSTANCE.initByLoginDid();
    return SdkContext.INSTANCE;
  }

  constructor() {
    connectivity.setApplicationDID(SdkContext.APPLICATION_DID);
    DIDBackend.initialize(new DefaultDIDAdapter(SdkContext.DID_NET));
    AppContext.setupResolver(SdkContext.DID_NET, SdkContext.RESOLVE_CACHE);
  }

  /**
   * for test.
   */
  async initByTestDid() {
    console.log('Init SDKContext by preset user did.');
    if (this.isInit) {
      return;
    }

    const applicationConfig = this.clientConfig.application;
    this.appInstanceDid = await AppDID.create(
      applicationConfig.name,
      applicationConfig.mnemonics2,
      applicationConfig.passPhrase,
      applicationConfig.storepass,
      applicationConfig.did
    );

    const userConfig = this.clientConfig.user;
    this.userDid = await UserDID.create(
      userConfig.name,
      userConfig.mnemonic,
      userConfig.passPhrase,
      userConfig.storepass,
      userConfig.did
    );

    // TestData.LOG.trace("UserDid created");
    const userConfigCaller = this.clientConfig.cross.user;
    this.callerDid = await UserDID.create(
      userConfigCaller.name,
      userConfigCaller.mnemonic,
      userConfigCaller.passPhrase,
      userConfigCaller.storepass,
      userConfigCaller.did
    );

    // Application Context
    const owner = this;
    this.context = await AppContext.build(
      {
        getLocalDataDir() {
          return owner.getLocalStorePath();
        },

        async getAppInstanceDocument() {
          try {
            return await owner.getAppInstanceDIDDoc();
          } catch (e) {
            console.error(`failed to get app instance doc: ${e}`);
          }
          return null;
        },

        async getAuthorization(jwtToken) {
          try {
            const claims = (await new JWTParserBuilder().build().parse(jwtToken)).getBody();
            if (claims == null) {
              throw new HiveException('Invalid jwt token as authorization.');
            }

            const presentation = await owner.appInstanceDid.createPresentation(
              await owner.userDid.issueDiplomaFor(owner.appInstanceDid),
              claims.getIssuer(),
              claims.get('nonce')
            );

            // TestData.LOG.debug("TestData->presentation: " + presentation.toString(true));
            return await owner.appInstanceDid.createToken(presentation, claims.getIssuer());
          } catch (e) {
            // TestData.LOG.info("TestData->getAuthorization error: " + e);
            console.log(`TestData->getAuthorization error: ${e}, ${e.stack}`);
            // TestData.LOG.error(e.stack);
          }
        }
      },
      owner.userDid.getDid().toString()
    );

    this.callerContext = await AppContext.build(
      {
        // @Override
        getLocalDataDir() {
          return owner.getLocalStorePath();
        },

        async getAppInstanceDocument() {
          try {
            return await owner.appInstanceDid.getDocument();
          } catch (e) {
            // TestData.LOG.error(e.stack);
          }
          return null;
        },

        async getAuthorization(jwtToken) {
          try {
            return owner.getAuthAuthorization(jwtToken);
          } catch (e) {
            throw new HiveException(e.getMessage(), e);
          }
        }
      },
      this.callerDid.getDid().toString()
    );
  }

  getProviderAddress() {
    return this.clientConfig.node.provider;
  }

  async getAppInstanceDIDDoc() {
    const res = await this.appInstanceDid.getDocument();
    return res;
  }

  /**
   * for real
   * @private
   */
  async initByLoginDid() {
    console.log('Init SDKContext by essentials login user did.');
    const userDidStr = SdkContext.getLoginUserDid();
    if (!userDidStr) {
      throw new NoLoginError('Can not initialize SdkContext.');
    } else if (userDidStr === this.curLoginUserDidStr) {
      return;
    }
    this.context = await this.getLoginAppContext();
    this.curLoginUserDidStr = userDidStr;
    this.curLoginUserNodeUrl = await this.getLoginUserNodeUrl();
  }

  getAppContext() {
    return this.context;
  }

  getLocalStorePath() {
    return `${SdkContext.USER_DIR}/data/store/${this.clientConfig.node.storePath}`;
  }

  getTargetProviderAddress() {
    return this.clientConfig.node.targetHost;
  }

  getTargetServiceDid() {
    return this.clientConfig.node.targetDid;
  }

  newVault() {
    return new VaultServices(this.context, this.getProviderAddress());
  }

  // newBackup(): Backup {
  //     return new Backup(this.context, this.getProviderAddress());
  // }

  getBackupService() {
    const backupService = this.newVault().getBackupService();
    const self = this;
    backupService.setBackupContext({
      getParameter(parameter) {
        switch (parameter) {
          case 'targetAddress':
            return self.getTargetProviderAddress();

          case 'targetServiceDid':
            return self.getTargetServiceDid();

          default:
            break;
        }
        return null;
      },

      getType() {
        return null;
      },

      async getAuthorization(srcDid, targetDid, targetHost) {
        try {
          return (
            await self.userDid.issueBackupDiplomaFor(srcDid, targetHost, targetDid)
          ).toString();
        } catch (e) {
          throw new HiveException(e.toString());
        }
      }
    });
    return backupService;
  }

  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////// ///
  // For login user ConDID.

  async getLoginAppContext() {
    const owner = this;
    const userDidStr = SdkContext.getLoginUserDid();
    const context = await AppContext.build(
      {
        getLocalDataDir() {
          return owner.getLoginLocalStorePath();
        },

        async getAppInstanceDocument() {
          try {
            console.log(`enter getAppInstanceDocument() of the app context.`);
            return await SdkContext.getLoginAppInstanceDidDoc();
          } catch (e) {
            console.error(`Failed to get application instance did documentation.`);
            return null;
          }
        },

        async getAuthorization(jwtToken) {
          try {
            console.log(`enter getAuthorization() of the app context.`);
            return await owner.getAuthAuthorization(jwtToken);
          } catch (e) {
            console.error(`TestData->getAuthorization error: ${e}`);
            return null;
          }
        }
      },
      userDidStr
    );
    return context;
  }

  getLoginBackupAppContext(targetUrl, targetDid) {
    const self = this;
    return {
      getParameter(parameter) {
        switch (parameter) {
          case 'targetAddress':
            return targetUrl;

          case 'targetServiceDid':
            return targetDid;

          default:
            break;
        }
        return null;
      },

      getType() {
        return null;
      },

      async getAuthorization(srcDid, targetDid, targetHost) {
        try {
          // TODO: make this work with connectivity sdk after supported this.
          return (
            await self.userDid.issueBackupDiplomaFor(srcDid, targetHost, targetDid)
          ).toString();
        } catch (e) {
          throw new HiveException(e.toString());
        }
      }
    };
  }

  static getLoginLocalStorePath() {
    return `${SdkContext.USER_DIR}/data/store/develop`;
  }

  static async getLoginAppInstanceDidDoc() {
    console.log('enter SdkContext.getLoginAppInstanceDidDoc()');
    const didAccess = new ConDID.DIDAccess();
    const info = await didAccess.getOrCreateAppInstanceDID();
    const res = await info.didStore.loadDid(info.did.toString());
    return res;
  }

  async getAuthAuthorization(challenge) {
    console.log('enter SdkContext.getAuthAuthorization()');
    const claims = (await new JWTParserBuilder().build().parse(challenge)).getBody();
    if (claims == null) {
      throw new HiveException('Invalid jwt token as authorization.');
    }
    if (!claims.getIssuer() || !claims.get('nonce')) {
      throw new HiveException(
        'The received authentication JWT token does not contain iss or nonce'
      );
    }
    const nonce = claims.get('nonce');
    const hiveDid = claims.getIssuer();
    this.appIdCredential = await this.checkAppIdCredentialStatus(this.appIdCredential);
    if (!this.appIdCredential) {
      throw new HiveException('Can not get the credential for the application instance.');
    }
    const storePassword = 'password';
    const vp = await AppDID.createVerifiablePresentation(
      this.appIdCredential,
      hiveDid,
      nonce,
      storePassword
    );
    const res = await AppDID.createChallengeResponse(vp, hiveDid, storePassword);
    return res;
  }

  // checkAppIdCredentialStatus(appIdCredential) {
  //   return new Promise(async (resolve, reject) => {
  //     if (this.checkCredentialValid(appIdCredential)) {
  //       console.log(`Credential valid, credential is ${this.appIdCredential}`);
  //       resolve(appIdCredential);
  //       return;
  //     }

  //     console.log(
  //       'checkAppIdCredentialStatus: Credential invalid, Getting app identity credential'
  //     );

  //     const didAccess = new ConDID.DIDAccess();
  //     try {
  //       let credential = await didAccess.getExistingAppIdentityCredential();
  //       if (credential) {
  //         console.log(`Get app identity credential ${credential}`);
  //         resolve(credential);
  //         return;
  //       }

  //       console.log('checkAppIdCredentialStatus: getExistingAppIdentityCredential, failed');

  //       credential = await didAccess.generateAppIdCredential();
  //       if (credential) {
  //         console.log(`Generate app identity credential, credential is ${credential}`);
  //         resolve(credential);
  //         return;
  //       }

  //       const error = `Get app identity credential error, credential is ${JSON.stringify(
  //         credential
  //       )}`;
  //       console.error(error);
  //       reject(error);
  //     } catch (error) {
  //       console.error(`Failed to check the application credential: ${error}`);
  //       reject(error);
  //     }
  //   });
  // }

  checkAppIdCredentialStatus(appIdCredential) {
    return new Promise((resolve, reject) => {
      if (this.checkCredentialValid(appIdCredential)) {
        console.log(`Credential valid, credential is ${this.appIdCredential}`);
        resolve(appIdCredential);
        return;
      }

      console.log(
        'checkAppIdCredentialStatus: Credential invalid, Getting app identity credential'
      );

      const didAccess = new ConDID.DIDAccess();
      let credential;
      didAccess
        .getExistingAppIdentityCredential()
        .then((_credential) => {
          credential = _credential;
          if (credential) {
            console.log(`Get app identity credential ${credential}`);
            resolve(credential);
            return;
          }

          console.log('checkAppIdCredentialStatus: getExistingAppIdentityCredential, failed');

          return didAccess.generateAppIdCredential();
        })
        .then((_credential) => {
          credential = _credential;
          if (credential) {
            console.log(`Generate app identity credential, credential is ${credential}`);
            resolve(credential);
            return;
          }

          const error = `Get app identity credential error, credential is ${JSON.stringify(
            credential
          )}`;
          console.error(error);
          reject(error);
        })
        .catch((error) => {
          console.error(`Failed to check the application credential: ${error}`);
          reject(error);
        });
    });
  }

  static checkCredentialValid(appIdCredential) {
    return appIdCredential && appIdCredential.getExpirationDate().valueOf() >= new Date().valueOf();
  }

  static async getLoginUserNodeUrl() {
    const userDidStr = SdkContext.getLoginUserDid();
    if (!userDidStr) {
      throw new NoLoginError('Can not get the hive node url of the login user did.');
    }
    const userDidDocument = await DID.from(userDidStr).resolve();
    const service = userDidDocument.getService(`${userDidStr}#hivevault`);
    if (!service) {
      return null;
    }
    return `${service.getServiceEndpoint()} :443`;
  }

  static async updateLoginUserNodeUrl(url) {
    // TODO: Need essentials connector support first.
    console.warn(`TODO: publish the node url (${url}) for login user.`);
  }

  static getLoginUserDid() {
    const did = localStorage.getItem('did');
    if (!did) {
      return null;
    }
    return `did:elastos:${did}`;
  }

  static isLogined() {
    return !!SdkContext.getLoginUserDid();
  }
}
