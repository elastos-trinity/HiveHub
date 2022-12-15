import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Skeleton, Typography, Grid, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LabelTypo, SettingTitleTypo } from '../../Custom/CustomTypos';
import { ContainerBox } from '../../Custom/CustomContainer';
import { getTime } from '../../../service/common';

DappDetailBox.propTypes = {
  info: PropTypes.object,
  vaultCreationTime: PropTypes.string,
  isLoading: PropTypes.bool,
  innerSx: PropTypes.object
};

export default function DappDetailBox({
  info,
  vaultCreationTime,
  isLoading = false,
  innerSx = {}
}) {
  const { t } = useTranslation();
  const detailInfo = [
    { label: t('vault-dapp-info-app-did'), field: 'app_did' },
    { label: t('vault-dapp-info-dev-did'), field: 'developer_did' },
    { label: t('vault-dapp-info-dev-name'), field: 'developer_name' },
    { label: t('vault-dapp-info-about-dev'), field: 'about_developer' },
    { label: t('vault-dapp-info-access-no'), field: 'access_count' },
    { label: t('vault-dapp-info-data-traffic'), field: 'access_amount' },
    { label: t('vault-dapp-info-last-access'), field: 'access_last_time' }
  ];

  return (
    <ContainerBox
      sx={{
        position: 'relative',
        borderRadius: '20px',
        ...innerSx
      }}
    >
      {isLoading ? (
        <Stack spacing={{ xs: 1, md: 2.5 }} mt={{ xs: 0, md: 1 }} mb={{ xs: 1, md: 4 }}>
          {detailInfo.map((_, index) => (
            <Stack key={index} spacing={{ xs: '5px', md: '10px' }} textAlign="left">
              <Typography component="div" variant="h6" sx={{ width: '140px' }}>
                <Skeleton animation="wave" />
              </Typography>
              <Typography component="div" variant="h6" sx={{ width: '100%' }}>
                <Skeleton animation="wave" />
              </Typography>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Stack spacing={{ xs: 1, md: 2.5 }} mt={{ xs: 0, md: 1 }} mb={{ xs: 1, md: 4 }}>
          <Grid container direction="column">
            {detailInfo.map((item, _i) => {
              let value;
              if (item.field === 'access_last_time') {
                if (info[item.field] === -1) value = vaultCreationTime;
                else {
                  const timestamp = getTime(info[item.field] * 1000);
                  value = `${timestamp.date} ${timestamp.time}`;
                }
              } else if (item.field === 'access_amount' || item.field === 'access_count')
                value = info[item.field] ?? 0;
              else value = info[item.field] || 'Not available';
              return (
                <Grid item key={_i} pt={_i ? 2 : 0}>
                  <SettingTitleTypo sx={{ fontWeight: 700, textAlign: 'left' }}>
                    {item.label}
                  </SettingTitleTypo>
                  <LabelTypo
                    my={1}
                    ml={0.5}
                    sx={{ color: 'rgba(196, 196, 196, 0.5)', textAlign: 'left' }}
                  >
                    {value}
                  </LabelTypo>
                  <Divider sx={{ border: '1px solid #323B45' }} />
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      )}
    </ContainerBox>
  );
}
