import { useState, useEffect } from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import NodeSummaryItem from '../../../components/NodeSummaryItem';
import VaultSummaryItem from '../../../components/VaultSummaryItem';
import { PageTitleTypo } from '../style';
import useUser from '../../../hooks/useUser';
import {
  backupVault,
  checkBackupStatus,
  findBackupNodeProvider,
  getHiveNodesList,
  getHiveVaultInfo,
  migrateVault,
  unbindDID
} from '../../../service/fetch';
import { emptyNodeItem, emptyVaultItem } from '../../../utils/filler';

const NodeStatisticLabel = styled(Typography)({
  color: 'rgba(0,0,0, 0.3)',
  fontWeight: 400,
  fontSize: '25px',
  textAlign: 'center',
  '@media (max-width:500px)': {
    fontSize: '12px'
  }
});

const NodeStatisticBody = styled(Typography)({
  color: '#000',
  fontWeight: 700,
  fontSize: '50px',
  textAlign: 'center',
  '@media (max-width:500px)': {
    fontSize: '25px'
  }
});

const CustomButton = styled(Button)({
  backgroundColor: '#fff',
  // boxShadow: '0px 0px 10px rgba(255, 147, 30, 0.3)',
  width: '160px',
  height: '40px',
  padding: '10px',
  border: '2px solid #E5E5E5',
  borderRadius: '100px',
  boxSizing: 'border-box',
  color: '#000',
  fontSize: '15px',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: 'rgba(255, 147, 30, 0.3)',
    color: '#fff'
  }
});

const NodeSummaryBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  border: '2px solid #E5E5E5',
  // boxShadow: '0px 0px 10px rgba(255, 147, 30, 0.3)',
  borderRadius: '18px',
  width: '100%',
  padding: '15px 20px',
  [theme.breakpoints.up('md')]: {
    padding: '20px 30px'
  }
}));

export default function HiveHome() {
  const { user } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(0);
  const [participated, setParticipated] = useState(0);
  const [nodeItems, setNodeItems] = useState(Array(3).fill(emptyNodeItem));
  const [vaultItems, setVaultItems] = useState([emptyVaultItem]);
  const [onProgress, setOnProgress] = useState(false);
  const [hasBackup, setHasBackup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const nodeList = await getHiveNodesList(undefined, undefined, false);
        setNodeItems(nodeList);
        const myNodeList = await getHiveNodesList(undefined, user.did, false);
        setCreated(myNodeList.length);
        const vaultItem = await getHiveVaultInfo(user.did, undefined, 1);
        if (vaultItem) {
          setVaultItems([vaultItem]);
          setParticipated(1);
        } else setVaultItems([]);
        setHasBackup(await checkBackupStatus(user.did));
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    if (user.did) fetchData();
  }, [user.did]);

  const handleBackup = async () => {
    if (!user.did) return;
    setOnProgress(true);
    try {
      const backupNodeProvider = await findBackupNodeProvider(user.did);
      console.log('Backup vault to: ', backupNodeProvider);
      const result = await backupVault(user.did, backupNodeProvider);
      if (result === 1) {
        enqueueSnackbar('Backup vault succeed', {
          variant: 'success',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
      } else if (result === 2) {
        enqueueSnackbar('Already backup', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
      } else {
        enqueueSnackbar('Backup vault error', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Backup vault error', {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
    }
    setOnProgress(false);
  };

  const handleMigrate = async () => {
    if (!user.did) return;
    setOnProgress(true);
    try {
      const backupNodeProvider = await findBackupNodeProvider(user.did);
      console.log('Migrate vault to: ', backupNodeProvider);
      await migrateVault(user.did, backupNodeProvider);
      enqueueSnackbar('Migrate vault succeed', {
        variant: 'success',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Migrate vault error', {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
    }
  };

  // For test
  const handleUnbind = async () => {
    if (!user.nodeProvider || user.did) return;
    try {
      console.log('Unbind DID from ', user.nodeProvider);
      // await unbindDID(user.did);
      enqueueSnackbar('Unbind DID succeed', {
        variant: 'success',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Unbind DID error', {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
    }
    setOnProgress(false);
  };

  return (
    <>
      <PageTitleTypo mt={{ xs: 7, md: 15 }}>Home</PageTitleTypo>
      <Stack spacing={{ xs: 4, md: 5 }} mt={{ xs: 4, md: 8 }}>
        <PageTitleTypo sub="true">Hive Node Statistics</PageTitleTypo>
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          py={5}
          sx={{
            width: '100%',
            // boxShadow: '0px 0px 10px rgba(255, 147, 30, 0.3)',
            border: '2px solid #E5E5E5',
            borderRadius: '20px',
            backgroundColor: 'white',
            boxSizing: 'border-box',
            marginTop: { xs: '10px !important', md: '40px !important' }
          }}
        >
          <Stack spacing={{ xs: 1, sm: 2 }}>
            <NodeStatisticLabel>Created by me</NodeStatisticLabel>
            <NodeStatisticBody>{created}</NodeStatisticBody>
          </Stack>
          <Stack spacing={{ xs: 1, sm: 2 }}>
            <NodeStatisticLabel>Participated by me</NodeStatisticLabel>
            <NodeStatisticBody>{participated}</NodeStatisticBody>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={{ xs: 2, sm: 5 }}
          px={1}
          sx={{ width: '100%', margin: '40px auto' }}
        >
          <CustomButton onClick={handleBackup} disabled={hasBackup || onProgress}>
            Backup
          </CustomButton>
          <CustomButton onClick={handleMigrate} disabled={onProgress}>
            Migrate
          </CustomButton>
          <CustomButton onClick={handleUnbind} disabled={!user.nodeProvider || onProgress}>
            Unbind
          </CustomButton>
        </Stack>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 4, md: 5 }}
          justifyContent="space-between"
        >
          <NodeSummaryBox>
            <Typography variant="h5">Node Summary</Typography>
            <Stack spacing={{ xs: 4, md: 5 }} mt={{ xs: 4, md: 5 }}>
              <Grid
                container
                sx={{
                  fontSize: { xs: '12px', md: '15px' },
                  textAlign: 'center',
                  color: 'rgba(0,0,0,0.3)'
                }}
              >
                <Grid item xs={2} md={2} textAlign="left">
                  Name
                </Grid>
                <Grid item xs={8} md={8}>
                  URL
                </Grid>
                <Grid item xs={2} md={2}>
                  Status
                </Grid>
              </Grid>
              {nodeItems.map((item, index) => (
                <NodeSummaryItem
                  key={`node-summary-${index}`}
                  nodeName={item.name}
                  nodeURL={item.url}
                  nodeStatus={item.status}
                  isLoading={loading}
                />
              ))}
            </Stack>
          </NodeSummaryBox>
          <NodeSummaryBox>
            <Typography variant="h5">Vault Summary</Typography>
            <Stack spacing={{ xs: 4, md: 5 }} mt={{ xs: 4, md: 12 }}>
              {vaultItems.map((item, index) => (
                <VaultSummaryItem
                  key={`vault-summary-${index}`}
                  vaultName={item.name}
                  vaultTotal={item.total}
                  vaultUsed={item.used}
                  isLoading={loading}
                />
              ))}
            </Stack>
          </NodeSummaryBox>
        </Stack>
      </Stack>
    </>
  );
}
