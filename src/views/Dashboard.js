import React, { useContext } from "react";
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

import styles from "assets/jss/material-kit-react/views/components.js";
import { useTranslation } from 'react-i18next'
import {Route, Switch, useRouteMatch, useHistory} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import LeftNav from "./LeftNav";
import Box from "@material-ui/core/Box";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Statistic from "./Statistic";
import UserContext from "../contexts/UserContext";
import {essentialsConnector} from "../service/connectivity";
import ConnectivityContext from "../contexts/ConnectivityContext";


const customStyle = theme => ({
    ...styles,
    contentBox: {
        padding: "20px 20px 15px 0",
    },

    loginBox: {
        width: "100%",
        height: "50px",
        lineHeight: "50px",
        backgroundColor: "white",
        borderRadius: "5px",
        fontWeight: "500",
        marginBottom: "20px"
    },

    login: {
        width: "140px",
        backgroundColor: "#316BFF",
        color: "white",
        padding: "0 15px",
        borderRadius: "5px",
    },

    didBox: {
        textAlign: "right",
        padding: "0 15px",

    },

    did: {
        display: "inline-block",
        marginRight: "20px",
        color: "#333333",
    },

    logout: {
        color: "#FF6666",
    }
})



const useStyles = makeStyles(customStyle);

export default function Dashboard(props) {
    let match = useRouteMatch();
    let history = useHistory();
    const classes = useStyles();
    const { user, signOut, setUser } = useContext(UserContext);
    const { isLinkedToEssentials, setIsLinkedToEssentials } = useContext(ConnectivityContext);

    if(user === null) {
        history.push("/")
    }

    const logout = () => {
        clearEssentialsSession()
        history.push("/")
    }

    const clearEssentialsSession = () => {
        essentialsConnector.disconnectWalletConnect();
        signOut();
        setIsLinkedToEssentials(false);
    };

    let { ...rest } = props;

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = (value) => {
        setOpen(false);
    };

    return (
        <div>
            <Header brand={<Brand />} rightLinks={<HeaderLinks openLogin={handleClickOpen} />} fixed color="white" {...rest}/>
            <div className={classNames(classes.main)} style={{paddingTop: "95px", background: "#F8F8F8"}}>
                <Grid container style={{minHeight: "1300px"}}>
                    <Grid item md={3} lg={2}>
                        <LeftNav />
                    </Grid>
                    <Grid item md={9} lg={10}>
                        <Box component="div" className={classes.contentBox}>
                            <Grid container className={classes.loginBox}>
                                <Grid item md={4}>
                                    <Box component="div" className={classes.login}>
                                        <AccountCircleIcon style={{position: "relative", top: "6px", marginRight: "5px"}} />
                                        登入DID
                                    </Box>
                                </Grid>
                                <Grid item md={8} className={classes.didBox}>
                                    <Box component="span" className={classes.did}>{`did:elastos:${user}`}</Box>
                                    <Link onClick={ () => { logout() } } style={{textDecoration: "none", cursor: "pointer"}}>
                                        <Box component="span" className={classes.logout}>
                                            <PowerSettingsNewIcon style={{position: "relative", top: "6px", marginRight: "5px"}} />
                                            登出
                                        </Box>
                                    </Link>
                                </Grid>
                            </Grid>
                            <Switch>
                                <Route path={`${match.path}/main`} component={Statistic} />
                            </Switch>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
