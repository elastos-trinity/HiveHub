import React from "react"
// nodejs library that concatenates classes
import classNames from "classnames"
// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles"
// @material-ui/icons
// core components
import Snackbar from '@material-ui/core/Snackbar';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Header from "components/Header/Header.js"
import Footer from "components/Footer/Footer.js"
import Button from "components/CustomButtons/Button.js"
import GridContainer from "components/Grid/GridContainer.js"
import GridItem from "components/Grid/GridItem.js"
import HeaderLinks from "components/Header/HeaderLinks.js"
import Parallax from "components/Parallax/Parallax.js"
import CustomInput from "components/CustomInput/CustomInput.js"
import Badge from "components/Badge/Badge.js";

import styles from "assets/jss/material-kit-react/views/profilePage.js"
import InputAdornment from "@material-ui/core/InputAdornment"
import Icon from "@material-ui/core/Icon"
import {DIDBackend, DIDDocumentBuilder, DIDStore, Mnemonic, RootIdentity} from "did-js-sdk"
import MyDIDAdapter from "../../service/MyDIDAdapter"
import { useTranslation } from 'react-i18next'
import Brand from "../Brand"
import config from "../../config/config"

const useStyles = makeStyles(styles)

export default function DidRepairPage(props) {
    const classes = useStyles()
    const {...rest} = props
    let {t} = useTranslation()

    const [canCheck, setCanCheck] = React.useState(false)
    const [isChecking, setIsChecking] = React.useState(false)
    const [onFocusInput, setOnFocusInput] = React.useState(0)
    const [inputs, setInputs] = React.useState([])
    const [mnemonicPass, setMnemonicPass] = React.useState("")
    const [checkedDid, setCheckedDid] = React.useState([])
    const [isRepairing, setIsRepairing] = React.useState(false)
    const [needToRecover, setNeedToRecover] = React.useState(new Map())
    const [showTips, setShowTips] = React.useState({show: false, content: ""})
    const [openDetail, setOpenDetail] = React.useState("")

    React.useEffect(() => {
        DIDBackend.initialize(new MyDIDAdapter(config.network))
    })

    React.useEffect(() => {
        function checkAllInput() {
            for (let i = 0; i <= 11; i++) {
                if (!inputs[i] || inputs[i] === "") {
                    setCanCheck(false)
                    return
                }
            }
            setCanCheck(true)
        }
        checkAllInput()
    }, [inputs])

    function showTipsHandler(content) {
        setShowTips(() => ({show: true, content}))
        setTimeout(function () {
            setShowTips(() => ({show: false, content:""}));
        }, 5000)
    }

    function handleInput(event) {
        setCheckedDid(() => []);
        setNeedToRecover(() => new Map())

        let inputValue = event.target.value.trim()
        let id = parseInt(event.target.id)
        if (inputValue.includes(" ")) {
            let inputValues = inputValue.split( / +/)
            setInputs(inputValues);
            setOnFocusInput(13)
        } else {
            setInputs((inputs) => {
                let temp = [...inputs];
                temp[id] = inputValue;
                return temp;
            })
            setOnFocusInput(id)
        }
    }

    function handleCheck() {
        setOnFocusInput(100)
        setIsChecking(true);
        setCheckedDid(() => []);
        setNeedToRecover(() => new Map())

        let mnemonic = inputs.join(' ')
        if (!Mnemonic.checkIsValid(mnemonic)) {
            showTipsHandler("Invalid Mnemonic")
            setIsChecking(false);
            return
        }

        DIDStore.open("did_repair").then(async (didStore) => {
            let rootIdentity = RootIdentity.createFromMnemonic(mnemonic, mnemonicPass, didStore, "passwd", true)
            let index = 0;
            let checkedDidNum = 0;
            while (true) {
                try {
                    let result = await rootIdentity.synchronizeIndex(index);
                    if(result) {
                        let did = rootIdentity.getDid(index);
                        //check: (valid invalid)  repair: (unnecessary not success failed)
                        let doc = await DIDBackend.getInstance().resolveUntrustedDid(did, true);
                        console.log(doc);
                        (
                            (index, doc) => {
                                setCheckedDid(checkedDid => ([...checkedDid, {index, doc, check: "valid", repair: "unnecessary"}]));
                            }
                        )(index, doc)
                        checkedDidNum++
                    } else {
                        // setCheckedDid(checkedDid => ([...checkedDid]));
                        break;
                    }
                } catch (e) {
                    if(!e.message.endsWith("signature mismatch.")) {
                        showTipsHandler(e.message);
                        setIsChecking(false);
                        return;
                    }
                    let did = rootIdentity.getDid(index);
                    let doc = await DIDBackend.getInstance().resolveUntrustedDid(did, true);

                    (
                        index => {
                            setNeedToRecover(needToRecover => {
                                let a = new Map();
                                needToRecover.forEach(function (v,k) {
                                    a.set(k,v);
                                })
                                a.set(index, new Map());
                                return a;
                            })
                        }
                    )(index)


                    let docDetails = {};
                    if(doc.getPublicKeyCount() > 1) {

                        (
                            index => {
                                setNeedToRecover(needToRecover => {
                                    let a = new Map();
                                    needToRecover.forEach(function (v,k) {
                                        if(k === index) {
                                            v.set("pk", new Set())
                                        }
                                        a.set(k,v);
                                    })
                                    return a;
                                })
                            }
                        )(index)

                        docDetails.publicKeys = [...doc.getPublicKeys().filter(key => !key.getId().equals(doc.getDefaultPublicKeyId()))];
                    }
                    if(doc.getCredentialCount() > 0) {

                        (
                            index => {
                                setNeedToRecover(needToRecover => {
                                    let a = new Map();
                                    needToRecover.forEach(function (v,k) {
                                        if(k === index) {
                                            v.set("vc", new Set())
                                        }
                                        a.set(k,v);
                                    })
                                    return a;
                                })
                            }
                        )(index)

                        docDetails.credentials = [...doc.getCredentials().filter(crd => crd.isSelfProclaimed())];
                    }
                    if(doc.getServiceCount() > 0) {

                        (
                            index => {
                                setNeedToRecover(needToRecover => {
                                    let a = new Map();
                                    needToRecover.forEach(function (v,k) {
                                        if(k === index) {
                                            v.set("svc", new Set())
                                        }
                                        a.set(k,v);
                                    })
                                    return a;
                                })
                            }
                        )(index)

                        docDetails.services = [...doc.getServices()];
                    }

                    (
                        (index, doc) => {
                            setCheckedDid(checkedDid => ([...checkedDid, {index, doc, check: "invalid", repair: "not", docDetails}]));
                        }
                    )(index, doc)
                    checkedDidNum++
                }
                index++;
            }
            setIsChecking(false);
            if(checkedDidNum === 0) {
                showTipsHandler("You haven't published any DIDs!");
            }
        })
    }

    function handleRepair() {
        setIsRepairing(true);

        let mnemonic = inputs.join(' ')
        if (!Mnemonic.checkIsValid(mnemonic)) {
            showTipsHandler("Invalid Mnemonic")
            setIsChecking(false);
            return;
        }

        DIDStore.open("did_repair").then(async (didStore) => {
            let rootIdentity = RootIdentity.createFromMnemonic(mnemonic, mnemonicPass, didStore, "passwd", true)

            needToRecover.forEach((v,k) => {
                let recoveryDid = checkedDid.filter(value => value.index === k)[0];
                rootIdentity.newDid("passwd", k, true).then(didDocument => {
                    let havePk = v.get("pk") && v.get("pk").size > 0;
                    let haveVc = v.get("vc") && v.get("vc").size > 0;
                    let haveSvc = v.get("svc") && v.get("svc").size > 0;
                    if(havePk || haveVc || haveSvc) {
                        let db = DIDDocumentBuilder.newFromDocument(didDocument).edit();
                        let promises = [];
                        if(havePk) {
                            v.get("pk").forEach(index => {
                                let k = recoveryDid.docDetails.publicKeys[index];
                                db.createAndAddPublicKey(k.getId(), k.getController(), k.getPublicKeyBase58());
                                if(recoveryDid.doc.isAuthenticationKey(k.getId())) {
                                    db.addExistingAuthenticationKey(k.getId())
                                } else if(recoveryDid.doc.isAuthorizationKey(k.getId())) {
                                    db.addExistingAuthorizationKey(k.getId())
                                }
                            })
                        }
                        if(haveVc) {
                            v.get("vc").forEach(index => {
                                let c = recoveryDid.docDetails.credentials[index];
                                promises.push(db.createAndAddCredential("passwd", c.getId(), c.getSubject().getProperties(), c.getType()))
                            })
                        }
                        if(haveSvc) {
                            v.get("svc").forEach(index => {
                                let s = recoveryDid.docDetails.services[index];
                                db.addService(s.getId(), s.getType(), s.getServiceEndpoint(), s.getProperties());
                            })
                        }

                        Promise.all(promises).then(() => {
                            db.seal("passwd").then(newDoc => {
                                publishAndCheck(newDoc, recoveryDid);
                            })
                        })
                    } else {
                        publishAndCheck(didDocument, recoveryDid);
                    }
                })
            })
        })
    }

    function publishAndCheck(didDoc, recoveryDid) {
        didDoc.publishUntrusted(undefined, "passwd",  new MyDIDAdapter(config.network)).then(function () {
            let count = 0;
            let intervalId = setInterval(function () {
                count++;
                didDoc.getSubject().resolve(true).then(function (didDocument) {
                    if(didDocument) {
                        setCheckedDid( checkedDid => {
                            let others = checkedDid.filter(did => did.index !== recoveryDid.index)
                            return [...others, {index: recoveryDid.index, doc:recoveryDid.doc, check: "invalid", repair: "success"}];
                        });
                        clearInterval(intervalId);
                    } else {
                        if(count > 4) {
                            setCheckedDid( checkedDid => {
                                let others = checkedDid.filter(did => did.index !== recoveryDid.index)
                                return [...others, {index: recoveryDid.index, doc:recoveryDid.doc, check: "invalid", repair: "failed"}];
                            });
                            clearInterval(intervalId);
                        }
                    }
                }).catch(console.log)
            }, 2000)
        });
    }

    function handCheckBox(checked, did, type, index) {
        setNeedToRecover(needToRecover => {
            let a = new Map();
            needToRecover.forEach(function (v,k) {
                if(k === did) {
                    if(checked) {
                        v.set(type, v.get(type).add(index));
                    } else {
                        v.get(type).delete(index);
                        v.set(type,  v.get(type));
                    }
                }
                a.set(k,v);
            })
            return a;
        })
    }

    function MnemonicInput(props) {
        const {inputProps, id, ...rest} = props
        let target = {
            onChange: (e) => {
                handleInput(e)
            },
            defaultValue: inputs[id],
            placeholder: "word " + id,
            autoFocus: onFocusInput === parseInt(id),
            autoComplete: "off",
        }
        let myInputProps = Object.assign(target, inputProps)
        return <CustomInput id={id + ""} inputProps={myInputProps} formControlProps={{fullWidth: true}} {...rest} />
    }

    function CheckedDid(props) {
        let check = props.check === "valid" ? "success" : "rose";
        let repair = props.repair === "success" ? "success" : "rose";
        let publicKeys = props.docDetails ? props.docDetails.publicKeys : null;
        let credentials = props.docDetails ? props.docDetails.credentials : null;
        let services = props.docDetails ? props.docDetails.services : null;
        return (
            <div className={classes.checkedDid}>
                <div className={classes.didTitle}>
                    {props.doc.getSubject().getMethodSpecificId()} <Badge color={check}>{props.check}</Badge>
                    {
                        props.repair === "unnecessary" ?
                            "" : props.repair === "not" ?
                            <Badge color="warning">not repair</Badge> : <Badge color={repair}>repair {props.repair}</Badge>
                    }
                </div>
                {
                    publicKeys && publicKeys.map((pk,index) =>
                        <PkDetail  key={index + "" + props.index} pk={pk} index={index} didIndex={props.index} />
                    )
                }
                {
                    credentials && credentials.map((vc,index) =>
                        <VcDetail key={index + "" + props.index} vc={vc} index={index} didIndex={props.index} />
                    )
                }
                {
                    services && services.map((svc,index) =>
                        <SvcDetail key={index + "" + props.index} svc={svc} index={index} didIndex={props.index} />
                    )
                }
            </div>
        )
    }

    function PkDetail(props) {
        let openKey = `${props.didIndex}-pk-${props.index}`;
        return (
            <div className={classes.didItem}>
                <div className={classes.didHeader}>
                     <FormControlLabel
                        aria-label="Acknowledge"
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        control={<Checkbox />}
                        checked={needToRecover.get(props.didIndex).get("pk").has(props.index)}
                        onChange={e => handCheckBox(e.target.checked, props.didIndex, "pk", props.index)}
                        label={""}
                    />
                    <span title="PublicKey" className={classes.didIcon}><i className="fa fa-key fa-lg" aria-hidden="true" /></span>
                    <span>{props.pk.getId().toString()}</span>
                    <span onClick={e => {openDetail === openKey ? setOpenDetail("") : setOpenDetail(openKey)}} className={classes.dot}>
                        <i className="fa fa-ellipsis-h" aria-hidden="true" />
                    </span>
                </div>
                <div className={classes.didDetail} hidden={openDetail !== openKey}>
                    <pre>{props.pk.getId().toString()}</pre>
                    <pre>{props.pk.getPublicKeyBase58()}</pre>
                </div>
            </div>
        )
    }

    function VcDetail(props) {
        let openKey = `${props.didIndex}-vc-${props.index}`;
        return (
            <div className={classes.didItem}>
                <div className={classes.didHeader}>
                    <FormControlLabel
                        aria-label="Acknowledge"
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        control={<Checkbox />}
                        checked={needToRecover.get(props.didIndex).get("vc").has(props.index)}
                        onChange={e => handCheckBox(e.target.checked, props.didIndex, "vc", props.index)}
                        label={""}
                    />
                    <span title="VerifiableCredential" className={classes.didIcon}><i className="fa fa-id-card fa-lg" aria-hidden="true" /></span>
                    <span>{props.vc.getId().toString()}</span>
                    <span onClick={e => {openDetail === openKey ? setOpenDetail("") : setOpenDetail(openKey)}} className={classes.dot}>
                        <i className="fa fa-ellipsis-h" aria-hidden="true" />
                    </span>
                </div>
                <div className={classes.didDetail} hidden={openDetail !== openKey}>
                    <pre>{JSON.stringify(JSON.parse(props.vc.toString(true)),null,2)}</pre>
                </div>
            </div>
        )
    }

    function SvcDetail(props) {
        let openKey = `${props.didIndex}-svc-${props.index}`;
        return (
            <div className={classes.didItem}>
                <div className={classes.didHeader}>
                    <FormControlLabel
                        aria-label="Acknowledge"
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        control={<Checkbox />}
                        checked={needToRecover.get(props.didIndex).get("svc").has(props.index)}
                        onChange={e => handCheckBox(e.target.checked, props.didIndex, "svc", props.index)}
                        label={""}
                    />
                    <span title="Service" className={classes.didIcon}><i className="fa fa-globe fa-lg" aria-hidden="true" /></span>
                    <span>{props.svc.getId().toString()}</span>
                    <span onClick={e => {openDetail === openKey ? setOpenDetail("") : setOpenDetail(openKey)}} className={classes.dot}>
                        <i className="fa fa-ellipsis-h" aria-hidden="true" />
                    </span>
                </div>
                <div className={classes.didDetail} hidden={openDetail !== openKey}>
                    <pre>{props.svc.getId().toString()}</pre>
                    <pre>{props.svc.getType()}</pre>
                    <pre>{props.svc.getServiceEndpoint()}</pre>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Header
                color="transparent"
                brand={<Brand />}
                rightLinks={<HeaderLinks/>}
                fixed
                changeColorOnScroll={{
                    height: 100,
                    color: "white"
                }}
                {...rest}
            />
            <Parallax small filter className={classes.parallaxHeight}/>
            <div className={classNames(classes.main, classes.mainRaised)}>
                <div>
                    <div className={classes.container}>
                        <GridContainer justifyContent="center">
                            <GridItem xs={12} sm={12} md={6}>
                                <div className={classes.profile}>
                                    <div className={classes.name} style={{"marginTop": "50px"}}>
                                        <h2 className={classes.title}>{t('did-repair')}</h2>
                                    </div>
                                </div>
                            </GridItem>
                        </GridContainer>
                        <div className={classes.description}>
                            <p>{t('repair-tips')}</p>
                        </div>
                        <h4 className={classes.title} style={{"marginTop": "80px"}}>{t('mnemonic')}:</h4>
                        <GridContainer justifyContent="flex-start">

                            {
                                [0,1,2,3,4,5,6,7,8,9,10,11].map(value => (
                                    <GridItem xs={4} sm={3} md={3} lg={2} key={value}>
                                        <MnemonicInput id={value} inputProps={{}}/>
                                    </GridItem>
                                ))
                            }

                        </GridContainer>
                        <h4 className={classes.title} style={{"marginTop": "40px"}}>{t('passphrase')}:</h4>
                        <GridContainer justifyContent="flex-start">
                            <GridItem xs={6} sm={4} md={4} lg={4}>
                                <CustomInput labelText="Passphrase" id="pass"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{type: "password",
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Icon className={classes.inputIconsColor}>
                                                    lock_outline
                                                </Icon>
                                            </InputAdornment>
                                        ),
                                        autoComplete: "off",
                                        autoFocus: onFocusInput === 13,
                                        defaultValue: mnemonicPass,
                                        onChange: (e) => {
                                            setOnFocusInput(13)
                                            setMnemonicPass(e.target.value)
                                        }
                                    }}
                                />
                            </GridItem>
                        </GridContainer>

                        <GridContainer justifyContent="center">
                            <GridItem xs={12} sm={12} md={12} lg={12} style={{"textAlign": "center", "margin": "10px 30px 40px"}}>
                                <Button color="success" onClick={handleCheck} disabled={!(canCheck && !isChecking)} style={{"width":"177px"}}>{t('check')}</Button>
                            </GridItem>
                        </GridContainer>

                        <div style={{"minHeight": "400px"}}>
                            <div className={classes.typo}>
                                {checkedDid.length > 0 && checkedDid.map((item, index) => <CheckedDid key={index} {...item} />)}
                            </div>

                            {(needToRecover.size > 0) && (
                                <GridContainer justifyContent="center">
                                    <GridItem xs={12} sm={12} md={12} lg={12}
                                              style={{"textAlign": "center", "margin": "10px 30px 40px"}}>
                                        <Button color="success" onClick={handleRepair} disabled={isRepairing} style={{"width":"177px"}}>{t('recovery')}</Button>
                                    </GridItem>
                                </GridContainer>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
            <Snackbar anchorOrigin={{ "vertical":"bottom", "horizontal":"left" }}
                      key={{"vertical":"bottom", "horizontal":"left"}}
                      open={showTips.show}
                      message={showTips.content}
                      autoHideDuration={5000}
            />
        </div>
    )
}
