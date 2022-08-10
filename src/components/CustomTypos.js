import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const LandingTitleTypo = styled(Typography)(({ theme, sub }) => ({
  font: 'Montserrat',
  color: '#000',
  fontWeight: sub ? 500 : 700,
  fontSize: sub ? '35px' : '90px',
  lineHeight: sub ? '43px' : '110px',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    fontSize: sub ? '15px' : '28px',
    lineHeight: sub ? '18px' : '36px'
  }
}));

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

export const PlusTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  lineHeight: '37px',
  fontSize: '30px',
  marginRight: '5px',
  [theme.breakpoints.up('md')]: {
    lineHeight: '43px',
    fontSize: '35px'
  }
}));
