import React from "react";
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
import SearchIcon from "@material-ui/icons/Search";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./TabPanel";
import {List, ListItem} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

const customStyle = theme => ({
  ...styles,
  searchBox: {
    width: "100%",
    height: "100px",
    paddingTop: "30px",
    marginTop: "70px"
  },

  resultBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: "10px",
    height: "800px",
  },

  searchResult: {
    fontWeight: "600",
    marginBottom: "10px"
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

  const [open, setOpen] = React.useState(false);
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

          <Box component="div" className={classes.nodeName}>Hive Node 节点名称 <Badge color="success">在线</Badge></Box>

          <Box component="div" className={classes.nodeTime}>2021-11-09 21:00:32</Box>

          <Box component="div" className={classes.nodeParam}>
            <Grid container>
              <Grid item xs={12} sm={6} className={classes.paramGrid}>
                <Box component="span" className={classes.paramKey}>地址:</Box> 192.115.24.2.0380
              </Grid>
              <Grid item xs={12} sm={6} className={classes.paramGrid}>
                <Box component="span" className={classes.paramKey}>发起人DID：</Box> srgsve5h5yvnwi5yh4hyg2945hvwq0tq
              </Grid>
              <Grid item xs={12} sm={6} className={classes.paramGrid}>
                <Box component="span" className={classes.paramKey}>国家/地区：</Box> 加拿大 安大略省 多伦多市
              </Grid>
              <Grid item xs={12} sm={6} className={classes.paramGrid}>
                <Box component="span" className={classes.paramKey}>邮箱：</Box> 1234456789 @gamil.com
              </Grid>
              <Grid item xs={12} sm={6} className={classes.paramGrid}>
                <Box component="span" className={classes.paramKey}>URL地址：</Box> http://hivenode.com
              </Grid>
            </Grid>
          </Box>

          <Box component="div" className={classes.nodeDesc}>
            简介：区块链是一个信息技术领域的术语。从本质上讲，它是一个共享数据库，存储于其中的数据或信息，具有“不可伪造”“全程留痕”“可以追溯”“公开透明”“集体维护”等特征。基于这些特征，区块链技术奠定了坚实的“信任”基础，创造了可靠的“合作”机制，具有广阔的运用前景。
          </Box>

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
