import { container, title } from "assets/jss/material-kit-react.js";

import imagesStyle from "assets/jss/material-kit-react/imagesStyles.js";

const profilePageStyle = {
  container,
  profile: {
    textAlign: "center",
    "& img": {
      maxWidth: "160px",
      width: "100%",
      margin: "0 auto",
      transform: "translate3d(0, -50%, 0)"
    }
  },
  description: {
    margin: "1.071rem auto 0",
    maxWidth: "600px",
    color: "#999",
    textAlign: "center !important"
  },
  name: {
    marginTop: "-80px"
  },
  ...imagesStyle,
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },
  mainRaised: {
    margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  },
  title: {
    ...title,
    display: "inline-block",
    position: "relative",
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none"
  },
  socials: {
    marginTop: "0",
    width: "100%",
    transform: "none",
    left: "0",
    top: "0",
    height: "100%",
    lineHeight: "41px",
    fontSize: "20px",
    color: "#999"
  },
  navWrapper: {
    margin: "20px auto 50px auto",
    textAlign: "center"
  },
  checkedDid: {
    border: "1px solid #f6f8fb",
    borderRadius: "5px",
    marginBottom: "20px"
  },
  didTitle: {
    backgroundColor: "#f6f8fb",
    textAlign: "center",
    font: "20px",
    fontWeight: "bold",
    height: "60px",
    lineHeight: "60px"
  },
  didItem: {
    borderTop: "1px solid #f6f8fb",
  },
  didHeader: {
    height: "56px",
    lineHeight: "56px",
    padding: "0 10px",
  },
  didIcon: {
    display:"inline-block",
    margin: "0 10px 0 0",
  },
  dot: {
    float: "right",
    color: "black",
    cursor: "pointer"
  },
  didDetail: {
    padding: "0 50px",
    overflow: "hidden"
  },
  parallaxHeight : {
    height: "240px",
    backgroundImage: "linear-gradient(to right, #487afb , #1127aa);"
  },

  privacyTitle: {
    textAlign: "center",
    color: "black",
    fontSize: "28px",
    fontWeight: "300",
    padding: "50px 0 20px 0"
  },

  subtitle: {
    textAlign: "center",
    paddingBottom: "20px"
  }
};

export default profilePageStyle;
