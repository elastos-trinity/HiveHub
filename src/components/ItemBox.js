import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const ContainerBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  border: '2px solid #E5E5E5',
  borderRadius: '18px',
  width: '100%',
  padding: '10px 10px 10px 20px',
  position: 'relative',
  [theme.breakpoints.up('sm')]: {
    padding: '20px 20px 20px 40px'
  }
}));

const NodeTimeLable = styled(Typography)(({ theme }) => ({
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

ItemBox.propTypes = {
  time: PropTypes.string,
  children: PropTypes.any,
};

export default function ItemBox({ time, children }) {
  return (
    <ContainerBox>
      <NodeTimeLable
        sx={{ whiteSpace: 'nowrap', position: 'absolute', right: { xs: '10px', sm: '20px' }, top: { xs: '10px', sm: '30px' } }}
      >
        {time}
      </NodeTimeLable>
      {children}
    </ContainerBox>
  );
}
