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
