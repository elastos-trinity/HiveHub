import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PageTitleTypo = styled(Typography)(({ theme, sub = false }) => ({
  //   fontFamily: 'Montserrat',
  //   fontStyle: 'normal',
  fontWeight: sub ? '600' : '700',
  fontSize: sub ? '30px' : '40px',
  lineHeight: sub ? '37px' : '49px',
  //   textAlign: 'center',
  color: '#000',
  //   marginBottom: '10px',
  [theme.breakpoints.down('md')]: {
    fontSize: sub ? '15px' : '25px',
    lineHeight: sub ? '18px' : '30px'
  }
}));

export const NodeStatisticLabel = styled(Typography)({
  color: 'rgba(0, 0, 0, 0.3)',
  fontWeight: 400,
  fontSize: '25px',
  textAlign: 'center',
  '@media (max-width:500px)': {
    fontSize: '12px'
  }
});

export const NodeStatisticBody = styled(Typography)({
  color: '#000',
  fontWeight: 700,
  fontSize: '50px',
  textAlign: 'center',
  '@media (max-width:500px)': {
    fontSize: '25px'
  }
});

export const FilterByTypo = styled(Typography)(({ theme }) => ({
  color: '#000',
  fontWeight: 400,
  fontSize: '10px',
  lineHeight: '12px',
  [theme.breakpoints.up('md')]: {
    fontSize: '20px',
    lineHeight: '24px'
  }
}));

export const NodeTitle = styled(Typography)(({ theme }) => ({
  color: '#000',
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '24px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '30px',
    lineHeight: '36px'
  }
}));

export const NodeTimeLable = styled(Typography)(({ theme }) => ({
  color: 'rgba(0,0,0, 0.3)',
  fontWeight: 400,
  fontSize: '10px',
  lineHeight: '12px',
  textAlign: 'right',
  [theme.breakpoints.up('sm')]: {
    fontSize: '15px',
    lineHeight: '18px'
  }
}));

export const NodeDescription = styled(Typography)(({ theme }) => ({
  color: 'rgba(0,0,0, 0.3)',
  fontWeight: 400,
  fontSize: '10px',
  lineHeight: '12px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '20px',
    lineHeight: '24px'
  }
}));

export const NodeValue = styled(Typography)(({ theme }) => ({
  color: '#000',
  fontWeight: 600,
  fontSize: '10px',
  lineHeight: '12px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '20px',
    lineHeight: '24px'
  }
}));
