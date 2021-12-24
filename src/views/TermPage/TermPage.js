import React from "react"
// nodejs library that concatenates classes
import classNames from "classnames"
// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles"
// @material-ui/icons
// core components

import Header from "components/Header/Header.js"
import Footer from "components/Footer/Footer.js"
import HeaderLinks from "components/Header/HeaderLinks.js"
import Parallax from "components/Parallax/Parallax.js"

import styles from "assets/jss/material-kit-react/views/profilePage.js"
import Brand from "../Brand";
import TermContent from "./TermContent";

const useStyles = makeStyles(styles)

export default function TermPage(props) {
    const classes = useStyles()
    const {...rest} = props

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
                <div className={classes.container}>
                    <div className={classes.privacyTitle}>
                        Elastos Essentials Application Terms and Conditions
                    </div>
                    <div className={classes.subtitle}>
                        Last updated: 06 February 2020
                    </div>
                    <div style={{fontStyle: "italic"}}>PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY</div>

                    <TermContent />

                </div>
            </div>
            <Footer/>
        </div>
    )
}
