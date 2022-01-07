import {Claims, DIDDocument, JWTParserBuilder} from "@elastosfoundation/did-js-sdk";
import {AppContext, HiveException} from "@dchagastelles/elastos-hive-js-sdk";
import {AppDID} from "./did/appdid";
import {UserDID} from "./did/userdid";
import path from 'path';


export default class SdkContext {
    public static INSTANCE: SdkContext;
    public static readonly RESOLVE_CACHE = "data/didCache";
    public static readonly USER_DIR = path.join(__dirname, '../../data/userDir');
    // private static LOG = new Logger("TestData");

    private context: AppContext;
    private clientConfig: any;
    private userDir: string | undefined;
    private userDid: UserDID;
    private callerDid: UserDID;
    private appInstanceDid: AppDID;
    private callerContext: AppContext;

    static async getInstance(testName: string, clientConfig: any, userDir?: string): Promise<SdkContext> {
        if (!SdkContext.INSTANCE) {
            SdkContext.INSTANCE = new SdkContext(clientConfig, userDir);
            await SdkContext.INSTANCE.init();
        }
        return SdkContext.INSTANCE;
    }

    constructor(clientConfig: any, userDir?: string) {
        this.clientConfig = clientConfig;
        this.userDir = userDir;
    }

    async init(): Promise<void> {

        //let userDirFile = new File(this.userDir);
        //userDirFile.delete();

        AppContext.setupResolver(this.clientConfig.resolverUrl, SdkContext.RESOLVE_CACHE);

        let applicationConfig = this.clientConfig.application;
        this.appInstanceDid = await AppDID.create(applicationConfig.name,
            applicationConfig.mnemonics2,
            applicationConfig.passPhrase,
            applicationConfig.storepass,
            applicationConfig.did);

        let userConfig = this.clientConfig.user;
        this.userDid = await UserDID.create(userConfig.name,
            userConfig.mnemonic,
            userConfig.passPhrase,
            userConfig.storepass,
            userConfig.did);

        // TestData.LOG.trace("UserDid created");
        let userConfigCaller = this.clientConfig.cross.user;
        this.callerDid = await UserDID.create(userConfigCaller.name,
            userConfigCaller.mnemonic,
            userConfigCaller.passPhrase,
            userConfigCaller.storepass,
            userConfigCaller.did);

        //Application Context
        let self = this;
        this.context = await AppContext.build({

            getLocalDataDir() : string {
                return self.getLocalStorePath();
            },


            async getAppInstanceDocument() : Promise<DIDDocument>  {
                try {
                    return await self.appInstanceDid.getDocument();
                } catch (e) {
                    // TestData.LOG.debug("TestData.getAppInstanceDocument Error {}", e);
                    // TestData.LOG.error(e.stack);
                }
                return null;
            },

            async getAuthorization(jwtToken : string) : Promise<string> {
                try {
                    let claims : Claims = (await new JWTParserBuilder().build().parse(jwtToken)).getBody();
                    if (claims == null)
                        throw new HiveException("Invalid jwt token as authorization.");

                    let presentation = await self.appInstanceDid.createPresentation(
                        await self.userDid.issueDiplomaFor(self.appInstanceDid),
                        claims.getIssuer(), claims.get("nonce") as string);

                    // TestData.LOG.debug("TestData->presentation: " + presentation.toString(true));
                    return await self.appInstanceDid.createToken(presentation,  claims.getIssuer());
                } catch (e) {
                    // TestData.LOG.info("TestData->getAuthorization error: " + e);
                    console.log("TestData->getAuthorization error: " + e + ', ' + e.stack);
                    // TestData.LOG.error(e.stack);
                }
            }
        }, self.userDid.getDid().toString());

        this.callerContext = await AppContext.build({
            //@Override
            getLocalDataDir(): string {
                return self.getLocalStorePath();
            },

            async getAppInstanceDocument() : Promise<DIDDocument>  {
                try {
                    return await self.appInstanceDid.getDocument();
                } catch (e) {
                    // TestData.LOG.error(e.stack);
                }
                return null;
            },

            async getAuthorization(jwtToken : string) : Promise<string>  {
                try {
                    let claims : Claims = (await new JWTParserBuilder().build().parse(jwtToken)).getBody();
                    if (claims == null)
                        throw new HiveException("Invalid jwt token as authorization.");
                    return await self.appInstanceDid.createToken(await self.appInstanceDid.createPresentation(
                        await self.userDid.issueDiplomaFor(self.appInstanceDid),
                        claims.getIssuer(), claims.get("nonce") as string), claims.getIssuer());
                } catch (e) {
                    throw new HiveException(e.getMessage(), e);
                }
            }
        }, this.callerDid.getDid().toString());
    }

    getAppContext(): AppContext {
        return this.context;
    }

    getProviderAddress(): string {
        return this.clientConfig.node.provider;
    }

    public getLocalStorePath(): string {
        // return this.userDir + File.SEPARATOR + "data/store" + File.SEPARATOR + this.clientConfig.node.storePath;
        return '';
    }
}
