import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Grid, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import VaultInitialView from '../../../components/Dashboard/Vault/InitialView';
import VaultItemBox from '../../../components/VaultItemBox';
import DappVaultGrid from '../../../components/Dashboard/Vault/DappVaultGrid';
import { BadgeTypo, HeaderTypo } from '../../../components/Custom/CustomTypos';
import { useUserContext } from '../../../contexts/UserContext';
import {
  checkBackupStatus,
  getDappsOnVault,
  getHiveVaultInfo,
  backupVault,
  migrateVault,
  createVault,
  bindDid
} from '../../../service/fetch';
import BindConfirmDlg from '../../../components/Dialog/BindConfirmDlg';
import BackupConfirmDlg from '../../../components/Dialog/BackupConfirmDlg';
import MigrateConfirmDlg from '../../../components/Dialog/MigrateConfirmDlg';
import useHiveHubContracts from '../../../hooks/useHiveHubContracts';

export default function MyVault() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { getActiveHiveNodeUrls } = useHiveHubContracts();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [myVault, setMyVault] = useState(null);
  const [backupStatus, setBackupStatus] = useState(false);
  const [dappsOnVault, setDappsOnVault] = useState(Array(2).fill(0));
  const [openBindDlg, setOpenBindDlg] = useState(false);
  const [openBackupDlg, setOpenBackupDlg] = useState(false);
  const [openMigrateDlg, setOpenMigrateDlg] = useState(false);
  const [onProgress, setOnProgress] = useState(false);
  const [activeNodeUrls, setAcitveNodeUrls] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const vaultItem = await getHiveVaultInfo(user.did, undefined, 1);
        if (vaultItem) {
          setMyVault(vaultItem);
          const status = await checkBackupStatus(user.did);
          setBackupStatus(status);
          const dapps = await getDappsOnVault(user.did, undefined);
          setDappsOnVault(dapps);
        }
      } catch (e) {
        console.error(`Failed to load my vault: ${e}`);
        setMyVault(null);
      }
      setIsLoading(false);
    };
    if (user.did) fetchData();
    else navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.did]);

  useEffect(() => {
    const fetch = async () => {
      const allUrls = await getActiveHiveNodeUrls();
      let availableUrls = allUrls;
      if (user?.nodeProvider || '')
        availableUrls = (allUrls || []).filter((item) => item !== user.nodeProvider);
      setAcitveNodeUrls(availableUrls);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.nodeProvider]);

  const handleOpenBindDlg = () => {
    if (user?.nodeProvider || '') {
      handleCreateVault(undefined);
    }
    if (activeNodeUrls.length) setOpenBindDlg(true);
    else
      enqueueSnackbar('No Active Hive Nodes.', {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
  };

  const handleOpenBackupDlg = () => {
    if (activeNodeUrls.length) setOpenBackupDlg(true);
    else
      enqueueSnackbar('No Active Hive Nodes.', {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
  };

  const handleOpenMigrateDlg = () => {
    if (activeNodeUrls.length) setOpenMigrateDlg(true);
    else
      enqueueSnackbar('No Active Hive Nodes.', {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
  };

  const handleCreateVault = async (bindNodeUrl) => {
    if (!user.did) return;
    try {
      setOnProgress(true);
      const bindStatus = bindNodeUrl ? await bindDid(bindNodeUrl) : true;
      setOnProgress(false);
      if (bindStatus) {
        setOpenBindDlg(false);
        const res = await createVault(user.did);
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
      } else
        enqueueSnackbar('Bind DID error', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
    } catch (e) {
      console.error(e);
      enqueueSnackbar('Create vault error', {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
    }
  };

  const handleBackup = async (backupNodeProvider) => {
    if (!user.did || !backupNodeProvider) return;
    if (!myVault) return;
    setOnProgress(true);
    try {
      console.log('Backup vault to: ', backupNodeProvider);
      await backupVault(user.did, backupNodeProvider);
      enqueueSnackbar('Backup vault succeed', {
        variant: 'success',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
      setOpenBackupDlg(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      enqueueSnackbar(`${err.message}`, {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
    }
    setOnProgress(false);
  };

  const handleMigrate = async (backupNodeProvider) => {
    if (!user.did || !backupNodeProvider) return;
    if (!myVault) return;
    setOnProgress(true);
    try {
      console.log('Migrate vault to: ', backupNodeProvider);
      await migrateVault(user.did, backupNodeProvider);
      enqueueSnackbar('Migrate vault succeed', {
        variant: 'success',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
      setOpenMigrateDlg(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
      enqueueSnackbar(`${err.message}`, {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
    }
    setOnProgress(false);
  };

  return (
    <>
      {!isLoading && !myVault && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}
        >
          <VaultInitialView onClickCreateVault={handleOpenBindDlg} />
        </div>
      )}
      {!!myVault && (
        <>
          <HeaderTypo sx={{ py: 1 }}>{t('vault-storage')}</HeaderTypo>
          <VaultItemBox
            endpoint={user?.nodeProvider || '???'}
            total={myVault?.total ?? 0}
            used={myVault?.used ?? 0}
            pricePlan={myVault?.pricePlan || 'Basic'}
            hasBackup={backupStatus}
            isLoading={isLoading}
            onClickBackup={handleOpenBackupDlg}
            onClickMigrate={handleOpenMigrateDlg}
            sx={{ mt: { xs: 2.5, md: 5 }, mb: 5 }}
          />
          <Stack direction="row" spacing={1}>
            <Stack direction="row" spacing={2} alignItems="center">
              <HeaderTypo sx={{ py: 1 }}>{t('vault-dapps-on-vault')}</HeaderTypo>
              {isLoading ? (
                <BadgeTypo component="div">
                  <Skeleton animation="wave" width="20px" />
                </BadgeTypo>
              ) : (
                <BadgeTypo>{dappsOnVault.length}</BadgeTypo>
              )}
            </Stack>
          </Stack>
          {!!dappsOnVault.length && (
            <Grid container mt={{ xs: 1.5, md: 2.5 }} spacing={{ xs: 1.5, md: 2.5 }}>
              {dappsOnVault.map((item, index) => (
                <DappVaultGrid
                  key={`Dapps-${index}`}
                  name={item?.name || ''}
                  appDid={item?.app_did || ''}
                  avatar={item?.icon_url || ''}
                  used={((item?.used_storage_size ?? 0) / 1024 / 1024).toFixed(2) * 1.0}
                  total={myVault?.total ?? 0}
                  isLoading={isLoading}
                />
              ))}
            </Grid>
          )}
        </>
      )}
      <BindConfirmDlg
        open={openBindDlg}
        onClose={() => {
          setOpenBindDlg(false);
          setOnProgress(false);
        }}
        onClick={(target) => handleCreateVault(target)}
        disabled={onProgress}
        activeNodes={activeNodeUrls}
      />
      <BackupConfirmDlg
        open={openBackupDlg}
        onClose={() => {
          setOpenBackupDlg(false);
          setOnProgress(false);
        }}
        onClick={(target) => handleBackup(target)}
        disabled={onProgress}
        activeNodes={activeNodeUrls}
      />
      <MigrateConfirmDlg
        open={openMigrateDlg}
        onClose={() => {
          setOpenMigrateDlg(false);
          setOnProgress(false);
        }}
        onClick={(target) => handleMigrate(target)}
        disabled={onProgress}
        activeNodes={activeNodeUrls}
      />
    </>
  );
}
