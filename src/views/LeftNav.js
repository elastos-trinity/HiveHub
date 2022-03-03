import React, {useEffect, useState} from "react";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import {
    Collapse,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    TableBody,
    TableCell,
    TableRow
} from "@material-ui/core";
import {ExpandLess, ExpandMore, StarBorder} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import HiveHubServer from "../service/hivehub";
import SdkContext from "../hivejs/testdata";
import Badge from "../components/Badge/Badge";
import Vault from "../hivejs/vault";
// import Link from "@material-ui/core/Link";
// import NavLink from "react-router-dom/modules/NavLink";

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
    let [nodes, setNodes] = useState([]);

    let {t} = useTranslation()

    const handleClick = () => {
        setOpen(!open);
    };

    useEffect(async () => {
        setNodes(await new Vault().getLoginUserNodes());
    }, [])

    return (
        <Box component="div" className={classes.navBox}>
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                className={classes.root}
            >
                <ListItem button
                          // style={{backgroundColor: "#005996", borderRadius: "4px"}}
                          component="a" href={`/dashboard/main`}>
                    <ListItemText primary={t('main')} />
                </ListItem>
                <ListItem button onClick={handleClick}>
                    <ListItemText primary={t('hive-node')} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {nodes.map((node) => (
                            <ListItem button className={classes.nested}
                                      component="a" href={`/dashboard/node/${node.nid}`}>
                                <ListItemText primary={node.name} />
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
                {/*<ListItem button>*/}
                {/*    <ListItemText primary={t('my-vault')} />*/}
                {/*</ListItem>*/}
            </List>
        </Box>
    )
}
