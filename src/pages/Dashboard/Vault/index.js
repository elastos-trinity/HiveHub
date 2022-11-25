import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Grid } from '@mui/material';
import VaultInitialView from '../../../components/Vault/InitialView';
import VaultItemBox from '../../../components/VaultItemBox';
import { BadgeTypo, HeaderTypo } from '../../../components/Custom/CustomTypos';
import { useUserContext } from '../../../contexts/UserContext';
import useHiveHubContracts from '../../../hooks/useHiveHubContracts';

const mockVault = {
  ownerName: 'Frost',
  used: 150,
  total: 512
};

export default function MyVault() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { getHiveNodesList } = useHiveHubContracts();
  const [isLoading, setIsLoading] = useState(false);
  const [myVault, setMyVault] = useState(mockVault);
  const [dappsOnVault, setDappsOnVault] = useState(Array(2).fill(0));

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const nodeList = await getHiveNodesList(undefined, user.did, true, true, false);
  //       setMyNodeList(nodeList || []);
  //     } catch (e) {
  //       console.error(`Failed to load my nodes: ${e}`);
  //       setMyNodeList([]);
  //     }
  //     setIsLoading(false);
  //   };
  //   if (user.did) fetchData();
  //   else navigate('/');
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user.did]);

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
          <HeaderTypo sx={{ py: 1 }}>Storage</HeaderTypo>
          <VaultItemBox
            ownerName={myVault?.ownerName || '???'}
            total={myVault?.total ?? 0}
            used={myVault?.used ?? 0}
            isLoading={isLoading}
            sx={{ mt: { xs: 2.5, md: 5 }, mb: 5 }}
          />
          <Stack direction="row" spacing={1}>
            <Stack direction="row" spacing={2} alignItems="center">
              <HeaderTypo sx={{ py: 1 }}>Dapps on this vault</HeaderTypo>
              <BadgeTypo>{dappsOnVault.length}</BadgeTypo>
            </Stack>
          </Stack>
          {!!dappsOnVault.length && (
            <Grid mt={{ xs: 2.5, md: 5 }} mb={5} spacing={{ xs: 3.75, md: 6.25 }}>
              {dappsOnVault.map((item, index) => (
                <VaultItemBox key={`Dapps-${index}`} sx={{ mt: { xs: 2.5, md: 5 }, mb: 5 }} />
              ))}
            </Grid>
          )}
        </>
      )}
    </>
  );
}
