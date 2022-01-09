import React, {useEffect, useState} from "react";
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
  // const [open, setOpen] = React.useState(false);
  let [state, setState] = useState({open: false, node: {}, online: false});
  let open = state.open;
  let setOpen = (value) => setState({open: value})
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (value) => {
    setOpen(false);
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // init the page's data.
  useEffect(async() => {
    let data = await HiveHubServer.getHiveNodes(props.match.params.nid);
    let online = false;
    if (data.nodes[0]) {
      online = await HiveHubServer.isOnline(data.nodes[0].url);
    }
    setState({node: data.nodes[0], online: online});
  }, []);

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

          <Box component="div" className={classes.serviceBox}>
            <Tabs
                value={value}
                indicatorColor="primary"
                textColor="#00164E"
                onChange={handleChange}
                aria-label="disabled tabs example"
                variant="fullWidth"
            >
              <Tab label={t('vault-service')} />
              <Tab label={t('backup-service')} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <Box component="div" style={{padding: "0", minHeight: "800px"}}>
                <List>
                  <ListItem style={{padding: "10px 0"}}>
                    <Box component="div" className={classes.vaultBox} style={{border: "1px solid #5297FF"}}>
                      <Box component="div" className={classes.nodeName} style={{marginTop: "20px"}}>Vault Service-01</Box>
                      <Box component="div" className={classes.nodeParam} style={{margin: "10px 0 15px"}}>10.2 GB 可用（共30GB）</Box>
                      <BorderLinearProgress variant="determinate" value={70} />
                      <Grid container alignItems="center" justifyContent="space-around" style={{margin: "20px 0 10px", textAlign: "center"}}>
                        <Grid item xs={3}>
                          <Box component="div" className={classes.data}>1200</Box>
                          <Box component="div" className={classes.dataDesc}>统计数据1</Box>
                        </Grid>
                        <Divider orientation="vertical" flexItem />
                        <Grid item xs={3}>
                          <Box component="div" className={classes.data}>1200</Box>
                          <Box component="div" className={classes.dataDesc}>统计数据1</Box>
                        </Grid>
                        <Divider orientation="vertical" flexItem />
                        <Grid item xs={3}>
                          <Box component="div" className={classes.data}>1200</Box>
                          <Box component="div" className={classes.dataDesc}>统计数据1</Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </ListItem>
                  <ListItem style={{padding: "10px 0"}}>
                    <Box component="div" className={classes.vaultBox}>
                      <Box component="div" className={classes.nodeName} style={{marginTop: "20px"}}>Vault Service-02</Box>
                      <Box component="div" className={classes.nodeParam} style={{margin: "10px 0 15px"}}>9 GB 可用（共30GB）</Box>
                      <BorderLinearProgress variant="determinate" value={30} />
                    </Box>
                  </ListItem>
                  <ListItem style={{padding: "10px 0"}}>
                    <Box component="div" className={classes.vaultBox}>
                      <Box component="div" className={classes.nodeName} style={{marginTop: "20px"}}>Vault Service-03</Box>
                      <Box component="div" className={classes.nodeParam} style={{margin: "10px 0 15px"}}>3 GB 可用（共30GB）</Box>
                      <BorderLinearProgress variant="determinate" value={10} />
                    </Box>
                  </ListItem>
                </List>
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Box component="div" style={{padding: "0", minHeight: "800px", backgroundColor: "#F5F5F5"}}>

              </Box>
            </TabPanel>
          </Box>
        </div>
      </div>

      <Box component="div" className={classes.bottomBox}>
        <Button variant="contained" color="default" style={{backgroundColor: "#5297FF", color: "white", width: "200px"}}>
          {t('create-vault')}
        </Button>
      </Box>
    </div>
  );
}
