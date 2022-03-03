import React, {useEffect, useState, useCallback} from "react";
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
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import styles from "assets/jss/material-kit-react/views/components.js";
import { useTranslation } from 'react-i18next'
import Badge from "../../components/Badge/Badge";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./TabPanel";
import {List, ListItem} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import HiveHubServer from "../../service/hivehub";
import Vault, {VaultDetail} from "../../hivejs/vault";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import SdkContext from "../../hivejs/testdata";
import {useConnectivitySDK} from "../../service/connectivity";

const customStyle = theme => ({
  ...styles,
  nodeName: {
    color: "#333333",
    fontSize: "22px",
    fontWeight: "500",
    margin: "40px 0 10px"
  },

  nodeTime: {
    fontSize: "14px"
  },

  nodeParam: {
    fontWeight: "400",
    margin: "35px 0",
    color: "#333333",
  },

  paramKey: {
    color: "#999999"
  },

  paramGrid: {
    margin: "5px 0"
  },

  nodeDesc: {
    fontSize: "18px",
    lineHeight: "1.5em"
  },

  serviceBox: {
    margin: "60px 0",

    "& .MuiTab-root": {
      textTransform: "none"
    }
  },

  serviceBox_offline: {
    margin: "60px 0 0 0",

    "& .MuiTab-root": {
      textTransform: "none"
    }
  },

  vaultBox: {
    width: "100%",
    padding: "10px 20px",
    borderRadius: "10px"
  },

  data: {
    fontWeight: "500"
  },

  dataDesc: {
    fontSize: "14px"
  },

  bottomBox: {
    width: "100%",
    height: "70px",
    lineHeight: "70px",
    position: "fixed",
    bottom: "0",
    zIndex: "1100",
    textAlign: "center",
    backgroundColor: "white",
    boxShadow: "0px 8px 30px 0px rgba(100, 100, 100, 0.3)",
  }


})

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 30,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    // borderRadius: 5,
    backgroundColor: '#5297FF',
  },
}))(LinearProgress);

const useStyles = makeStyles(customStyle);

