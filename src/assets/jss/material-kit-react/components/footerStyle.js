import { container, primaryColor } from "assets/jss/material-kit-react.js";

const footerStyle = {
  left: {
    // float: "left!important",
    display: "block",
    margin: "20px 0",
    "& :last-child": {
      borderRight: "none"
    }
  },
  right: {
    padding: "15px 0",
    margin: "0",
    fontSize: "14px"
    // float: "right!important"
  },
  block: {
    color: "inherit",
    padding: "0 1.2375rem",
    fontWeight: "300",
    fontSize: "18px",
    textDecoration: "none",
    position: "relative",
    display: "block",
    "&:hover": {
      color: "#316BFF"
    }
  },
  inlineBlock: {
    display: "inline-block",
    padding: "0px",
    width: "auto",
    height: "20px",
    lineHeight: "20px",
    borderRight: "1px solid white",
  },
  footer: {
    padding: "0.9375rem 0",
    textAlign: "center",
    display: "flex",
    zIndex: "2",
    position: "relative",
    backgroundColor: "#00164E"
  },
  a: {
    color: primaryColor,
    textDecoration: "none",
    backgroundColor: "transparent"
  },
  footerWhiteFont: {
    "&,&:hover,&:focus": {
      color: "#FFFFFF"
    }
  },
  container,
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0"
  },
  icon: {
    width: "18px",
    height: "18px",
    position: "relative",
    top: "3px"
  }
};
export default footerStyle;
