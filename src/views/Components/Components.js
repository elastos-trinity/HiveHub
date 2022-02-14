import React, {useContext, useEffect, useState} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
// sections for this page
import Brand from "views/Brand"
import HeaderLinks from "components/Header/HeaderLinks.js";
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import styles from "assets/jss/material-kit-react/views/components.js";
import { useTranslation } from 'react-i18next'
import Badge from "../../components/Badge/Badge";
import Vault from "../../hivejs/vault.ts";
import UserContext from '../../contexts/UserContext';
import { essentialsConnector, useConnectivitySDK } from "../../service/connectivity";
import ConnectivityContext from '../../contexts/ConnectivityContext';
import { DID } from "@elastosfoundation/elastos-connectivity-sdk-js";
import HiveHubServer from "../../service/hivehub.ts";

const customStyle = theme => ({
  ...styles,
  landingImg: {
    height: "40vh",
    backgroundImage: "url(https://trinity-website-1256757303.cos.ap-shanghai.myqcloud.com/hive-hub/banner.png)",
    [theme.breakpoints.down('sm')]: {
      height: "60vh",
    }
  },
  title: {
    fontSize: "2rem",
    fontWeight: "500",
    lineHeight: "50px",
    [theme.breakpoints.down('sm')]: {
      textAlign: "center",
    }
  },

  subtitle: {
    fontSize: "1.313rem",
    margin: "10px 0 20px",
    [theme.breakpoints.down('sm')]: {
      textAlign: "center",
    }
  },

  navButton: {
    height: "66px",
    width:"80%",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "33px",
    border: "none",
    boxShadow: "0px 8px 30px 0px rgba(50, 109, 255, 0.3)",
    position: "relative",
    top: "-33px",
  },

  root: {
    width: "100%",
    height: "66px",
    color: "#00164E",
    fontWeight: "400",
    fontSize: "20px",
    lineHeight: "66px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "space-around",
    '& > * + *': {marginLeft: theme.spacing(2),},
    '& a': {'&:hover': {color: "#316BFF"}}
  },

  nodeGrid: {
    borderBottom: "1px solid #cccccc",
    paddingTop: "30px",
    color: "#999999",
  },

  nodeName: {
    color: "#333333",
    fontSize: "22px",
    fontWeight: "600"
  },

  nodeTime: {
    fontSize: "14px"
  },

  nodeParam: {
    fontWeight: "500",
    marginRight: "40px",
    color: "#333333",
  },

  loading: {
    textAlign: "center",
    paddingBottom: "180px",
    color: "#5297FF"
  }
})

const useStyles = makeStyles(customStyle);

export default function Components(props) {
  let {t} = useTranslation()
  const classes = useStyles();
  const { ...rest } = props;

  // use state.
  // let [loading, setLoading] = useState(false);
  let [state, setState] = useState({loading: false, nodes: []});
  let loading = state.loading;
  let setLoading = (v) => setState({...state, loading: v});
  const preventDefault = (event) => event.preventDefault();
  const helloSdk = async (event) => await new Vault().hello();

  const { user, signOut, setUser } = useContext(UserContext);

  useConnectivitySDK();

  const login = async () => {
    setLoading(true);
    const didAccess = new DID.DIDAccess();
    let presentation;

    console.log("Trying to sign in using the connectivity SDK");
    try {
      presentation = await didAccess.requestCredentials({
        claims: [
          DID.simpleIdClaim("Your name", "name", false)
        ]
      });
    } catch (e) {
      // Possible exception while using wallet connect (i.e. not an identity wallet)
      // Kill the wallet connect session
      console.warn("Error while getting credentials", e);

      try {
        await essentialsConnector.getWalletConnectProvider().disconnect();
      } catch (e) {
        console.error("Error while trying to disconnect wallet connect session", e);
      }
      setLoading(false);
      return;
    }

    if (presentation) {
      const did = presentation.getHolder().getMethodSpecificId();
      localStorage.setItem("did", did);
      setUser(did)
      setLoading(false);
      console.log(did);
    }

    setLoading(false);
  }

  // init the page's data.
  useEffect(async () => {
    let data = await HiveHubServer.getHiveNodes();
    if (!data || !data.nodes) {
      return;
    }
    for (const node of data.nodes) {
      node.online = await HiveHubServer.isOnline(node.url);
    }
    setState({...state, nodes: data.nodes});
  }, []);

  return (
    <div>
      <Header
        brand={<Brand />}
        rightLinks={<HeaderLinks openLogin={login} showSearch={true} loading={loading} {...rest} />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 100,
          color: "white"
        }}
        {...rest}
      />
      <Parallax className={classes.landingImg}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6} style={{padding:"60px 0"}}>
              <div className={classes.brand}>
                <h4 className={classes.title} style={{fontSize: "2.8rem", fontWeight: "500"}}>{t('title')}</h4>
                <h3 className={classes.subtitle}>{t('subtitle')}</h3>
              </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={6} style={{textAlign:"center", lineHeight:"500px"}}>
              <img src="https://trinity-website-1256757303.cos.ap-shanghai.myqcloud.com/hive-hub/img%402x.png" alt="" style={{width:"440px"}} />
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div className={classNames(classes.main)}>
        <div className={classes.container}>
          <div className={classes.navButton}>
            <Typography className={classes.root}>
              <Link href="#" onClick={preventDefault} underline="none" color="inherit">
                {t('starter')}
              </Link>
              <Link href="#" onClick={preventDefault} underline="none" color="inherit">
                {t('functions')}
              </Link>
              <Link href="#" onClick={helloSdk} underline="none" color="inherit">
                SDK
              </Link>
              <Link href="#" onClick={preventDefault} underline="none" color="inherit">
                Hive Node
              </Link>
            </Typography>
          </div>

          <GridContainer style={{padding:"40px 0"}}>

            <GridItem xs={12} sm={12} md={12} id="square">
              <div className={classes.product}>{t('node-list')}</div>
              <div className={classes.line} />
            </GridItem>

            {state.nodes.map((node, index) =>
              <GridItem xs={12} sm={12} md={12} className={classes.nodeGrid} key={node.nid}>
                <Grid container justifyContent="space-between" style={{marginBottom: "15px"}}>
                  <Link href={`/node/${node.nid}`} underline="none">
                    <Box component="span" className={classes.nodeName}>{node.name} <Badge color={node.online ? "success" : "gray"}>{node.online ? "在线" : "离线"}</Badge></Box>
                  </Link>
                  <Box component="span" className={classes.nodeTime}>{node.created}</Box>
                </Grid>

                <Box component="div">{node.remark}</Box>

                <Grid container justifyContent="flex-start" style={{margin: "25px 0"}}>
                  地址：<Box component="span" className={classes.nodeParam}>{node.ip}</Box>
                  发起人DID：<Box component="span" className={classes.nodeParam}>{node.owner_did}</Box>
                </Grid>
              </GridItem>)}
          </GridContainer>
        </div>
        {/*<Box component="div" className={classes.loading}>{t('loading')}</Box>*/}
      </div>
      <Footer whiteFont={true} />
    </div>
  );
}
