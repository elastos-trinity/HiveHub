import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import VaultInitialView from '../../../components/Vault/InitialView';
import VaultItemBox from '../../../components/VaultItemBox';
import DappVaultGrid from '../../../components/Vault/DappVaultGrid';
import { BadgeTypo, HeaderTypo } from '../../../components/Custom/CustomTypos';
import { useUserContext } from '../../../contexts/UserContext';
import { checkBackupStatus, getDappsOnVault, getHiveVaultInfo } from '../../../service/fetch';
import BackupConfirmDlg from '../../../components/Dialog/BackupConfirmDlg';

export default function MyVault() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [myVault, setMyVault] = useState(null);
  const [backupStatus, setBackupStatus] = useState(false);
  const [dappsOnVault, setDappsOnVault] = useState(Array(2).fill(0));
  const [openBackupDlg, setOpenBackupDlg] = useState(false);
  const [openMigrateDlg, setOpenMigrateDlg] = useState(false);
  const [onProgress, setOnProgress] = useState(false);

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
        console.error(`Failed to load my nodes: ${e}`);
        setMyVault(null);
      }
      setIsLoading(false);
    };
    if (user.did) fetchData();
    else navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.did]);

  const handleBackup = () => {};
  const handleMigrate = () => {};

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
          <VaultInitialView onClickCreateVault={() => {}} />
        </div>
      )}
      {!!myVault && (
        <>
          <HeaderTypo sx={{ py: 1 }}>{t('vault-storage')}</HeaderTypo>
          <VaultItemBox
            ownerName={myVault?.ownerName || '???'}
            total={myVault?.total ?? 0}
            used={myVault?.used ?? 0}
            pricePlan={myVault?.pricePlan || 'Basic'}
            hasBackup={backupStatus}
            isLoading={isLoading}
            onClickBackup={() => setOpenBackupDlg(true)}
            onClickMigrate={() => setOpenMigrateDlg(true)}
            sx={{ mt: { xs: 2.5, md: 5 }, mb: 5 }}
          />
          <Stack direction="row" spacing={1}>
            <Stack direction="row" spacing={2} alignItems="center">
              <HeaderTypo sx={{ py: 1 }}>{t('vault-dapps-on-vault')}</HeaderTypo>
              <BadgeTypo>{dappsOnVault.length}</BadgeTypo>
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
      <BackupConfirmDlg
        open={openBackupDlg}
        onClose={() => setOpenBackupDlg(false)}
        onClick={handleBackup}
        disabled={onProgress}
      />
    </>
  );
}
