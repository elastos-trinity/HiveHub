import { useState, useEffect } from 'react';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import NodeItem from '../../../components/NodeItem';
import { PageTitleTypo } from '../style';

const NodeStatisticLabel = styled(Typography)({
  color: 'rgba(0,0,0, 0.3)',
  fontWeight: 400,
  fontSize: '25px',
  textAlign: 'center',
  '@media (max-width:500px)': {
    fontSize: '12px'
  }
});

const NodeStatisticBody = styled(Typography)({
  color: '#000',
  fontWeight: 700,
  fontSize: '50px',
  textAlign: 'center',
  '@media (max-width:500px)': {
    fontSize: '25px'
  }
});

const CustomButton = styled(Button)({
  backgroundColor: '#fff',
  // boxShadow: '0px 0px 10px rgba(255, 147, 30, 0.3)',
  width: '160px',
  height: '40px',
  padding: '10px',
  border: '2px solid #E5E5E5',
  borderRadius: '100px',
  boxSizing: 'border-box',
  color: '#000',
  fontSize: '15px',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: 'rgba(255, 147, 30, 0.3)',
    color: '#fff'
  }
});

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
    name: 'Vault Service-0 (Free)',
    total: 524,
    used: 262
  },
  {
    name: 'Vault Service-1 (Free)',
    total: 524,
    used: 112
  }
];

export default function HiveExplore() {
  const [nodeItems, setNodeItems] = useState(nodeItemList);
  const [vaultItems, setVaultItems] = useState(vaultItemList);

  return (
    <>
      <PageTitleTypo mt={{ xs: 7, md: 15 }}>Explore</PageTitleTypo>
      <Stack spacing={{ xs: 4, md: 5 }} mt={{ xs: 4, md: 8 }}>
        <Stack direction="row">
          <PageTitleTypo sub>Nodes</PageTitleTypo>
          <Typography>Filter by</Typography>
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
            />
          ))}
        </Stack>

        {/* <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          py={5}
          sx={{
            width: '100%',
            border: '2px solid #E5E5E5',
            borderRadius: '20px',
            backgroundColor: 'white',
            boxSizing: 'border-box',
            marginTop: { xs: '10px !important', md: '40px !important' }
          }}
        >
          <Stack spacing={{ xs: 1, sm: 2 }}>
            <NodeStatisticLabel>Created by me</NodeStatisticLabel>
            <NodeStatisticBody>2</NodeStatisticBody>
          </Stack>
          <Stack spacing={{ xs: 1, sm: 2 }}>
            <NodeStatisticLabel>Participated by me</NodeStatisticLabel>
            <NodeStatisticBody>1</NodeStatisticBody>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={{ xs: 2, sm: 5 }}
          px={1}
          sx={{ width: '100%', margin: '40px auto' }}
        >
          <CustomButton onClick={() => {}}>Backup</CustomButton>
          <CustomButton onClick={() => {}}>Migrate</CustomButton>
          <CustomButton onClick={() => {}}>Unbind</CustomButton>
        </Stack>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 4, md: 5 }}
          justifyContent="space-between"
        >
          <ContainerBox>
            <Typography variant="h5">Node Summary</Typography>
            <Stack spacing={{ xs: 4, md: 5 }} mt={{ xs: 4, md: 5 }}>
              <Grid
                container
                sx={{
                  fontSize: { xs: '12px', md: '15px' },
                  textAlign: 'center',
                  color: 'rgba(0,0,0,0.3)'
                }}
              >
                <Grid item xs={2} md={2} textAlign="left">
                  Name
                </Grid>
                <Grid item xs={8} md={8}>
                  URL
                </Grid>
                <Grid item xs={2} md={2}>
                  Status
                </Grid>
              </Grid>
              {nodeItems.map((item, index) => (
                <NodeItem
                  key={`node-summary-${index}`}
                  nodeName={item.name}
                  nodeURL={item.url}
                  nodeStatus={item.status}
                />
              ))}
            </Stack>
          </ContainerBox>
          <ContainerBox>
            <Typography variant="h5">Vault Summary</Typography>
            <Stack spacing={{ xs: 4, md: 5 }} mt={{ xs: 4, md: 12 }}>
              {vaultItems.map((item, index) => (
                <VaultSummaryItem
                  key={`vault-summary-${index}`}
                  vaultName={item.name}
                  vaultTotal={item.total}
                  vaultUsed={item.used}
                />
              ))}
            </Stack>
          </ContainerBox>
        </Stack> */}
      </Stack>
    </>
  );
}
