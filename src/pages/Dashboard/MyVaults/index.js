import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { PageTitleTypo } from '../../../components/CustomTypos';
import VaultItem from '../../../components/VaultItem';
import { emptyVaultItem } from '../../../utils/filler';
import { useUserContext } from '../../../contexts/UserContext';
import {
  createVault,
  getHiveVaultInfo,
  backupVault,
  checkBackupStatus,
  findBackupNodeProvider,
  migrateVault
} from '../../../service/fetch';
import { CustomButton, PlusButton } from '../../../components/CustomButtons';

export default function HiveVaults() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [myVaultsList, setMyVaultsList] = useState(Array(1).fill(emptyVaultItem));
  const [onProgress, setOnProgress] = useState(false);
  const [hasBackup, setHasBackup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const vaultItem = await getHiveVaultInfo(user.did, undefined, 1);
      if (vaultItem) setMyVaultsList([vaultItem]);
      else setMyVaultsList([]);
      setHasBackup(await checkBackupStatus(user.did));
      setLoading(false);
    };
    fetchData();
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

  const handleBackup = async () => {
    if (!user.did) return;
    if (!myVaultsList.length) return;
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
    if (!myVaultsList.length) return;
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
      <PageTitleTypo mt={{ xs: 5, md: 6 }} mb={myVaultsList.length ? 0 : 1.25}>
        My Vaults
      </PageTitleTypo>
      <Stack mt={{ xs: 4, md: 8 }} mb={5} spacing={{ xs: 3.75, md: 6.25 }}>
        {myVaultsList.map((item, index) => (
          <VaultItem
            key={index}
            // id={item.id}
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
            onClick={handleBackup}
            disabled={!myVaultsList.length || hasBackup || onProgress}
          >
            Backup
          </CustomButton>
          <CustomButton onClick={handleMigrate} disabled={!myVaultsList.length || onProgress}>
            Migrate
          </CustomButton>
          <CustomButton onClick={handleUnbind} disabled={!user.nodeProvider || onProgress || true}>
            Unbind
          </CustomButton>
        </Stack>
      </Stack>
    </>
  );
}
