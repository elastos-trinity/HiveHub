import { useState, useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import NodeItem from '../../../components/NodeItem';
import VaultItem from '../../../components/VaultItem';
import { PageTitleTypo } from '../style';
import { getHiveNodesList, getHiveVaultsList } from '../../../service/fetch';

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

const vaultItemList = [
  {
    id: 1,
    name: 'Sarah',
    total: 524,
    used: 112,
    time: '05-04-2022 21:00:00'
  },
  {
    id: 2,
    name: 'Teru',
    total: 524,
    used: 352,
    time: '05-04-2022 21:00:00'
  }
];

export default function HiveExplore() {
  const [nodeItems, setNodeItems] = useState([]);
  const [vaultItems, setVaultItems] = useState(vaultItemList);

  useEffect(async () => {
    const nodeList = await getHiveNodesList();
    setNodeItems(nodeList);
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
              status={item.status}
              time={item.created}
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
              showButton
            />
          ))}
        </Stack>
      </Stack>
    </>
  );
}
