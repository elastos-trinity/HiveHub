import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import SmallHexagon from '../../SmallHexagon';
import { FeatureGrid } from '../../Custom/CustomContainer';
import { HeaderTypo, LabelTypo } from '../../Custom/CustomTypos';

EmptyNodeView.propTypes = {
  sx: PropTypes.object
};

export default function EmptyNodeView({ sx = {} }) {
  return (
    <Box sx={{ ...sx }}>
      <FeatureGrid>
        <Box sx={{ margin: '20px 0 20px' }}>
          <SmallHexagon
            borderColor="#FF931E"
            rootHexagon
            sideLength={30}
            borderWidth={2}
            backColor="transparent"
          >
            <Typography variant="h3" sx={{ color: '#FFC98F', height: '30px', lineHeight: '32px' }}>
              +
            </Typography>
            <Box
              sx={{
                transform: 'rotate(300deg)',
                position: 'absolute',
                top: '-23px',
                left: '-22px'
              }}
            >
              <Box
                sx={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#FFC98F'
                }}
              />
              <Box
                sx={{
                  width: '2px',
                  height: '16px',
                  backgroundColor: '#FFC98F',
                  marginLeft: '7px'
                }}
              />
            </Box>
            <Box
              sx={{
                transform: 'rotate(120deg)',
                position: 'absolute',
                top: '21px',
                left: '53px'
              }}
            >
              <Box
                sx={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#FFC98F'
                }}
              />
              <Box
                sx={{
                  width: '2px',
                  height: '16px',
                  backgroundColor: '#FFC98F',
                  marginLeft: '7px'
                }}
              />
            </Box>
          </SmallHexagon>
        </Box>
        <HeaderTypo sx={{ py: 1 }}>No deployed nodes found!</HeaderTypo>
        <LabelTypo sx={{ py: 1 }}>
          No deployed nodes available yet.
          <br />
          Please come back later!
        </LabelTypo>
      </FeatureGrid>
    </Box>
  );
}
