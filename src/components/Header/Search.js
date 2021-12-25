/*eslint-disable*/
import React, {useContext} from "react"
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from '@material-ui/icons/Search';
import {useTranslation} from "react-i18next";

const customStyle = theme => ({
    item: {
        display: "inline-block",
        width: "280px",
        height: "40px",
        lineHeight: "40px",
        borderRadius: "20px",
        border: "0px",
        background: "rgba(255, 255, 255, 0.3)",
        padding: "0 10px"
    },

    icon: {
        marginTop: "2px",
        height: "40px",
    },

    searchInput: {
        width: "230px",
        height: "30px",
        lineHeight: "30px",
        background: "rgba(255, 255, 255, 0)",
        border: "none",
        position: "absolute",
        top: "10px",
        color: "white",
        fontSize: "18px",

        "&::placeholder": {
            color: "rgba(255, 255, 255, 0.3)"
        }
    }
})

const useStyles = makeStyles(customStyle);

export default function Search() {
    let {t} = useTranslation()
    const classes = useStyles();
    return (
        <span className={classes.item} id="searchContainer">
            <SearchIcon className={classes.icon}/>
            <input type="text" id="search" className={classes.searchInput} placeholder={t("search-placeholder")}/>
        </span>
    );
}
