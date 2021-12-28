import React from "react";
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

    let {t} = useTranslation()

    return (
        <div>
            <Box component="div" className={classes.nodeVolumeBox}>
                <Box component="div" className={classes.title}>Hive Node 数量统计</Box>
                <Grid container justifyContent="space-around" style={{margin: "60px 0", height: "60px"}}>
                    <Grid item className={classes.data}>
                        <Box component="div" className={classes.number}>6</Box>
                        <Box component="div">我创建的</Box>
                    </Grid>
                    <Divider orientation="vertical" />
                    <Grid item className={classes.data}>
                        <Box component="div" className={classes.number}>1</Box>
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
                                    <TableCell align="right">{t('t-visitor')}</TableCell>
                                    <TableCell align="right">{t('t-capacity')}</TableCell>
                                    <TableCell align="right">{t('t-status')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.visitor}</TableCell>
                                        <TableCell align="right">{row.capacity}</TableCell>
                                        <TableCell align="right">
                                            <Badge color={row.status === 1 ? 'success' : 'gray'}>
                                                {row.status === 1 ? t('online') : t('offline')}
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
                                    <TableCell>{t('t-name')}</TableCell>
                                    <TableCell align="right">{t('t-visitor')}</TableCell>
                                    <TableCell align="right">{t('t-capacity')}</TableCell>
                                    <TableCell align="right">{t('t-status')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.visitor}</TableCell>
                                        <TableCell align="right">{row.capacity}</TableCell>
                                        <TableCell align="right">
                                            <Badge color={row.status === 1 ? 'success' : 'gray'}>
                                                {row.status === 1 ? t('online') : t('offline')}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
