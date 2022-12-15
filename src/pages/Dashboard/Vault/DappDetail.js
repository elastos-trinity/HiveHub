import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { HeaderTypo, NormalTypo } from '../../../components/Custom/CustomTypos';
import { ConfirmButton } from '../../../components/Custom/CustomButtons';
import DappSummaryBox from '../../../components/Dashboard/Vault/DappSummaryBox';
import DappDetailBox from '../../../components/Dashboard/Vault/DappDetailBox';
import {
  getCredentialsFromDID,
  getDappsOnVault,
  getDIDDocumentFromDID,
  getHiveVaultInfo
} from '../../../service/fetch';
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const vaultItem = await getHiveVaultInfo(user.did, undefined, 1);
        setMyVault(vaultItem);
        if (vaultItem) {
          const dapps = await getDappsOnVault(user.did, undefined);
          const data = (dapps || []).find((item) => item.app_did === appDid);
          if (data) {
            try {
              const appDidDoc = await getDIDDocumentFromDID(data.app_did);
              const appCredentials = appDidDoc.getCredentials();
              if (appCredentials.length) {
                const devDid = appCredentials[0].getSubject()?.getProperty('developer')?.did || '';
                const appDescription = appCredentials[0].getSubject()?.getProperty('bio') || '';
                if (devDid) {
                  const devCredentials = await getCredentialsFromDID(devDid);
                  const devName = devCredentials?.name || '';
                  const devBio = devCredentials?.bio || '';
                  setDappDetail({
                    ...data,
                    developer_did: devDid,
                    app_description: appDescription,
                    developer_name: devName,
                    about_developer: devBio
                  });
                } else
                  setDappDetail({
                    ...data,
                    developer_did: devDid,
                    app_description: appDescription
                  });
              } else setDappDetail({ ...data });
            } catch (e) {
              console.error(`Failed to load dev credentials: ${e}`);
              setDappDetail({ ...data });
            }
          } else setDappDetail({});
        }
      } catch (e) {
        console.error(`Failed to load my dapp info: ${e}`);
        setMyVault(null);
        setDappDetail({});
      }
      setIsLoading(false);
    };
    if (user.did) fetchData();
    else navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.did]);

  return (
    <>
      <HeaderTypo sx={{ py: 1 }}>{t('vault-dapp-title')}</HeaderTypo>
      <DappSummaryBox
        name={dappDetail?.name || ''}
        description={dappDetail?.app_description || ''}
        appDid={dappDetail?.app_did || ''}
        avatar={dappDetail?.icon_url || ''}
        used={((dappDetail?.used_storage_size ?? 0) / 1024 / 1024).toFixed(2) * 1.0}
        redirect={dappDetail?.redirect_url || ''}
        total={myVault?.total ?? 0}
        isLoading={isLoading}
        innerSx={{ mt: { xs: 2.5, md: 5 }, mb: 3 }}
      />
      <HeaderTypo sx={{ py: 1 }}>{t('vault-dapp-information')}</HeaderTypo>
      <DappDetailBox
        info={dappDetail}
        vaultCreationTime={myVault?.time || ''}
        isLoading={isLoading}
        innerSx={{ mt: { xs: 2.5, md: 5 }, mb: 3 }}
      />
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
