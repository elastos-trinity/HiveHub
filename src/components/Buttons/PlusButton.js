import PropTypes from 'prop-types';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)(({ theme }) => ({
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

const PlusTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  lineHeight: '37px',
  fontSize: '30px',
  marginRight: '5px',
  [theme.breakpoints.up('md')]: {
    lineHeight: '43px',
    fontSize: '35px'
  }
}));

PlusButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  hasPlus: PropTypes.bool,
  children: PropTypes.node
};

export default function PlusButton({ onClick, disabled, hasPlus = true, children }) {
  return (
    <CustomButton sx={{ height: { xs: '30px', md: '70px' } }} onClick={onClick} disabled={disabled}>
      {hasPlus && <PlusTypography>+</PlusTypography>}
      {children}
    </CustomButton>
  );
}
