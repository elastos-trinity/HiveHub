import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack, Skeleton, Typography, Divider, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  HeaderTypo,
  NormalTypo,
  LabelTypo,
  SettingTitleTypo
} from '../../../components/Custom/CustomTypos';
import { ContainerBox } from '../../../components/Custom/CustomContainer';
import { ConfirmButton } from '../../../components/Custom/CustomButtons';
import DappBox from '../../../components/Dashboard/Vault/DappBox';
import { getDappsOnVault, getHiveVaultInfo } from '../../../service/fetch';
import { getTime } from '../../../service/common';
import { useUserContext } from '../../../contexts/UserContext';

function DetailItem({ label, value }) {
  return (
    <Stack direction="row" spacing={{ xs: '5px', md: '10px' }}>
      <NormalTypo sx={{ py: 1, color: '#FF931E', width: '140px', textAlign: 'left' }}>
        {label}:
      </NormalTypo>
      <NormalTypo sx={{ py: 1, color: '#FFF' }} noWrap>
        {value}
      </NormalTypo>
    </Stack>
  );
}

DetailItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string
};

export default function DappDetail() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { appDid } = useParams();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [dappDetail, setDappDetail] = useState({});
  const [myVault, setMyVault] = useState(null);

  const detailInfo = [
    { label: t('vault-dapp-info-app-did'), field: 'app_did' },
    { label: t('vault-dapp-info-dev-did'), field: 'developer_did' },
    { label: t('vault-dapp-info-dev-name'), field: 'developer_name' },
    { label: t('vault-dapp-info-about-dev'), field: 'about_developer' },
    { label: t('vault-dapp-info-access-no'), field: 'access_count' },
    { label: t('vault-dapp-info-data-traffic'), field: 'access_amount' },
    { label: t('vault-dapp-info-last-access'), field: 'access_last_time' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const vaultItem = await getHiveVaultInfo(user.did, undefined, 1);
        if (vaultItem) {
          setMyVault(vaultItem);
          const dapps = await getDappsOnVault(user.did, undefined);
          const data = (dapps || []).find((item) => item.app_did === appDid);
          setDappDetail(data || {});
        }
      } catch (e) {
        console.error(`Failed to load my dapp info: ${e}`);
        setMyVault(null);
      }
      setIsLoading(false);
    };
    if (user.did) fetchData();
    else navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.did]);

  // console.log('=====', dappDetail);

  return (
    <>
      <HeaderTypo sx={{ py: 1 }}>{t('vault-dapp-title')}</HeaderTypo>
      <DappBox
        name={dappDetail?.name || ''}
        description="Decentralized social web3"
        appDid={dappDetail?.app_did || ''}
        avatar={dappDetail?.icon_url || ''}
        used={((dappDetail?.used_storage_size ?? 0) / 1024 / 1024).toFixed(2) * 1.0}
        redirect={dappDetail?.redirect_url || ''}
        total={myVault?.total ?? 0}
        isLoading={isLoading}
        innerSx={{ mt: { xs: 2.5, md: 5 }, mb: 3 }}
      />
      <HeaderTypo sx={{ py: 1 }}>{t('vault-dapp-information')}</HeaderTypo>

      {isLoading ? (
        <ContainerBox
          sx={{
            position: 'relative',
            borderRadius: '20px',
            mt: { xs: 2.5, md: 5 },
            mb: 3
          }}
        >
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
        </ContainerBox>
      ) : (
        <ContainerBox
          sx={{
            position: 'relative',
            borderRadius: '20px',
            mt: { xs: 2.5, md: 5 },
            mb: 3
          }}
        >
          <Stack spacing={{ xs: 1, md: 2.5 }} mt={{ xs: 0, md: 1 }} mb={{ xs: 1, md: 4 }}>
            <Grid container direction="column">
              {detailInfo.map((item, _i) => {
                let value;
                if (item.field === 'access_last_time') {
                  if (dappDetail[item.field] === -1) value = '---';
                  else {
                    const timestamp = getTime(dappDetail[item.field]);
                    value = `${timestamp.date} ${timestamp.time}`;
                  }
                } else if (item.field === 'access_amount' || item.field === 'access_count')
                  value = dappDetail[item.field] ?? 0;
                else value = dappDetail[item.field] || '---';
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
        </ContainerBox>
      )}
      <ConfirmButton
        onClick={() => navigate('/dashboard/vault')}
        sx={{
          mt: { xs: 2.5, md: 5 },
          color: '#FF931E',
          background: 'transparent',
          border: { xs: '1px solid #FF931E', md: '2px solid #FF931E' }
        }}
      >
        {t('btn-back')}
      </ConfirmButton>
    </>
  );
}
