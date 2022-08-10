import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PlusTypography } from './CustomTypos';

export const ConnectWalletButton = styled(Button)(({ theme }) => ({
  color: '#FF931E',
  font: 'Montserrat',
  border: '3px solid #FF931E',
  fontWeight: 600,
  borderRadius: '200px',
  fontSize: '25px',
  lineHeight: '30px',
  padding: '20px 30px',
  zIndex: 10,
  '&:hover': {
    border: '3px solid #FF931E',
    backgroundColor: 'white'
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
    lineHeight: '15px',
    padding: '10px 15px',
    border: '2px solid #FF931E',
    '&:hover': {
      border: '2px solid #FF931E',
      backgroundColor: 'white'
    }
  }
}));

export const GitHubButton = styled(Button)(({ theme }) => ({
  color: '#000000',
  font: 'Montserrat',
  border: '3px solid #000000',
  fontWeight: 600,
  borderRadius: '200px',
  fontSize: '25px',
  lineHeight: '30px',
  padding: '20px 30px',
  zIndex: 10,
  '&:hover': {
    border: '3px solid #000000',
    backgroundColor: 'white'
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
    lineHeight: '15px',
    padding: '10px 15px',
    border: '2px solid #000000',
    '&:hover': {
      border: '2px solid #000000',
      backgroundColor: 'white'
    }
  }
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FFF',
  // height: '50px',
  width: 'fit-content',
  border: '1px solid #FF931E',
  borderRadius: '200px',
  padding: '15px 11px',
  color: '#FF931E',
  fontWeight: 600,
  lineHeight: '18px',
  fontSize: '15px',
  [theme.breakpoints.up('sm')]: {
    height: '70px',
    lineHeight: '24px',
    fontSize: '20px',
    border: '2px solid #FF931E',
    padding: '23px 17px'
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 147, 30, 0.3)',
    color: '#FFF'
  }
}));

export const CustomButton = styled(Button)({
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

PlusButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  hasPlus: PropTypes.bool,
  children: PropTypes.node
};

export function PlusButton({ onClick, disabled, hasPlus = true, children }) {
  return (
    <OutlinedButton
      sx={{ height: { xs: '30px', md: '70px' } }}
      onClick={onClick}
      disabled={disabled}
    >
      {hasPlus && <PlusTypography>+</PlusTypography>}
      {children}
    </OutlinedButton>
  );
}

export const ConfirmButton = styled(Button)(({ theme }) => ({
  borderRadius: '200px',
  backgroundColor: '#FF931E',
  color: 'white',
  fontWeight: 600,
  lineHeight: '12px',
  fontSize: '10px',
  height: '30px',
  padding: '9px 38px',
  width: '120px',
  [theme.breakpoints.up('md')]: {
    lineHeight: '24px',
    fontSize: '20px',
    height: '60px',
    padding: '17px 68px',
    width: '200px'
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 147, 30, 0.7)'
  }
}));

export const DestroyVaultButton = styled(Button)(({ theme }) => ({
  borderRadius: '200px',
  backgroundColor: '#B3B3B3',
  color: 'white',
  fontWeight: 600,
  lineHeight: '12px',
  fontSize: '7px',
  // height: '9px',
  padding: '7px 15px',
  [theme.breakpoints.up('sm')]: {
    lineHeight: '18px',
    fontSize: '15px',
    // height: '44px',
    padding: '13px 25px'
  },
  '&:hover': {
    backgroundColor: 'rgba(179, 179, 179, 0.7)'
  }
}));
