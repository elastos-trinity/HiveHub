import React, {useContext, useEffect, useState} from "react";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import {
    Collapse,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Badge from "../components/Badge/Badge";
import Vault from "../hivejs/vault";
import UserContext from "../contexts/UserContext";
import HiveHubServer from "../service/hivehub";

const useStyles = makeStyles((theme) => ({
    nodeVolumeBox: {
        height: "250px",
        backgroundColor: "white",
        padding: "10px 15px",
        fontSize: "14px",
        marginBottom: "15px",
        borderRadius: "5px"
    },

    title:  {
        color: "#00164E",
        fontWeight: "500",
        fontSize: "16px",
    },

    data: {
        height: "35px"
    },

    number: {
        fontWeight: "500",
        fontSize: "30px",
        textAlign: "center",
        marginBottom: "15px"
    },

    allNodeBox: {
        backgroundColor: "white",
        width: "49.4%",
        padding: "10px 15px",
        borderRadius: "5px"
    },

    table: {
        minWidth: 400,
        "& .MuiTableCell-root": {
            border: "none !important",
            paddingLeft: "0"
        },

        "& .MuiTableCell-head": {
            fontWeight: "normal !important",
            fontSize: "14px",
            color: "#999999",
        }
    },
}));

function createData(name, visitor, capacity, status) {
    return { name, visitor, capacity, status };
}

const rows = [
    createData('Hive Node 1', 112, "2.2GB/20.1GB", 1),
    createData('Hive Node 1', 237, "2.2GB/20.1GB", 1),
    createData('Hive Node 1', 262, "2.2GB/20.1GB", 1),
    createData('Hive Node 1', 305, "2.2GB/20.1GB", 0),
    createData('Hive Node 1', 356, "2.2GB/20.1GB", 1),
];

export default function Statistic() {
    const classes = useStyles();

    let {t} = useTranslation();
    const { user, signOut, setUser } = useContext(UserContext);
    let [online, setOnline] = useState(false);
    let [vault, setVault] = useState(null);
    let [nodes, setNodes] = useState([]);
    let ownerDid = `did:elastos:${user}`;

    // init page data.
    useEffect(async () => {
        let vault = new Vault();
        let url = await Vault.getHiveUrlByDid(ownerDid);
        if (url) {
            let on = await HiveHubServer.isOnline(url);
            setOnline(online);
            if (on) {
                try {
                    let detail = await vault.getVaultDetail(url);
                    setVault(detail);
                } catch (e) {
                    console.log(`can not get the vault information in ${url}`);
                }
            }
        }
        let data = await HiveHubServer.getHiveNodes(null, ownerDid);
        for (const node of data.nodes) {
            node.online = await HiveHubServer.isOnline(node.url);
        }
        setNodes(data.nodes);
    }, []);

    return (
        <div>
            <Box component="div" className={classes.nodeVolumeBox}>
                <Box component="div" className={classes.title}>Hive Node 数量统计</Box>
                <Grid container justifyContent="space-around" style={{margin: "60px 0", height: "60px"}}>
                    <Grid item className={classes.data}>
                        <Box component="div" className={classes.number}>{nodes.length}</Box>
                        <Box component="div">我创建的</Box>
                    </Grid>
                    <Divider orientation="vertical" />
                    <Grid item className={classes.data}>
                        <Box component="div" className={classes.number}>{vault ? 1 : 0}</Box>
                        <Box component="div">我参与的</Box>
                    </Grid>
                </Grid>
            </Box>

            <div>
                <Grid container justifyContent={"space-between"}>
                    <Grid item className={classes.allNodeBox}>
                        <Box component="div" className={classes.title}>Hive Node 全览</Box>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('t-name')}</TableCell>
                                    {/*<TableCell align="right">{t('t-visitor')}</TableCell>*/}
                                    <TableCell align="left">{t('form-node-url')}</TableCell>
                                    <TableCell align="right">{t('t-status')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {nodes.map((node) => (
                                    <TableRow key={node.nid}>
                                        <TableCell component="th" scope="row">
                                            {node.name}
                                        </TableCell>
                                        {/*<TableCell align="right">{node.visitor}</TableCell>*/}
                                        <TableCell align="left">{node.url}</TableCell>
                                        <TableCell align="right">
                                            <Badge color={node.online ? 'success' : 'gray'}>
                                                {node.online ? t('online') : t('offline')}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>
                    <Grid item className={classes.allNodeBox}>
                        <Box component="div" className={classes.title}>Vault 全览</Box>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {/*<TableCell>{t('t-name')}</TableCell>*/}
                                    <TableCell>{t('pricing-plan')}</TableCell>
                                    <TableCell align="left">{t('t-capacity')}</TableCell>
                                    <TableCell align="right">{t('owner-did')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vault &&
                                    <TableRow key={vault.userDid}>
                                        {/*<TableCell component="th" scope="row">*/}
                                        {/*    {vault.pricePlan}*/}
                                        {/*</TableCell>*/}
                                        <TableCell>{vault.pricingPlan}</TableCell>
                                        <TableCell align="left">{vault.used/1024/1024}MB/{(vault.quota/1024/1024)}MB</TableCell>
                                        {/*<TableCell align="right">*/}
                                        {/*    <Badge color={online? 'success' : 'gray'}>*/}
                                        {/*        {online ? t('online') : t('offline')}*/}
                                        {/*    </Badge>*/}
                                        {/*</TableCell>*/}
                                        <TableCell align="right">...{vault.userDid.substring(vault.userDid.length - 8)}
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