export default function NodeDetails(props) {
  let {t} = useTranslation()
  const classes = useStyles();
  const { ...rest } = props;

  const preventDefault = (event) => event.preventDefault();

  // use state.
  let [state, setState] = useState({
    tabValue: 0,
    open: false,
    openVault: false,
    node: {},
    online: false,
    isOwner: false,
    vaults: [],
    backups: [],
    // needCreate: false
  });
  let setOpen = (v) => setState({...state, open: v})
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleTabChange = (event, newValue) => {
    setState({...state, tabValue: newValue});
  };

  const [needCreate, setNeedCreate] = useState(true);

  useConnectivitySDK();

  // init the page's data.
  useEffect(async () => {
    let nodes = await HiveHubServer.getHiveNodes(props.match.params.nid);
    let online = false;
    let node = nodes[0];
    let vaults = [];
    let backups = [];
    if (!node) return;
    online = await HiveHubServer.isOnline(node.url);
    if (!online) {
      setState({...state, node: nodes[0]});
    } else {
      let vault = new Vault();
      const isOwner = SdkContext.getLoginUserDid() === node.owner_did || node._id === 'jlaksjdflkjasdlkfj001';
      if (isOwner) {
        vaults = await vault.getVaults(node.url);
        backups = await vault.getBackups(state.node.url);
      }
      setState({...state, node: nodes[0], online: online, isOwner: isOwner, vaults: vaults, backups: backups});

      try {
        let detail = await vault.getVaultDetail(node.url);
        console.log('success vault.getVaultDetail()');
        setNeedCreate(false);
      } catch (e) {
        console.error('failed vault.getVaultDetail()');
        setNeedCreate(true);
      }
    }
  }, []);

  // create&destroy the vault service.
  let onCreate = async () => {
    await (new Vault()).createVault(state.node.url);
    setNeedCreate(false);
  };
  let onDestroy = async () => {
    await (new Vault()).destroyVault(state.node.url);
    setNeedCreate(true);
  };

  let handleOpenVault = async () => {
    setState({...state, openVault: true});
    // await onCreate();
  }

  let handleCloseVault = async (value) => {
    console.log(`handleCloseVault: ${value}`);
    if (value) {
      needCreate ? await onCreate() : await onDestroy();
      setNeedCreate(!needCreate);
    }
    setState({...state, openVault: false});
  }

  return (
    <div>
      <Header
        brand={<Brand />}
        rightLinks={<HeaderLinks openLogin={handleClickOpen} />}
        fixed
        color="white"
        {...rest}
      />

      <div className={classNames(classes.main)} style={{paddingTop: "75px"}}>
        <div className={classes.container}>

          <Box component="div" className={classes.nodeName}>{state.node.name} <Badge color={state.online ? "success" : "gray"}>{state.online ? "在线" : "离线"}</Badge>
          </Box>

          <Box component="div" className={classes.nodeTime}>{state.node.created}</Box>

          <Box component="div" className={classes.nodeParam}>
            <Grid container>
              <Grid item xs={12} sm={6} className={classes.paramGrid}>
                <Box component="span" className={classes.paramKey}>地址:</Box> {state.node.ip}
              </Grid>
              <Grid item xs={12} sm={6} className={classes.paramGrid}>
                <Box component="span" className={classes.paramKey}>发起人DID：</Box> {state.node.owner_did}
              </Grid>
              <Grid item xs={12} sm={6} className={classes.paramGrid}>
                <Box component="span" className={classes.paramKey}>国家/地区：</Box> {state.node.area}
              </Grid>
              <Grid item xs={12} sm={6} className={classes.paramGrid}>
                <Box component="span" className={classes.paramKey}>邮箱：</Box> {state.node.email}
              </Grid>
              <Grid item xs={12} sm={6} className={classes.paramGrid}>
                <Box component="span" className={classes.paramKey}>URL地址：</Box> {state.node.url}
              </Grid>
            </Grid>
          </Box>

          <Box component="div" className={classes.nodeDesc}>{state.node.remark}</Box>

          {state.isOwner &&
          <Box component="div" className={state.online ? classes.serviceBox : classes.serviceBox_offline}>
            <Tabs
                value={state.tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="#00164E"
                aria-label="disabled tabs example"
                variant="fullWidth"
            >
              <Tab label={t('vault-service')} />
              <Tab label={t('backup-service')} />
            </Tabs>
            <TabPanel value={state.tabValue} index={0}>
              <Box component="div" style={{padding: "0", minHeight: "800px"}}>
                <List>
                  {state.vaults.map((vault, index) =>
                      <ListItem key={vault.userDid} style={{padding: "10px 0"}}>
                        <Box component="div" className={classes.vaultBox}>
                          <Box component="div" className={classes.nodeName} style={{marginTop: "20px"}}>Vault Service-{index}（{vault.pricingPlan}）</Box>
                          <Box component="div" className={classes.nodeParam} style={{margin: "10px 0 15px"}}>{vault.used} MB / {vault.quota} MB</Box>
                          <BorderLinearProgress variant="determinate" value={vault.used/vault.quota*100} />
                        </Box>
                      </ListItem>)}
                </List>
              </Box>
            </TabPanel>
            <TabPanel value={state.tabValue} index={1}>
              <Box component="div" style={{padding: "0", minHeight: "800px"}}>
                <List>
                  {state.backups.map((backup, index) =>
                      <ListItem key={backup.userDid} style={{padding: "10px 0"}}>
                        <Box component="div" className={classes.vaultBox}>
                          <Box component="div" className={classes.nodeName} style={{marginTop: "20px"}}>Backup Service-{index}（{backup.pricingPlan}）</Box>
                          <Box component="div" className={classes.nodeParam} style={{margin: "10px 0 15px"}}>{backup.used} MB / {backup.quota} MB</Box>
                          <BorderLinearProgress variant="determinate" value={backup.used/backup.quota*100} />
                        </Box>
                      </ListItem>)}
                </List>
              </Box>
            </TabPanel>
          </Box>
          }
        </div>
      </div>

      {state.online &&
        <Box component="div" className={classes.bottomBox}>
          <Button variant="contained" color="default"
                  style={{backgroundColor: "#5297FF", color: "white", width: "200px"}}
                  onClick={handleOpenVault}>
            {needCreate ? t('create-vault') : t('destroy-vault')}
          </Button>
        </Box>
      }

      <Dialog
          open={state.openVault}
          onClose={() => handleCloseVault(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Yes or No ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseVault(false)}>No</Button>
          <Button onClick={() => handleCloseVault(true)} autoFocus>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
