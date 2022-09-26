import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { PageTitleTypo } from '../../../components/CustomTypos';
import VaultItem from '../../../components/VaultItem';
import { emptyVaultItem } from '../../../utils/filler';
import { useUserContext } from '../../../contexts/UserContext';
import { useDialogContext } from '../../../contexts/DialogContext';
import useHiveHubContracts from '../../../hooks/useHiveHubContracts';
import { createVault, getHiveVaultInfo, backupVault, migrateVault } from '../../../service/fetch';
import { CustomButton, PlusButton } from '../../../components/CustomButtons';
import ModalDialog from '../../../components/ModalDialog';
import SelectBackupNodeDlg from '../../../components/Dialog/SelectBackupNodeDlg';

export default function HiveVaults() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUserContext();
  const { dlgState, setDlgState } = useDialogContext();
  const { getActiveHiveNodeUrl } = useHiveHubContracts();
  const [loading, setLoading] = useState(false);
  const [myVaultsList, setMyVaultsList] = useState(Array(1).fill(emptyVaultItem));
  const [onProgress, setOnProgress] = useState(false);
  const [activeNodesUrl, setActiveNodesUrl] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const vaultItem = await getHiveVaultInfo(user.did, undefined, 1);
      const activeNodes = await getActiveHiveNodeUrl();
      if (vaultItem) setMyVaultsList([vaultItem]);
      else setMyVaultsList([]);
      setActiveNodesUrl(activeNodes);
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.did]);

  const handleCreateVault = () => {
    createVault(user.did)
      .then((res) => {
        if (res) {
          enqueueSnackbar('Create vault succeed', {
            variant: 'success',
            anchorOrigin: { horizontal: 'right', vertical: 'top' }
          });
          window.location.reload();
        } else
          enqueueSnackbar('Vault already exists', {
            variant: 'error',
            anchorOrigin: { horizontal: 'right', vertical: 'top' }
          });
      })
      .catch((e) => {
        console.error(e);
        enqueueSnackbar('Create vault error', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
      });
  };

  const handleBackup = async (backupNodeProvider) => {
    if (!user.did || !backupNodeProvider) return;
    if (!myVaultsList.length) return;
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
    if (!myVaultsList.length) return;
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
      <PageTitleTypo mt={{ xs: 5, md: 6 }} mb={myVaultsList.length ? 0 : 1.25}>
        My Vaults
      </PageTitleTypo>
      <Stack mt={{ xs: 4, md: 8 }} mb={5} spacing={{ xs: 3.75, md: 6.25 }}>
        {myVaultsList.map((item, index) => (
          <VaultItem
            key={index}
            // id={item.id}
            url={user.nodeProvider}
            name={item.name}
            total={item.total}
            used={item.used}
            time={item.time}
            ownerName={item.ownerName}
            isMyVault
            isLoading={loading}
            sx={{ cursor: 'pointer' }}
          />
        ))}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 3.75, md: 6.25 }}>
          <PlusButton onClick={handleCreateVault} disabled={myVaultsList.length > 0}>
            Create Hive Vault
          </PlusButton>
          <PlusButton onClick={() => {}} hasPlus={false} disabled>
            Access Hive Vaults
          </PlusButton>
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
            disabled={!myVaultsList.length || onProgress || loading}
          >
            Backup
          </CustomButton>
          <CustomButton
            onClick={() => openSelectNodeDlg(2)}
            disabled={!myVaultsList.length || onProgress || loading}
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
