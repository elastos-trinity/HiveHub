import { container } from "assets/jss/material-kit-react.js";

const componentsStyle = {
  container,
  brand: {
    color: "#FFFFFF",
    textAlign: "left",
    paddingTop: "100px"
  },

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
  link: {
    textDecoration: "none"
  },
  textCenter: {
    textAlign: "center"
  },

  downButton: {
    display: "inline-block",
    textAlign: "center",
    backgroundColor: "white",
    cursor: "pointer",
    fontSize:"17px",
    color: "#487afb",
    width: "200px",
    height: "40px",
    lineHeight: "40px",
    borderRadius: "18px",
    border: "none",

    "&:visited": {
      color: "#487afb",
    },
    "&:hover": {
      color: "#487afb",
    },
  },

  product: {
    width: "144px",
    height: "70px",
    padding: "10px 0",
    fontSize: "24px",
    fontFamily: "PingFangSC-Semibold, PingFang SC",
    fontWeight: 400,
    color: "#3A66E7",
    lineHeight: "50px",
    margin: "0 auto",
    textAlign: "center",
  },

  line: {
    width: "94px",
    margin: "0 auto 40px",
    borderBottom: "3px solid #3A66E7",
  },

  line2: {
    display: "inline-block",
    width: "150px",
    border: "1px solid #e6e6e6"
  }
};

export default componentsStyle;
