import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import NodeItem from '../../../components/NodeItem';
import { PageTitleTypo } from './style';

const CustomTypography = styled(Typography)({
  color: 'rgba(0,0,0, 0.3)',
  fontSize: '18px',
  marginBottom: '10px'
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

const ContainerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
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
  [theme.breakpoints.up('md')]: {
    width: '48%'
  }
}));

export default function HiveHome() {
  const theme = useTheme();
  const matchMdDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <PageTitleTypo sx={{ mt: 16, mb: 8 }}>Home</PageTitleTypo>
      <PageTitleTypo sub sx={{ my: 4 }}>Hive Node Statistics</PageTitleTypo>
      <Stack
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        sx={{
          width: '100%',
          height: '200px',
          // boxShadow: '0px 0px 10px rgba(255, 147, 30, 0.3)',
          border: '2px solid #E5E5E5',
          borderRadius: '20px',
          backgroundColor: 'white',
          boxSizing: 'border-box'
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
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ width: '60%', margin: '40px auto' }}
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
