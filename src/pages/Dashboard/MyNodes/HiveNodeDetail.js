import { Box, Button, Chip, Grid, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

const ContainerBox = styled(Box)({
  backgroundColor: '#fff',
  boxShadow: '0px 0px 10px rgba(255, 147, 30, 0.3)',
  textAlign: 'center',
  borderRadius: '18px',
  height: '770px',
  width: '100%',
  marginBottom: '20px',
  padding: '30px'
});

const CustomButton = styled(Button)({
  backgroundColor: '#fff',
  boxShadow: '0px 0px 10px rgba(255, 147, 30, 0.3)',
  width: '180px',
  height: '50px',
  color: '#FF931E',
  borderRadius: '25px',
  fontSize: '15px',
  fontWeight: 'bold',
  padding: '10px'
});

function InfoItem({ label, value }) {
  return (
    <Grid item lg={6} md={12} sm={12} xs={12} sx={{ textAlign: 'left', mb: 2 }}>
      <Typography variant="body1">
        <Box component="span" sx={{ color: 'rgba(0,0,0,0.3)', mr: 1 }}>
          {label}:
        </Box>
        {value}
      </Typography>
    </Grid>
  );
}

export default function HiveNodeDetail() {
  const [value, setValue] = React.useState('vault');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { nodeId } = useParams();
  console.log(nodeId);

  const nodeInfo = {
    nodeName: 'Node A',
    nodeStatus: true,
    date: '2022-01-01 20:00:00',
    nodeDescription: 'This is a local hive node',
    nodeIP: '192.115.24.2',
    region: 'China Shanghai Pudong',
    email: 'abc@hivehub.xyz',
    url: 'https://hivehub.xyz',
    ownerDID: 'did:elastos:ikkFHgoUHrVDTU8HTYDAWH9Z8S377Qvt7n'
  };

  return (
    <>
      <Box sx={{ mt: 8, mb: 1 }}>
        <Typography variant="h3">
          {nodeInfo.nodeName}
          <Box component="span" sx={{ marginLeft: '20px' }}>
            {nodeInfo.nodeStatus ? (
              <Chip label="online" color="success" sx={{ height: '20px', color: 'white' }} />
            ) : (
              <Chip label="offline" sx={{ height: '20px' }} />
            )}
          </Box>
        </Typography>
      </Box>

      <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.3)', mb: 3 }}>
        {nodeInfo.date}
      </Typography>

      <ContainerBox>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.3)' }}>
            {nodeInfo.nodeDescription}
          </Typography>
          <Button
            variant="contained"
            disabled
            sx={{
              color: 'white',
              borderRadius: '30px',
              width: '120px',
              fontWeight: 'normal'
            }}
          >
            Destroy Vault
          </Button>
        </Stack>

        <Grid container sx={{ my: 8 }}>
          <InfoItem label="IP" value={nodeInfo.nodeIP} />
          <InfoItem label="Owner DID" value={nodeInfo.ownerDID} />
          <InfoItem label="Country/Region" value={nodeInfo.region} />
          <InfoItem label="Email" value={nodeInfo.email} />
          <InfoItem label="URL" value={nodeInfo.url} />
        </Grid>

        <Tabs
          centered
          value={value}
          onChange={handleChange}
          textColor="inherit"
          aria-label="secondary tabs example"
          TabIndicatorProps={{
            sx: {
              backgroundColor: 'black'
            }
          }}
        >
          <Tab value="vault" label="Vault Service" sx={{ width: '500px' }} />
          <Tab value="backup" label="Backup Service" sx={{ width: '500px' }} />
        </Tabs>

        {value === 'vault' ? (
          <Box sx={{ my: 4, width: '100%', height: '300px', lineHeight: '300px' }}>
            <CustomButton>
              <Box
                component="span"
                sx={{ fontSize: '25px', display: 'inline-block', marginRight: '8px' }}
              >
                +
              </Box>
              Create Vault
            </CustomButton>
          </Box>
        ) : (
          <Box sx={{ my: 4, width: '100%', height: '300px', lineHeight: '300px' }}>
            <CustomButton>
              <Box
                component="span"
                sx={{ fontSize: '25px', display: 'inline-block', marginRight: '8px' }}
              >
                +
              </Box>
              Create Backup
            </CustomButton>
          </Box>
        )}
      </ContainerBox>
    </>
  );
}
