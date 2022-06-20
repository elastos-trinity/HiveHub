import {
  VerifiableCredential,
  VerifiablePresentation,
  DIDDocument,
  JWTHeader,
  DefaultDIDAdapter,
  DIDBackend,
  VerificationEventListener
} from '@elastosfoundation/did-js-sdk';
import { DID as ConDID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import dayjs from 'dayjs';
import { DIDEntity } from './didentity';

export class AppDID extends DIDEntity {
  appId = 'appId';

  //   constructor(name, mnemonic, phrasepass, storepass, did) {
  //     super(name, mnemonic, phrasepass, storepass, did);
  //   }

  static async create(name, mnemonic, phrasepass, storepass, did) {
    DIDBackend.initialize(new DefaultDIDAdapter('mainnet'));
    // DIDBackend.initialize(new DefaultDIDAdapter("https://api-testnet.elastos.io/newid"));
    const newInstance = new AppDID(name, mnemonic, phrasepass, storepass, did);
    await newInstance.initPrivateIdentity(mnemonic);
    await newInstance.initDid();

    return newInstance;
  }

  getAppDid() {
    return this.getDid().toString();
  }

  async createPresentation(vc, realm, nonce) {
    const vpb = await VerifiablePresentation.createFor(this.getDid(), null, this.getDIDStore());
    const vp = await vpb.credentials(vc).realm(realm).nonce(nonce).seal(this.getStorePassword());

    AppDID.LOG.info('VerifiablePresentation:{}', vp.toString());

    const listener = VerificationEventListener.getDefaultWithIdent('isValid');
    AppDID.LOG.trace('VerifiablePresentation is Valid :{}', await vp.isValid(listener));
    AppDID.LOG.trace('Listener :{}', listener.toString());

    return vp;
  }

  async createToken(vp, hiveDid) {
    const cal = dayjs();
    const iat = cal.unix();
    const nbf = cal.unix();
    const exp = cal.add(3, 'month').unix();

    // Create JWT token with presentation.
    const doc = await this.getDocument();
    const token = await doc
      .jwtBuilder()
      .addHeader(JWTHeader.TYPE, JWTHeader.JWT_TYPE)
      .addHeader('version', '1.0')
      .setSubject('DIDAuthResponse')
      .setAudience(hiveDid)
      .setIssuedAt(iat)
      .setExpiration(exp)
      .setNotBefore(nbf)
      .claimsWithJson('presentation', vp.toString(true))
      .sign(this.storepass);

    AppDID.LOG.info('JWT Token: {}', token);
    return token;
  }

  static async getAppInstanceDIDDoc() {
    const access = new ConDID.DIDAccess();
    const info = await access.getOrCreateAppInstanceDID();
    const json = await info.didStore.loadDid(info.did);
    return json;
  }

  static async createVerifiablePresentation(vc, hiveDid, nonce, storepass) {
    const access = new ConDID.DIDAccess();
    const info = await access.getOrCreateAppInstanceDID();
    const info2 = await access.getExistingAppInstanceDIDInfo();
    const vpb = await VerifiablePresentation.createFor(info.did, null, info.didStore);
    const vp = await vpb.credentials(vc).realm(hiveDid).nonce(nonce).seal(info2.storePassword);
    const listener = VerificationEventListener.getDefaultWithIdent('isValid');
    return vp;
  }

  static async createChallengeResponse(vp, hiveDid, storepass) {
    const cal = dayjs();
    const iat = cal.unix();
    const nbf = cal.unix();
    const exp = cal.add(3, 'month').unix();

    // Create JWT token with presentation.
    const doc = await AppDID.getAppInstanceDIDDoc();
    const info = await new ConDID.DIDAccess().getExistingAppInstanceDIDInfo();
    const token = await doc
      .jwtBuilder()
      .addHeader(JWTHeader.TYPE, JWTHeader.JWT_TYPE)
      .addHeader('version', '1.0')
      .setSubject('DIDAuthResponse')
      .setAudience(hiveDid)
      .setIssuedAt(iat)
      .setExpiration(exp)
      .setNotBefore(nbf)
      .claimsWithJson('presentation', vp.toString(true))
      .sign(info.storePassword);
    console.log(`challenge response: ${token}`);
    return token;
  }
}
