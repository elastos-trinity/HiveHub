import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { PlusButton } from '../Custom/CustomButtons';
import { FeatureGrid } from '../Custom/CustomContainer';
import { HeaderTypo, LabelTypo } from '../Custom/CustomTypos';

VaultInitialView.propTypes = {
  onClickCreateVault: PropTypes.func,
  sx: PropTypes.object
};

export default function VaultInitialView({ onClickCreateVault, sx = {} }) {
  return (
    <Box sx={{ ...sx, textAlign: 'center' }}>
      <FeatureGrid>
        <Box sx={{ margin: '30px 0 40px' }}>
          <Box
            sx={{
              width: '70px',
              height: '70px',
              lineHeight: '70px',
              margin: '0 auto',
              borderRadius: '5px',
              border: '2px solid #FF931E'
            }}
          >
            <Typography variant="h3" sx={{ color: '#FF931E', height: '70px', lineHeight: '70px' }}>
              +
            </Typography>
          </Box>
        </Box>
        <HeaderTypo sx={{ py: 1 }}>Get started with a new storage vault!</HeaderTypo>
        <LabelTypo sx={{ py: 1 }}>Create a new storage vault now!</LabelTypo>
      </FeatureGrid>
      <PlusButton
        hasPlus={false}
        width="100%"
        onClick={onClickCreateVault}
        sx={{
          mt: { xs: 4, md: 6 }
        }}
      >
        Create vault
      </PlusButton>
    </Box>
  );
}
