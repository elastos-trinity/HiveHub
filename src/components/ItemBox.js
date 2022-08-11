import PropTypes from 'prop-types';
import { NodeTimeLable } from './CustomTypos';
import { CustomBox } from './CustomContainer';

ItemBox.propTypes = {
  time: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  sx: PropTypes.any,
  onClick: PropTypes.func
};

export default function ItemBox({ time, children, onClick, sx }) {
  return (
    <CustomBox
      onClick={onClick}
      sx={{
        padding: { xs: '10px 10px 10px 20px', sm: '20px 20px 20px 40px' },
        position: 'relative',
        ...sx
      }}
    >
      <NodeTimeLable
        sx={{
          whiteSpace: 'nowrap',
          position: 'absolute',
          right: { xs: '10px', sm: '20px' },
          top: { xs: '10px', sm: '30px' }
        }}
      >
        {time}
      </NodeTimeLable>
      {children}
    </CustomBox>
  );
}
