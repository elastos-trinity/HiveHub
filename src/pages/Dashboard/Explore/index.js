import { useState, useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
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
  const [loading, setLoading] = useState(false);
  const [nodeItems, setNodeItems] = useState(Array(3).fill(emptyNodeItem));
  const [vaultItems, setVaultItems] = useState(Array(1).fill(emptyVaultItem));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const nodeList = await getHiveNodesList(undefined, undefined, true);
      setNodeItems(nodeList);
      const vaultItem = await getHiveVaultInfo(user.did, undefined, 1);
      if (vaultItem) {
        setVaultItems([vaultItem]);
      } else setVaultItems([]);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <PageTitleTypo mt={{ xs: 7, md: 15 }}>Explore</PageTitleTypo>
      <Stack spacing={{ xs: 4, md: 5 }} mt={{ xs: 4, md: 8 }}>
        <Stack direction="row" spacing={{ xs: '25px', md: '50px' }} alignItems="baseline">
          <PageTitleTypo sub="true">Nodes</PageTitleTypo>
          <FilterByTypo>Filter by</FilterByTypo>
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
              isLoading={loading}
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
              isLoading={loading}
            />
          ))}
        </Stack>
      </Stack>
    </>
  );
}
