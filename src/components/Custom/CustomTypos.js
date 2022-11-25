import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const BaseTypography = styled(Typography)({
  font: 'Montserrat',
  color: '#FFF',
  fontStyle: 'normal'
});

export const LandingTitleTypo = styled(BaseTypography)(({ theme, sub = false }) => ({
  fontWeight: 700,
  fontSize: sub ? '60px' : '90px',
  lineHeight: sub ? '73px' : '110px',
  textAlign: 'center',
  margin: sub ? '20px 0 40px' : '10px 0',
  [theme.breakpoints.down('md')]: {
    fontSize: sub ? '20px' : '28px',
    lineHeight: sub ? '24px' : '36px'
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
  color: '#FF931E',
  fontWeight: 400,
  fontSize: '10px',
  lineHeight: '12px',
  textAlign: 'right',
  [theme.breakpoints.up('sm')]: {
    fontSize: '15px',
    lineHeight: '18px'
  }
}));

export const HeaderTypo = styled(BaseTypography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '12px',
  lineHeight: '15px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '25px',
    lineHeight: '30px'
  }
}));

export const NormalTypo = styled(BaseTypography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '10px',
  lineHeight: '12px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '20px',
    lineHeight: '24px'
  }
}));

export const LabelTypo = styled(BaseTypography)(({ theme }) => ({
  color: '#C4C4C4',
  fontWeight: 400,
  fontSize: '8px',
  lineHeight: '9px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '15px',
    lineHeight: '18px'
  }
}));

export const BadgeTypo = styled(BaseTypography)(({ theme }) => ({
  background: 'rgba(255, 147, 30, 0.1)',
  borderRadius: '30px',
  padding: '10px 25px',
  color: '#FF931E',
  fontWeight: 500,
  width: 'fit-content',
  fontSize: '10px',
  lineHeight: '12px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '18px',
    lineHeight: '22px'
  }
}));

export const NodeDescription = styled(NormalTypo)({
  color: '#B3B3B3'
});

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

export const DialogTitleTypo = styled(Typography)({
  fontSize: '42px',
  fontWeight: 700,
  lineHeight: '44px',
  textAlign: 'center',
  textTransform: 'capitalize'
});
