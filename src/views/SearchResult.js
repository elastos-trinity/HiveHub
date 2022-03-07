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
import Badge from "../components/Badge/Badge";
import SearchIcon from "@material-ui/icons/Search";

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

  item: {
    display: "inline-block",
    width: "100%",
    height: "40px",
    lineHeight: "40px",
    borderRadius: "20px",
    border: "0px",
    background: "rgba(0, 0, 0, 0.05)",
    padding: "0 10px"
  },

  icon: {
    marginTop: "2px",
    height: "40px",
  },

  searchInput: {
    width: "60%",
    height: "30px",
    lineHeight: "30px",
    background: "rgba(0, 0, 0, 0)",
    border: "none",
    position: "absolute",
    top: "36px",
    color: "black",
    fontSize: "18px",

    "&::placeholder": {
      color: "rgba(0, 0, 0, 0.3)"
    }
  }
})

const useStyles = makeStyles(customStyle);

export default function SearchResult(props) {
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

  return (
    <div>
      <Header
        brand={<Brand />}
        rightLinks={<HeaderLinks openLogin={handleClickOpen} />}
        fixed
        color="white"
        // changeColorOnScroll={{
        //   height: 100,
        //   color: "white"
        // }}
        {...rest}
      />

      <div className={classNames(classes.main)} style={{paddingBottom: "200px"}}>
        <div className={classes.container}>

          <Box component="div" className={classes.searchBox}>
            <span className={classes.item} id="searchContainer">
              <SearchIcon className={classes.icon}/>
              <input type="text" id="search" className={classes.searchInput} placeholder={t("search-placeholder")}/>
            </span>
          </Box>

          <Box component="div" className={classes.searchResult}>
            {t("search-result")}
          </Box>

          <Box component="div" className={classes.resultBox}>
            <GridContainer style={{padding:"20px 0", width: "94%", margin: "0 auto"}}>
              <GridItem xs={12} sm={12} md={12} className={classes.nodeGrid}>
                <Grid container xs={12} sm={12} md={12} justifyContent="space-between" style={{marginBottom: "15px"}}>
                  <Box component="span" className={classes.nodeName}>HiveNode 节点名称 <Badge color="success">在线</Badge></Box>
                  <Box component="span" className={classes.nodeTime}>2021-11-09 21:00:32</Box>
                </Grid>

                <Box component="div">提供安全可靠、稳定可信、可持续创新的去中心化数据存储方案，赋能应用、使能数据、做数字世界的“私权捍卫者”</Box>

                <Grid container xs={12} sm={12} md={12} justifyContent="flex-start" style={{margin: "25px 0"}}>
                  地址：<Box component="span" className={classes.nodeParam}>192.115.24.2.0380</Box>
                  发起人DID：<Box component="span" className={classes.nodeParam}>srgsve5h5yvnwi5yh4hyg2945hvwq0tq</Box>
                </Grid>
              </GridItem>

              <GridItem xs={12} sm={12} md={12} className={classes.nodeGrid}>
                <Grid container xs={12} sm={12} md={12} justifyContent="space-between" style={{marginBottom: "15px"}}>
                  <Box component="span" className={classes.nodeName}>HiveNode 节点名称 <Badge color="success">在线</Badge></Box>
                  <Box component="span" className={classes.nodeTime}>2021-11-09 21:00:32</Box>
                </Grid>

                <Box component="div">提供安全可靠、稳定可信、可持续创新的去中心化数据存储方案，赋能应用、使能数据、做数字世界的“私权捍卫者”</Box>

                <Grid container xs={12} sm={12} md={12} justifyContent="flex-start" style={{margin: "25px 0"}}>
                  地址：<Box component="span" className={classes.nodeParam}>192.115.24.2.0380</Box>
                  发起人DID：<Box component="span" className={classes.nodeParam}>srgsve5h5yvnwi5yh4hyg2945hvwq0tq</Box>
                </Grid>
              </GridItem>

              <GridItem xs={12} sm={12} md={12} className={classes.nodeGrid}>
                <Grid container xs={12} sm={12} md={12} justifyContent="space-between" style={{marginBottom: "15px"}}>
                  <Box component="span" className={classes.nodeName}>HiveNode 节点名称 <Badge color="gray">{t('offline')}</Badge></Box>
                  <Box component="span" className={classes.nodeTime}>2021-11-09 21:00:32</Box>
                </Grid>

                <Box component="div">提供安全可靠、稳定可信、可持续创新的去中心化数据存储方案，赋能应用、使能数据、做数字世界的“私权捍卫者”</Box>

                <Grid container xs={12} sm={12} md={12} justifyContent="flex-start" style={{margin: "25px 0"}}>
                  地址：<Box component="span" className={classes.nodeParam}>192.115.24.2.0380</Box>
                  发起人DID：<Box component="span" className={classes.nodeParam}>srgsve5h5yvnwi5yh4hyg2945hvwq0tq</Box>
                </Grid>
              </GridItem>

            </GridContainer>
          </Box>
        </div>
      </div>
    </div>
  );
}
