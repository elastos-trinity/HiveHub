/*eslint-disable*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// material-ui core components
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";

import styles from "assets/jss/material-kit-react/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://www.elastos.org"
                className={classes.block}
                target="_blank"
              >
                Elastos Essentials
              </a>
            </ListItem>

            <ListItem className={classes.inlineBlock}>
              <a
                href="https://cyberrepublic.org"
                className={classes.block}
                target="_blank"
              >
                Feeds
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href={"/privacy-policy"}
                className={classes.block}
              >
                DID Utils
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                  href={"/terms"}
                  className={classes.block}
              >
                Github
              </a>
            </ListItem>
          </List>
        </div>
        <div className={classes.right}>
          2021&copy; Copyright & Trinity Tech Co., Ltd.
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  whiteFont: PropTypes.bool
};
