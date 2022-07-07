import {
  RootIdentity,
  DIDStore,
  DID,
  DIDDocument,
  HDKey,
  DIDURL
} from '@elastosfoundation/did-js-sdk';
import { File, Logger } from '@elastosfoundation/hive-js-sdk';

export class DIDEntity {
  static LOG = new Logger('DIDEntity');

  name;

  phrasepass;

  mnemonic;

  storepass;

  identity;

  store;

  did;

  didString;

  constructor(name, mnemonic, phrasepass, storepass, did) {
    this.name = name;
    this.phrasepass = phrasepass;
    this.storepass = storepass;
    this.didString = did;
    this.mnemonic = mnemonic;
    // void this.initPrivateIdentity(mnemonic).finally(() => { void this.initDid() });
  }

  async initPrivateIdentity(mnemonic) {
    const storePath = `data/didCache${File.SEPARATOR}${this.name}`;

    this.store = await DIDStore.open(storePath);

    const id = RootIdentity.getIdFromMnemonic(mnemonic, this.phrasepass);
    if (this.store.containsRootIdentity(id)) {
      this.identity = await this.store.loadRootIdentity(id);
      return; // Already exists
    }

    DIDEntity.LOG.info('Creating root identity for mnemonic {}', mnemonic);

    try {
      this.identity = RootIdentity.createFromMnemonic(
        mnemonic,
        this.phrasepass,
        this.store,
        this.storepass
      );
    } catch (e) {
      DIDEntity.LOG.error('Error Creating root identity for mnemonic {}. Error {}', mnemonic, e);
      throw new Error('Error Creating root identity for mnemonic');
    }

    await this.identity.synchronize();

    if (this.didString !== undefined) {
      this.identity.setDefaultDid(this.didString);
      const defaultDid = this.identity.getDefaultDid();
      DIDEntity.LOG.info(
        '************************************* default DID: {}',
        defaultDid.toString()
      );
    }

    // return;
  }

  async initDid() {
    const dids = await this.store.listDids();
    const { did } = dids;
    if (dids.length > 0) {
      this.did = did;
      //   this.did = dids[0];
      return;
    }

    this.did = await this.identity.getDefaultDid();
    DIDEntity.LOG.info(
      '************************************* default DID: {}',
      this.did.toString()
    );
    const resolvedDoc = await this.did.resolve();
    DIDEntity.LOG.info(
      '************************************* My new DIDDOC resolved: {}',
      resolvedDoc.toString(true)
    );

    DIDEntity.LOG.info('{} My new DID created: {}', this.name, this.did.toString());
  }

  // public async initDid(): Promise<void> {

  // 	let doc: DIDDocument = undefined;
  // 	if (this.didString === undefined){
  // 		let dids = await this.store.listDids();
  // 		if (dids.length > 0) {
  // 			this.did = dids[0];
  // 			return;
  // 		}
  // 		doc = await this.identity.newDid(this.storepass);
  // 	}
  // 	else {
  // 		DIDEntity.LOG.info("trying to resolve did " + this.didString);

  // 		let localDoc = await this.store.loadDid(this.didString);

  // 		if (localDoc === undefined || localDoc === null){
  // 			doc = await DID.from(this.didString).resolve(true);
  // 			let key = HDKey.newWithMnemonic(this.mnemonic, "").deriveWithPath(
  // 				HDKey.DERIVE_PATH_PREFIX + 0
  // 			  );

  // 			  this.store.storePrivateKey(DIDURL.from('#primary', this.didString), key.serialize(), this.storepass);

  // 			await this.store.storeDid(doc);
  // 		} else
  // 		{
  // 			doc = localDoc;
  // 		}
  // 	}
  // 	if (!doc.isValid()){
  // 		DIDEntity.LOG.error("doc is not valid");
  // 		throw new Error("doc is not valid");
  // 	}
  // 	this.did = doc.getSubject();
  // 	DIDEntity.LOG.info("{} My new DID created: {}", this.name, this.did.toString());
  // }

  getDIDStore() {
    return this.store;
  }

  getDid() {
    return this.did;
  }

  async getDocument() {
    const res = await this.store.loadDid(this.did);
    return res;
  }

  getName() {
    return this.name;
  }

  getStorePassword() {
    return this.storepass;
  }

  toString() {
    return this.did.toString();
  }
}
