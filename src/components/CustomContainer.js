import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

export const FeatureGrid = styled(Grid)(({ theme }) => ({
  textAlign: 'center',
  padding: '20px 0 30px',
  fontSize: '30px',
  lineHeight: '37px',
  [theme.breakpoints.down('md')]: {
    fontSize: '15px',
    lineHeight: '18px'
  }
}));

export const NodeSummaryBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  border: '2px solid #E5E5E5',
  // boxShadow: '0px 0px 10px rgba(255, 147, 30, 0.3)',
  borderRadius: '18px',
  width: '100%',
  padding: '15px 20px',
  [theme.breakpoints.up('md')]: {
    padding: '20px 30px'
  }
}));

export const ContainerBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  border: '2px solid #E5E5E5',
  textAlign: 'center',
  borderRadius: '20px',
  width: '100%',
  padding: '20px 50px 20px 20px',
  [theme.breakpoints.up('md')]: {
    padding: '30px 70px'
  }
}));

export const NodeDetailBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  border: '2px solid #E5E5E5',
  textAlign: 'center',
  borderRadius: '20px',
  width: '100%',
  padding: '15px 25px 20px 20px',
  [theme.breakpoints.up('md')]: {
    padding: '30px 72px 40px 40px'
  }
}));
