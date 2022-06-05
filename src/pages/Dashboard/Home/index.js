import { Box, Button, Chip, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const CustomTypography = styled(Typography)({
  color: 'rgba(0,0,0, 0.3)',
  fontSize: '18px',
  marginBottom: '10px'
});

const CustomButton = styled(Button)({
  backgroundColor: '#fff',
  boxShadow: '0px 0px 10px rgba(255, 147, 30, 0.3)',
  width: '160px',
  height: '40px',
  color: '#000',
  borderRadius: '18px',
  fontSize: '17px',
  fontWeight: 'bold',
  padding: '10px',

  '&:hover': {
    backgroundColor: 'rgba(255, 147, 30, 0.3)',
    color: '#fff'
  }
});

const ContainerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row'
  }
}));

const CustomBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  boxShadow: '0px 0px 10px rgba(255, 147, 30, 0.3)',
  borderRadius: '18px',
  height: '460px',
  width: '100%',
  marginBottom: '20px',
  padding: '10px 20px',
  [theme.breakpoints.up('lg')]: {
    width: '48%'
  }
}));

NodeItem.prototype = {
  nodeName: PropTypes.string,
  nodeURL: PropTypes.string,
  nodeStatus: PropTypes.bool
};

function NodeItem({ nodeName, nodeURL, nodeStatus }) {
  return (
    <Grid container sx={{ height: '35px', textAlign: 'center' }}>
      <Grid item lg={2} md={2} sm={2} xs={2}>
        <Typography
          variant="body1"
          sx={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'left', lineHeight: '35px' }}
        >
          {nodeName}
        </Typography>
      </Grid>
      <Grid item lg={8} md={8} sm={8} xs={8}>
        <Typography
          variant="body1"
          sx={{ fontSize: '13px', fontWeight: 'bold', lineHeight: '35px' }}
        >
          {nodeURL}
        </Typography>
      </Grid>
      <Grid item lg={2} md={2} sm={2} xs={2} sx={{ height: '35px', lineHeight: '35px' }}>
        {nodeStatus ? (
          <Chip label="online" color="success" sx={{ height: '25px', color: 'white' }} />
        ) : (
          <Chip label="offline" sx={{ height: '25px' }} />
        )}
      </Grid>
    </Grid>
  );
}

export default function HiveHome() {
  return (
    <>
      <Box sx={{ my: 8 }}>
        <Typography variant="h3">Home</Typography>
      </Box>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4">Hive Node Statistics</Typography>
      </Box>
      <Stack
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        sx={{
          width: '100%',
          height: '200px',
          boxShadow: '0px 0px 10px rgba(255, 147, 30, 0.3)',
          borderRadius: '14px',
          backgroundColor: 'white'
        }}
      >
        <Box>
          <CustomTypography variant="body1">Created by me</CustomTypography>
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            2
          </Typography>
        </Box>
        <Box>
          <CustomTypography variant="body1">Participated by me</CustomTypography>
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            1
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        sx={{ width: '60%', height: '80px', margin: '40px auto' }}
      >
        <CustomButton>Backup</CustomButton>
        <CustomButton>Migrate</CustomButton>
        <CustomButton>Unbind</CustomButton>
      </Stack>

      <ContainerBox>
        <CustomBox>
          <Box sx={{ height: '35px' }}>
            <Typography variant="h5">Node Summary</Typography>
          </Box>
          <Grid container sx={{ height: '35', textAlign: 'center', color: 'rgba(0,0,0,0.3)' }}>
            <Grid item lg={2} md={2} sm={2} xs={2}>
              <Typography variant="body1" sx={{ fontSize: '13px', textAlign: 'left' }}>
                Node Name
              </Typography>
            </Grid>
            <Grid item lg={8} md={8} sm={8} xs={8}>
              <Typography variant="body1" sx={{ fontSize: '13px' }}>
                URL
              </Typography>
            </Grid>
            <Grid item lg={2} md={2} sm={2} xs={2}>
              <Typography variant="body1" sx={{ fontSize: '13px' }}>
                Status
              </Typography>
            </Grid>
          </Grid>

          <NodeItem nodeName="Node A" nodeURL="http://localhost:5005" nodeStatus />
          <NodeItem nodeName="Node B" nodeURL="http://localhost:5005" nodeStatus={false} />
        </CustomBox>
        <CustomBox>
          <Box sx={{ height: '40px' }}>
            <Typography variant="h5">Vault Summary</Typography>
          </Box>
        </CustomBox>
      </ContainerBox>
    </>
  );
}
