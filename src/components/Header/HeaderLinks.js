/*eslint-disable*/
import React, {useContext} from "react"
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
// import { Link } from "react-router-dom";

// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import SearchIcon from '@material-ui/icons/Search';
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";
import Link from "@material-ui/core/Link";

// core components
import Button from "components/CustomButtons/Button.js";
import MUIButton from "@material-ui/core/Button";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import {LanguageContext} from "../../context"
import Search from "./Search";
import {useTranslation} from "react-i18next";
import UserContext from "../../contexts/UserContext";
import {CircularProgress} from "@material-ui/core";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
    let { openLogin, showSearch, history, loading } = props;
    const { user, signOut } = useContext(UserContext);
    const classes = useStyles();
    let {t, i18n} = useTranslation()
    let {language, changeLanguage} = useContext(LanguageContext)
    return (
        <List className={classes.list}>
            <ListItem className={classes.listItem} style={{paddingTop: "5px", display: showSearch ? "inline-block" : "none"}}>
                <Search history={history} />
            </ListItem>
            <ListItem className={classes.listItem}>
                <Button
                    href="/#square"
                    color="transparent"
                    className={classes.navLink}
                >
                    {t("nav-square")}
                </Button>
            </ListItem>
            <ListItem className={classes.listItem}>
                {
                    user === null ? (
                        loading ? (
                            <Box>
                                <MUIButton
                                    disabled
                                    color="transparent"
                                    onClick={() => { openLogin() }}
                                    className={classes.navLink}
                                    style={{background: "rgba(255, 255, 255, 0.3)", borderRadius: "25px", color: "white"}}
                                >
                                    {t("did-login")}
                                </MUIButton>
                                <CircularProgress size={24}  style={{color: "white", position: "absolute", top: "50%", left: "50%", marginTop: "-12px", marginLeft: "-12px"}}/>
                            </Box>
                        ) : (
                            <MUIButton
                                color="transparent"
                                onClick={() => { openLogin() }}
                                className={classes.navLink}
                                style={{backgroundImage: "linear-gradient(to right, #5297FF , #316BFF)", borderRadius: "25px", color: "white"}}
                            >
                                {t("did-login")}
                            </MUIButton>
                        )
                    ) : (
                        <Button
                            href="/dashboard/main"
                            color="transparent"
                            className={classes.navLink}
                        >
                            {t("nav-my")}
                        </Button>
                    )
                }
            </ListItem>

            <ListItem className={classes.listItem}>
                <CustomDropdown
                    buttonText="Language"
                    buttonProps={{
                        className: classes.navLink,
                        color: "transparent"
                    }}
                    hoverColor={""}
                    // noLiPadding={false}
                    dropdownList={[
                        <Link href="#" onClick={() => i18n.changeLanguage('zh')} variant="body2" underline="none">
                            <span style={{color:"black"}}>简体中文</span>
                        </Link>,
                        <Link href="#" onClick={() => i18n.changeLanguage('en')} variant="body2" underline="none">
                            <span style={{color:"black"}}>English</span>
                        </Link>
                    ]}
                />
            </ListItem>
        </List>
    );
}
