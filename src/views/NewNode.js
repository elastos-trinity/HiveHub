import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles";
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
import {useTranslation} from 'react-i18next'
import Badge from "../components/Badge/Badge";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import {InputBase, InputLabel, MenuItem, NativeSelect, Select, TextField} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import withStyles from "@material-ui/core/styles/withStyles";

const customStyle = theme => ({
    ...styles,
    formBox: {
        backgroundColor: "white",
        height: "800px",
        borderRadius: "5px",
        padding: "60px 120px",
    },

    commitButton: {
        backgroundColor: "#5297FF",
        width: "200px",
        height: "40px",
        lineHeight: "40px",
        color: "white",
        margin: "20px auto"
    },

    itemKey: {
        fontSize: "16px",
        fontWeight: 600,
        marginBottom: "20px",
        paddingLeft: "30px",
        height: "40px",
        lineHeight: "40px",
    },

    itemValue: {
        height: "40px",
        lineHeight: "40px",
        paddingRight: "30px",
        "& .MuiFormControl-root": {
            margin: "0",
        },

        "& .MuiInputBase-root": {
            height: "40px",
        },
    },

    desc: {
        paddingRight: "30px",
        "& .MuiInputBase-root": {
            height: "240px",
        },
        "& .MuiInputBase-input": {
            height: "180px !important",
            lineHeight: "25px",
            overflow: "scroll",
            marginBottom: "20px"
        },
    },

    margin: {
        margin: theme.spacing(1),
    },

    select: {
        width: "200px",
        marginRight: "30px !important"
    }
})

const useStyles = makeStyles(customStyle);

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

export default function NewNode(props) {
    let {t} = useTranslation()
    const classes = useStyles();
    const {...rest} = props;

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = (value) => {
        setOpen(false);
    };

    const [age, setAge] = React.useState('');
    const handleChange = (event) => {
        setAge(event.target.value);
    };

    return (
        <div>
            <Header
                brand={<Brand/>}
                rightLinks={<HeaderLinks openLogin={handleClickOpen}/>}
                fixed
                color="white"
                {...rest}
            />

            <div className={classNames(classes.main)} style={{padding: "100px 0 500px", background: "#F8F8F8"}}>
                <div className={classes.container}>
                    <Box component="div" className={classes.formBox}>
                        <Grid container>
                            <Grid item md={2} className={classes.itemKey}>{t('owner-did')}</Grid>
                            <Grid item md={10} className={classes.itemValue}>srgsve5h5yvnwi5yh4hyg2945hvwq0tq</Grid>

                            <Grid item md={2} className={classes.itemKey}>{t('form-node-name')}</Grid>
                            <Grid item md={10} className={classes.itemValue}>
                                <TextField
                                    id="outlined-full-width"
                                    placeholder="不超过12个字符，不含有特殊字符"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item md={2} className={classes.itemKey}>{t('form-node-email')}</Grid>
                            <Grid item md={10} className={classes.itemValue}>
                                <TextField
                                    id="outlined-full-width"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item md={2} className={classes.itemKey}>{t('form-node-country')}</Grid>
                            <Grid item md={10} className={classes.itemValue}>
                                <FormControl className={classes.select}>
                                    <NativeSelect
                                        id="demo-customized-select-native"
                                        value=""
                                        onChange={handleChange}
                                        input={<BootstrapInput />}
                                    >
                                        <option value={0}>国家</option>
                                        <option value={10}>Ten</option>
                                        <option value={20}>Twenty</option>
                                        <option value={30}>Thirty</option>
                                    </NativeSelect>
                                </FormControl>
                                <FormControl className={classes.select}>
                                    <TextField
                                        id="outlined-full-width"
                                        margin="normal"
                                        placeholder="省"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                    />
                                </FormControl>
                                <FormControl className={classes.select}>
                                    <TextField
                                        id="outlined-full-width"
                                        margin="normal"
                                        placeholder="区"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={2} className={classes.itemKey}>{t('form-node-url')}</Grid>
                            <Grid item md={10} className={classes.itemValue}>
                                <TextField
                                    id="outlined-full-width"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item md={2} className={classes.itemKey}>{t('form-node-desc')}</Grid>
                            <Grid item md={10} className={classes.desc}>
                                <TextField
                                    id="outlined-full-width"
                                    fullWidth
                                    // margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    multiline={true}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                        <Box component="div" style={{textAlign: "center"}}>
                            <Button variant="contained" className={classes.commitButton}>
                                {t('confirm')}
                            </Button>
                        </Box>
                    </Box>
                </div>
            </div>
        </div>
    );
}
