import PropTypes from 'prop-types';
import { Box } from '@mui/material';

Hexagon.propTypes = {
  rootHexagon: PropTypes.bool,
  sideLength: PropTypes.number,
  borderColor: PropTypes.string,
  children: PropTypes.node
};

Rectangle.propTypes = {
  rotation: PropTypes.number,
  sideLength: PropTypes.number,
  borderColor: PropTypes.string
};

function Rectangle({ rotation, sideLength, borderColor }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: sideLength / 2,
        height: sideLength,
        width: sideLength * 1.732,
        backgroundColor: 'transparent',
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        borderLeft: `3px solid ${borderColor}`,
        borderRight: `3px solid ${borderColor}`
      }}
    />
  );
}

export default function Hexagon({ rootHexagon, sideLength, borderColor, children }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: sideLength * 1.732,
        height: sideLength * 2,
        margin: '0 auto',
        top: rootHexagon ? 0 : '43.75px'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '7px',
          top: sideLength / 2,
          height: sideLength,
          width: sideLength * 1.732,
          backgroundColor: 'transparent',
          borderLeft: `3px solid ${borderColor}`,
          borderRight: `3px solid ${borderColor}`
        }}
      />
      <Rectangle
        rotation={60}
        sideLength={sideLength}
        backgroundColor="transparent"
        borderColor={borderColor}
      />
      <Rectangle
        rotation={300}
        sideLength={sideLength}
        backgroundColor="transparent"
        borderColor={borderColor}
      />
      <Box>{children || null}</Box>
    </Box>
  );
}
