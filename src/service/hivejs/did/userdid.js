import {
  VerifiableCredential,
  Issuer,
  VerifiablePresentation,
  DIDDocument,
  JWTHeader,
  DIDURL
} from '@elastosfoundation/did-js-sdk';
import dayjs from 'dayjs';
import { AppDID } from './appdid';
import { DIDEntity } from './didentity';

export class UserDID extends DIDEntity {
  issuer;

//   constructor(name, mnemonic, phrasepass, storepass, did) {
//     super(name, mnemonic, phrasepass, storepass, did);
//   }

  static async create(name, mnemonic, phrasepass, storepass, did) {
    const newInstance = new UserDID(name, mnemonic, phrasepass, storepass, did);
    await newInstance.initPrivateIdentity(mnemonic);
    await newInstance.initDid();

    const doc = await newInstance.getDocument();
    newInstance.setIssuer(new Issuer(doc));

    return newInstance;
  }

  setIssuer(issuer) {
    this.issuer = issuer;
  }

  async issueDiplomaFor(appInstanceDid) {
    // 	let issuerObject = new Issuer(userDocument, id);
    // let vcBuilder = new VerifiableCredential.Builder(issuerObject, appDid);
    // let vc = await vcBuilder
    //   .expirationDate(this.getExpirationDate())
    //   .type('AppIdCredential')
    //   .property('appDid', appDid.toString())
    //   .property('appInstanceDid', appDid.toString())
    //   .id(DIDURL.from('#app-id-credential', appDid) as DIDURL)
    //   .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string); // and we sign so it creates a Proof with method and signature

    const subject = {};

    subject.appDid = appInstanceDid.getDid();
    subject.appInstanceDid = appInstanceDid.getDid();

    let cal = dayjs();
    cal = cal.add(5, 'year');

    const cb = this.issuer.issueFor(appInstanceDid.getDid());
    const vc = await cb
      .id(DIDURL.from('#app-id-credential', appInstanceDid.getDid()))
      .type('AppIdCredential')
      .properties(subject)
      .expirationDate(cal.toDate())
      .seal(this.getStorePassword());

    UserDID.LOG.debug('VerifiableCredential: {}', vc.toString());
    UserDID.LOG.trace('VerifiableCredential IsValid: {}', vc.isValid());
    return vc;
  }

  async issueBackupDiplomaFor(sourceDID, targetHost, targetDID) {
    const subject = {};
    subject.sourceDID = sourceDID;
    subject.targetHost = targetHost;
    subject.targetDID = targetDID;

    const cal = dayjs();
    cal.add(5, 'year');

    const cb = this.issuer.issueFor(sourceDID);
    const vc = await cb
      .id('backupId')
      .type('BackupCredential')
      .properties(subject)
      .expirationDate(cal.toDate())
      .seal(this.getStorePassword());

    UserDID.LOG.info('BackupCredential: {}', vc.toString());

    return vc;
  }
}
