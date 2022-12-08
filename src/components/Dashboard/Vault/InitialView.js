import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PlusButton } from '../../Custom/CustomButtons';
import { FeatureGrid } from '../../Custom/CustomContainer';
import { HeaderTypo, LabelTypo } from '../../Custom/CustomTypos';

VaultInitialView.propTypes = {
  onClickCreateVault: PropTypes.func,
  sx: PropTypes.object
};

export default function VaultInitialView({ onClickCreateVault, sx = {} }) {
  const { t } = useTranslation();
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
        <HeaderTypo sx={{ py: 1 }}>{t('vault-init-title')}</HeaderTypo>
        <LabelTypo sx={{ py: 1 }}>{t('vault-init-label')}</LabelTypo>
      </FeatureGrid>
      <PlusButton
        hasPlus={false}
        width="100%"
        onClick={onClickCreateVault}
        sx={{
          mt: { xs: 4, md: 6 }
        }}
      >
        {t('btn-create-vault')}
      </PlusButton>
    </Box>
  );
}
