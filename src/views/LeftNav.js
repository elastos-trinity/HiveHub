import React from "react";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import {Collapse, ListItem, ListItemIcon, ListItemText, ListSubheader} from "@material-ui/core";
import {ExpandLess, ExpandMore, StarBorder} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 280,
        padding: "15px",
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },

    navBox: {
        margin: "20px",
        borderRadius: "5px !important",
        backgroundColor: "#00164E",
        color: '#CBE0FF'
    }
}));

export default function LeftNav() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    let {t} = useTranslation()

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <Box component="div" className={classes.navBox}>
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                className={classes.root}
            >
                <ListItem button style={{backgroundColor: "#005996", borderRadius: "4px"}}>
                    <ListItemText primary={t('main')} />
                </ListItem>
                <ListItem button onClick={handleClick}>
                    <ListItemText primary={t('hive-node')} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem button className={classes.nested}>
                            <ListItemText primary="HiveNode-1" />
                        </ListItem>
                        <ListItem button className={classes.nested}>
                            <ListItemText primary="HiveNode-2" />
                        </ListItem>
                        <ListItem button className={classes.nested}>
                            <ListItemText primary="HiveNode-3" />
                        </ListItem>
                        <ListItem button className={classes.nested}>
                            <ListItemText primary="HiveNode-4" />
                        </ListItem>
                    </List>
                </Collapse>
                <ListItem button>
                    <ListItemText primary={t('my-vault')} />
                </ListItem>
            </List>
        </Box>
    )
}
