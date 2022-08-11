import PropTypes from 'prop-types';
import { Box } from '@mui/material';

Rectangle.propTypes = {
  rotation: PropTypes.number,
  sideLength: PropTypes.number,
  borderColor: PropTypes.string,
  backColor: PropTypes.string,
  borderWidth: PropTypes.number
};

function Rectangle({ rotation, sideLength, borderColor, backColor, borderWidth }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: sideLength / 2,
        height: sideLength,
        width: sideLength * 1.732,
        backgroundColor: backColor,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        borderLeft: `${borderWidth}px solid ${borderColor}`,
        borderRight: `${borderWidth}px solid ${borderColor}`
      }}
    />
  );
}

SmallHexagon.propTypes = {
  sideLength: PropTypes.number,
  borderColor: PropTypes.string,
  children: PropTypes.node,
  backColor: PropTypes.string,
  borderWidth: PropTypes.number
};

export default function SmallHexagon({
  sideLength,
  borderColor,
  children,
  backColor,
  borderWidth = 3
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: sideLength * 1.732,
        height: sideLength * 2,
        margin: '0 auto',
        top: '-2px'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: sideLength / 2,
          height: sideLength,
          width: sideLength * 1.732,
          backgroundColor: backColor,
          borderLeft: `${borderWidth}px solid ${borderColor}`,
          borderRight: `${borderWidth}px solid ${borderColor}`,
          zIndex: 100
        }}
      >
        {children || null}
      </Box>
      <Rectangle
        rotation={60}
        sideLength={sideLength}
        backgroundColor="transparent"
        borderColor={borderColor}
        backColor={backColor}
        borderWidth={borderWidth}
      />
      <Rectangle
        rotation={300}
        sideLength={sideLength}
        backgroundColor="transparent"
        borderColor={borderColor}
        backColor={backColor}
        borderWidth={borderWidth}
      />
    </Box>
  );
}
