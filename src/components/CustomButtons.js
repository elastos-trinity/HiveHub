import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PlusTypography } from './CustomTypos';

export const LinkButton = styled(Button)(({ theme, btncolor }) => ({
  color: btncolor,
  border: `3px solid ${btncolor}`,
  borderRadius: '200px',
  font: 'Montserrat',
  fontWeight: 600,
  fontSize: '25px',
  lineHeight: '30px',
  padding: '20px 30px',
  zIndex: 10,
  '&:hover': {
    border: `3px solid ${btncolor}`,
    backgroundColor: 'white'
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
    lineHeight: '15px',
    padding: '10px 15px',
    border: `2px solid ${btncolor}`,
    '&:hover': {
      border: `2px solid ${btncolor}`,
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
  fontSize: '15px',
  lineHeight: '18px',
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

export const AccessButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF931E',
  height: '25px',
  padding: '6px 14px',
  borderRadius: '200px',
  boxSizing: 'border-box',
  color: '#FFF',
  fontSize: '10px',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: 'rgba(255, 147, 30, 0.3)',
    color: '#fff'
  },
  [theme.breakpoints.up('sm')]: {
    height: '45px',
    fontSize: '15px',
    padding: '13px 29px'
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

const buttonStyles = {
  primary: {
    bgColor: '#1890ff',
    hoverBgColor: '#28a0ff',
    color: 'white'
  },
  secondary: {
    bgColor: '#e8f4ff',
    hoverBgColor: '#d8e4ef',
    color: '#1890ff'
  },
  pink: {
    bgColor: '#fdeeee',
    hoverBgColor: '#fddede',
    color: '#eb5757'
  },
  green: {
    bgColor: '#C9F5DC',
    hoverBgColor: '#B9FFCC',
    color: '#1EA557'
  },
  none: {
    bgColor: 'transparent',
    hoverBgColor: 'transparent',
    color: '#1890FF'
  }
};

export const BaseButton = styled(Button)(({ size }) => ({
  height: size === 'small' ? '40px' : '56px',
  borderRadius: size === 'small' ? '12px' : '16px',
  fontSize: size === 'small' ? '16px' : '18px',
  fontWeight: 700
}));

export const PrimaryButton = styled(BaseButton)(({ btncolor = 'primary' }) => ({
  background: buttonStyles[btncolor].bgColor,
  color: buttonStyles[btncolor].color,
  '&:hover': {
    background: buttonStyles[btncolor].hoverBgColor
  }
}));
