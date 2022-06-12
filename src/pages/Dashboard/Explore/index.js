import { useState, useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import NodeItem from '../../../components/NodeItem';
import VaultItem from '../../../components/VaultItem';
import { PageTitleTypo } from '../style';

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

const nodeItemList = [
  {
    name: 'Rong',
    description: 'This is my node.',
    ip: '192.115.24.2',
    did: 'did:elastos:ikkFHgoUHrVDTU8HTYDAWH9Z8S377Qvt7n',
    time: '05-04-2022 21:00:00',
    status: true
  },
  {
    name: 'Frost',
    description: 'Hey! You can access my node.',
    ip: '192.115.24.2',
    did: 'did:elastos:ikkFHgoUHrVDTU8HTYDAWH9Z8S377Qvt7n',
    time: '05-04-2022 21:00:00',
    status: false
  }
];

const vaultItemList = [
  {
    name: 'Sarah',
    total: 524,
    used: 112,
    time: '05-04-2022 21:00:00'
  },
  {
    name: 'Teru',
    total: 524,
    used: 352,
    time: '05-04-2022 21:00:00'
  }
];

export default function HiveExplore() {
  const [nodeItems, setNodeItems] = useState(nodeItemList);
  const [vaultItems, setVaultItems] = useState(vaultItemList);

  return (
    <>
      <PageTitleTypo mt={{ xs: 7, md: 15 }}>Explore</PageTitleTypo>
      <Stack spacing={{ xs: 4, md: 5 }} mt={{ xs: 4, md: 8 }}>
        <Stack direction="row" spacing={{ xs: '25px', md: '50px' }} alignItems="center">
          <PageTitleTypo sub>Nodes</PageTitleTypo>
          <FilterByTypo>Filter by</FilterByTypo>
        </Stack>
        <Stack spacing={3.75}>
          {nodeItems.map((item, index) => (
            <NodeItem
              key={`node-item-${index}`}
              name={item.name}
              description={item.description}
              ip={item.ip}
              did={item.did}
              status={item.status}
              time={item.time}
              showButton
            />
          ))}
        </Stack>
      </Stack>
      <Stack spacing={{ xs: 4, md: 5 }} mt={{ xs: 6.25, md: 12.5 }}>
        <Stack direction="row" spacing={{ xs: '25px', md: '50px' }} alignItems="center">
          <PageTitleTypo sub>Vaults</PageTitleTypo>
          <Typography>Filter by</Typography>
        </Stack>
        <Stack spacing={3.75}>
          {vaultItems.map((item, index) => (
            <VaultItem
              key={`vault-item-${index}`}
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
