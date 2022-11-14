import { useState, useEffect } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import NodeSummaryItem from '../../../components/NodeSummaryItem';
import VaultSummaryItem from '../../../components/VaultSummaryItem';
import {
  PageTitleTypo,
  NodeStatisticLabel,
  NodeStatisticBody
} from '../../../components/CustomTypos';
import { CustomButton } from '../../../components/CustomButtons';
import { NodeSummaryBox } from '../../../components/CustomContainer';
import { useUserContext } from '../../../contexts/UserContext';
import { useDialogContext } from '../../../contexts/DialogContext';
import { backupVault, getHiveVaultInfo, migrateVault, getAppContext } from '../../../service/fetch';
import { emptyNodeItem, emptyVaultItem } from '../../../utils/filler';
import ModalDialog from '../../../components/ModalDialog';
import SelectBackupNodeDlg from '../../../components/Dialog/SelectBackupNodeDlg';
import useHiveHubContracts from '../../../hooks/useHiveHubContracts';

export default function HiveHome() {
  const { user } = useUserContext();
  const { getHiveNodesList, getActiveHiveNodeUrl } = useHiveHubContracts();
  const { dlgState, setDlgState } = useDialogContext();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(0);
  const [participated, setParticipated] = useState(0);
  const [myNodeItems, setMyNodeItems] = useState(Array(3).fill(emptyNodeItem));
  const [vaultItems, setVaultItems] = useState([]); // emptyVaultItem
  const [activeNodesUrl, setActiveNodesUrl] = useState([]);
  const [onProgress, setOnProgress] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const results = await Promise.all([
          getHiveNodesList(undefined, undefined, false, true, false),
          getAppContext(user.did).then((context) => context.getProviderAddress(user.did))
        ]);
        const [allNodes, providerAddress] = results;
        const myNodes = allNodes.filter((node) => node.owner_did === user.did);
        setCreated(myNodes.length);

        if (!providerAddress) {
          setMyNodeItems(myNodes);
          return;
        }

        // node list
        const participatedNode = allNodes.find((item) => item.url === providerAddress);
        if (participatedNode && !myNodes.find((item) => item.url === providerAddress)) {
          myNodes.push(participatedNode);
        }
        setMyNodeItems(myNodes);

        // participated count, vault info., active nodes
        await Promise.all([
          getActiveHiveNodeUrl().then((nodes) => {
            setActiveNodesUrl(nodes);
          }),
          getHiveVaultInfo(user.did, undefined, 1).then((vaultInfo) => {
            if (!vaultInfo) {
              return;
            }
            setParticipated(1);
            setVaultItems([vaultInfo]);
          })
        ]);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    if (user.did) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.did]);

  const handleBackup = async (backupNodeProvider) => {
    if (!user.did || !backupNodeProvider) return;
    if (!vaultItems.length) return;
    setOnProgress(true);
    try {
      console.log('Backup vault to: ', backupNodeProvider);
      const result = await backupVault(user.did, backupNodeProvider);
      if (result === 1) {
        enqueueSnackbar('Backup vault succeed', {
          variant: 'success',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        setDlgState({
          ...dlgState,
          selectBackupNodeDlgOpened: false,
          selectMigrateNodeDlgOpened: false
        });
        window.location.reload();
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

  const handleMigrate = async (backupNodeProvider) => {
    if (!user.did || !backupNodeProvider) return;
    if (!vaultItems.length) return;
    setOnProgress(true);
    try {
      console.log('Migrate vault to: ', backupNodeProvider);
      const result = await migrateVault(user.did, backupNodeProvider);
      if (result) {
        enqueueSnackbar('Migrate vault succeed', {
          variant: 'success',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        setDlgState({
          ...dlgState,
          selectBackupNodeDlgOpened: false,
          selectMigrateNodeDlgOpened: false
        });
        window.location.reload();
      } else
        enqueueSnackbar('Migrate vault error', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Migrate vault error', {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
    }
    setOnProgress(false);
  };

  // For test
  const handleUnbind = async () => {
    if (!user.nodeProvider || user.did) return;
    setOnProgress(true);
    try {
      console.log('Unbind DID from ', user.nodeProvider);
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

  const openSelectNodeDlg = (dlgType) => {
    const availableNodes = activeNodesUrl.filter((item) => item !== user.nodeProvider);
    if (!availableNodes.length) {
      enqueueSnackbar('No available node provider', {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
    } else {
      setDlgState({
        ...dlgState,
        selectBackupNodeDlgOpened: dlgType === 1,
        selectMigrateNodeDlgOpened: dlgType !== 1
      });
    }
  };

  return (
    <>
      {/* <PageTitleTypo mt={{ xs: 5, md: 6 }}>Home</PageTitleTypo> */}
      <Stack spacing={{ xs: 4, md: 5 }} mt={{ xs: 4, md: 8 }}>
        <PageTitleTypo sub="true">Hive Node Statistics</PageTitleTypo>
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          py={5}
          sx={{
            width: '100%',
            border: '2px solid #E5E5E5',
            borderRadius: '20px',
            backgroundColor: 'white',
            boxSizing: 'border-box',
            marginTop: { xs: '10px !important', md: '40px !important' }
          }}
        >
          <Stack spacing={{ xs: 1, sm: 2 }}>
            <NodeStatisticLabel>Created by me</NodeStatisticLabel>
            <NodeStatisticBody>{loading ? 0 : created}</NodeStatisticBody>
          </Stack>
          <Stack spacing={{ xs: 1, sm: 2 }}>
            <NodeStatisticLabel>Participated by me</NodeStatisticLabel>
            <NodeStatisticBody>{loading ? 0 : participated}</NodeStatisticBody>
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
          <CustomButton
            onClick={() => openSelectNodeDlg(1)}
            disabled={!vaultItems.length || onProgress || loading}
          >
            Backup
          </CustomButton>
          <CustomButton
            onClick={() => openSelectNodeDlg(2)}
            disabled={!vaultItems.length || onProgress || loading}
          >
            Migrate
          </CustomButton>
          <CustomButton
            onClick={handleUnbind}
            disabled={!user.nodeProvider || onProgress || loading || true}
          >
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
              {myNodeItems.map((item, index) => (
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
            <Stack spacing={{ xs: 4, md: 5 }} mt={{ xs: 4, md: 5 }}>
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
      <ModalDialog
        open={dlgState.selectBackupNodeDlgOpened || dlgState.selectMigrateNodeDlgOpened}
        onClose={() => {
          setDlgState({
            ...dlgState,
            selectBackupNodeDlgOpened: false,
            selectMigrateNodeDlgOpened: false
          });
        }}
      >
        <SelectBackupNodeDlg
          dlgType={dlgState.selectBackupNodeDlgOpened ? 0 : 1}
          activeNodes={activeNodesUrl}
          fromNode={user.nodeProvider}
          onProgress={onProgress}
          onClose={() => {
            setDlgState({
              ...dlgState,
              selectBackupNodeDlgOpened: false,
              selectMigrateNodeDlgOpened: false
            });
          }}
          onClick={(targetNodeProvider) => {
            if (dlgState.selectBackupNodeDlgOpened) handleBackup(targetNodeProvider);
            else handleMigrate(targetNodeProvider);
          }}
        />
      </ModalDialog>
    </>
  );
}
