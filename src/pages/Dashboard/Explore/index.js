import { useState, useEffect } from 'react';
import { Stack, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import NodeItem from '../../../components/NodeItem';
import VaultItem from '../../../components/VaultItem';
import { PageTitleTypo } from '../style';
import { getHiveNodesList, getHiveVaultInfo } from '../../../service/fetch';
import { emptyNodeItem, emptyVaultItem } from '../../../utils/filler';
import useUser from '../../../hooks/useUser';

const FilterByTypo = styled(Typography)(({ theme }) => ({
  color: '#000',
  fontWeight: 400,
  fontSize: '10px',
  lineHeight: '12px',
  [theme.breakpoints.up('md')]: {
    fontSize: '20px',
    lineHeight: '24px'
  }
}));

export default function HiveExplore() {
  const { user } = useUser();
  const [loadingNode, setLoadingNode] = useState(false);
  const [loadingVault, setLoadingVault] = useState(false);
  const [nodeItems, setNodeItems] = useState(Array(3).fill(emptyNodeItem));
  const [vaultItems, setVaultItems] = useState(Array(1).fill(emptyVaultItem));
  const [onlyActive, setOnlyActive] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingNode(true);
      const nodeList = await getHiveNodesList(undefined, undefined, true, onlyActive);
      setNodeItems(nodeList);
      setLoadingNode(false);
    };
    fetchData();
  }, [user.did, onlyActive]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingVault(true);
      const vaultItem = await getHiveVaultInfo(user.did, undefined, 1);
      if (vaultItem) {
        setVaultItems([vaultItem]);
      } else setVaultItems([]);
      setLoadingVault(false);
    };
    fetchData();
  }, [user.did]);

  return (
    <>
      <PageTitleTypo mt={{ xs: 5, md: 6 }}>Explore</PageTitleTypo>
      <Stack spacing={{ xs: 4, md: 5 }} mt={{ xs: 4, md: 8 }} sx={{ position: 'relative' }}>
        <Stack direction="row" spacing={{ xs: '25px', md: '50px' }} alignItems="baseline">
          <PageTitleTypo sub="true">Nodes</PageTitleTypo>
          <FilterByTypo>Filter by</FilterByTypo>
          <Button
            onClick={() => setOnlyActive(!onlyActive)}
            style={{
              position: 'absolute',
              right: 0,
              height: { xs: '12px', md: '24px' },
              color: onlyActive ? '#FF931E' : '#00AB55'
            }}
          >
            {onlyActive ? 'all' : 'online'}
          </Button>
        </Stack>
        <Stack spacing={3.75}>
          {nodeItems.map((item, index) => (
            <NodeItem
              key={`node-item-${index}`}
              id={item._id}
              name={item.name}
              description={item.remark}
              ip={item.ip}
              did={item.owner_did}
              ownerName={item.ownerName}
              status={item.status}
              time={item.created}
              isLoading={loadingNode}
            />
          ))}
        </Stack>
      </Stack>
      <Stack spacing={{ xs: 4, md: 5 }} mt={{ xs: 6.25, md: 12.5 }}>
        <Stack direction="row" spacing={{ xs: '25px', md: '50px' }} alignItems="baseline">
          <PageTitleTypo sub="true">Vaults</PageTitleTypo>
          <FilterByTypo>Filter by</FilterByTypo>
        </Stack>
        <Stack spacing={3.75}>
          {vaultItems.map((item, index) => (
            <VaultItem
              key={`vault-item-${index}`}
              id={item.id}
              name={item.name}
              total={item.total}
              used={item.used}
              time={item.time}
              ownerName={item.ownerName}
              isLoading={loadingVault}
            />
          ))}
        </Stack>
      </Stack>
    </>
  );
}
