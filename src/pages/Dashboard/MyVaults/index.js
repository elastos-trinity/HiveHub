import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { PageTitleTypo } from '../style';
import VaultItem from '../../../components/VaultItem';
import { emptyVaultItem } from '../../../utils/filler';
import useUser from '../../../hooks/useUser';
import { createVault, getHiveVaultInfo } from '../../../service/fetch';
import PlusButton from '../../../components/Buttons/PlusButton';

export default function HiveVaults() {
  // const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [myVaultsList, setMyVaultsList] = useState(Array(1).fill(emptyVaultItem));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const vaultItem = await getHiveVaultInfo(user.did, undefined, 1);
      if (vaultItem) setMyVaultsList([vaultItem]);
      else setMyVaultsList([]);
      setLoading(false);
    };
    fetchData();
  }, [user.did]);

  const handleCreateVault = () => {
    createVault(user.did)
      .then((res) => {
        if (res)
          enqueueSnackbar('Create vault succeed', {
            variant: 'success',
            anchorOrigin: { horizontal: 'right', vertical: 'top' }
          });
        else
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
          <PlusButton onClick={() => {}} hasPlus={false}>
            Access Hive Vaults
          </PlusButton>
        </Stack>
      </Stack>
    </>
  );
}
