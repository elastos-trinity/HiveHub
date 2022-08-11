import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const BaseTypography = styled(Typography)({
  font: 'Montserrat',
  color: '#000'
});

export const LandingTitleTypo = styled(BaseTypography)(({ theme, sub }) => ({
  fontWeight: sub ? 500 : 700,
  fontSize: sub ? '35px' : '90px',
  lineHeight: sub ? '43px' : '110px',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    fontSize: sub ? '15px' : '28px',
    lineHeight: sub ? '18px' : '36px'
  }
}));

export const PageTitleTypo = styled(BaseTypography)(({ theme, sub = false }) => ({
  fontWeight: sub ? 600 : 700,
  fontSize: sub ? '30px' : '40px',
  lineHeight: sub ? '37px' : '49px',
  [theme.breakpoints.down('md')]: {
    fontSize: sub ? '15px' : '25px',
    lineHeight: sub ? '18px' : '30px'
  }
}));

export const NodeStatisticLabel = styled(BaseTypography)({
  color: 'rgba(0, 0, 0, 0.3)',
  fontWeight: 400,
  fontSize: '25px',
  textAlign: 'center',
  '@media (max-width:500px)': {
    fontSize: '12px'
  }
});

export const NodeStatisticBody = styled(BaseTypography)({
  fontWeight: 700,
  fontSize: '50px',
  textAlign: 'center',
  '@media (max-width:500px)': {
    fontSize: '25px'
  }
});

export const FilterByTypo = styled(BaseTypography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '10px',
  lineHeight: '12px',
  [theme.breakpoints.up('md')]: {
    fontSize: '20px',
    lineHeight: '24px'
  }
}));

export const NodeTitle = styled(BaseTypography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '24px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '30px',
    lineHeight: '36px'
  }
}));

export const NodeTimeLable = styled(BaseTypography)(({ theme }) => ({
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

const NormalTypo = styled(BaseTypography)(({ theme }) => ({
  fontSize: '10px',
  lineHeight: '12px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '20px',
    lineHeight: '24px'
  }
}));

export const NodeDescription = styled(NormalTypo)(({ theme }) => ({
  color: 'rgba(0,0,0, 0.3)',
  fontWeight: 400,
  fontSize: '10px',
  lineHeight: '12px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '20px',
    lineHeight: '24px'
  }
}));

export const NodeValue = styled(NormalTypo)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '10px',
  lineHeight: '12px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '20px',
    lineHeight: '24px'
  }
}));

export const VaultValue = styled(BaseTypography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '8px',
  lineHeight: '10px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '16px',
    lineHeight: '20px'
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
