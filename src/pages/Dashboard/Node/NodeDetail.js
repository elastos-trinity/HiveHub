import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Chip, Stack, Avatar, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NodeTitle, HeaderTypo, NormalTypo } from '../../../components/Custom/CustomTypos';
import { ContainerBox } from '../../../components/Custom/CustomContainer';
import { ConfirmButton } from '../../../components/Custom/CustomButtons';
import { getHiveNodeInfo } from '../../../service/fetch';
import { useUserContext } from '../../../contexts/UserContext';
import useHiveHubContracts from '../../../hooks/useHiveHubContracts';

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

export default function MyNodeDetail() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { getHiveNodeItem } = useHiveHubContracts();
  const { nodeId } = useParams();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [nodeDetail, setNodeDetail] = useState({});

  const detailInfo = [
    { label: t('node-detail-did'), field: 'owner_did' },
    { label: t('node-detail-name'), field: 'ownerName' },
    { label: t('node-detail-description'), field: 'remark' },
    { label: t('node-detail-email'), field: 'email' },
    { label: t('node-detail-endpoint'), field: 'url' },
    { label: t('node-detail-created-date'), field: 'created' },
    { label: t('node-detail-version'), field: 'version' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const detail = await getHiveNodeItem(nodeId, user.did, true, true, false);
        setNodeDetail(detail || {});
        if (detail) {
          const nodeInfo = await getHiveNodeInfo(user.did, detail.url);
          if (nodeInfo?.getOwnerDid() !== user.did) navigate('/dashboard/node');
        } else navigate('/dashboard/node');
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    };
    if (user.did) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.did, nodeId]);

  return (
    <>
      <HeaderTypo sx={{ py: 1 }}>{t('node-detail-title')}</HeaderTypo>
      <Box
        sx={{ mt: { xs: 2.5, md: 5 }, position: 'relative', height: { xs: '100px', md: '200px' } }}
      >
        <Stack sx={{ height: '100%', overflow: 'hidden' }}>
          <Box
            sx={{
              display: 'inline-flex',
              height: '100%',
              background: `url('/static/img_node_detail.svg') no-repeat center`,
              backgroundSize: 'cover',
              borderRadius: '20px 20px 0px 0px'
            }}
          />
        </Stack>
      </Box>
      {isLoading ? (
        <ContainerBox sx={{ position: 'relative', borderRadius: '0px 0px 20px 20px' }}>
          <Avatar
            src={nodeDetail?.avatar || ''}
            alt="avatarURL"
            sx={{
              position: 'absolute',
              width: { xs: '50px', md: '100px' },
              height: { xs: '50px', md: '100px' },
              top: { xs: '-25px', md: '-50px' },
              left: 0,
              right: 0,
              margin: 'auto'
            }}
          />
          <Typography
            component="div"
            variant="h4"
            sx={{ mt: { xs: 2.5, md: 5 }, mx: 'auto', width: { xs: '100%', md: '40%' } }}
          >
            <Skeleton animation="wave" />
          </Typography>
          <Typography component="div" variant="h6">
            <Skeleton animation="wave" />
          </Typography>
          <Stack spacing={{ xs: 1, md: 2.5 }} mt={{ xs: 2, md: 7 }} mb={{ xs: 1, md: 4 }}>
            {detailInfo.map((_, index) => (
              <Stack key={index} direction="row" spacing={{ xs: '5px', md: '10px' }}>
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
        <ContainerBox sx={{ position: 'relative', borderRadius: '0px 0px 20px 20px' }}>
          <Avatar
            src={nodeDetail?.avatar || ''}
            alt="avatarURL"
            sx={{
              position: 'absolute',
              width: { xs: '50px', md: '100px' },
              height: { xs: '50px', md: '100px' },
              top: { xs: '-25px', md: '-50px' },
              left: 0,
              right: 0,
              margin: 'auto'
            }}
          />
          <Stack
            direction="row"
            spacing={2.5}
            alignItems="center"
            sx={{ mt: { xs: 2.5, md: 5 }, mx: 'auto', width: 'fit-content' }}
          >
            <NodeTitle>{nodeDetail?.name || '???'}</NodeTitle>
            {nodeDetail?.status ? (
              <Chip
                label={t('badge-online')}
                color="success"
                sx={{
                  height: { xs: '11px !important', md: '19px !important' },
                  color: '#FFFFFF',
                  '& .MuiChip-label': {
                    px: { xs: '5px !important', md: '12px !important' }
                  }
                }}
              />
            ) : (
              <Chip
                label={t('badge-offline')}
                color="error"
                sx={{
                  height: { xs: '11px !important', md: '19px !important' },
                  color: '#FFFFFF',
                  '& .MuiChip-label': {
                    px: { xs: '5px !important', md: '12px !important' }
                  }
                }}
              />
            )}
          </Stack>
          <NormalTypo sx={{ color: '#B3B3B3', py: 1 }}>{nodeDetail?.description || ''}</NormalTypo>
          <Stack spacing={{ xs: 1, md: 2.5 }} mt={{ xs: 2, md: 7 }} mb={{ xs: 1, md: 4 }}>
            {detailInfo.map((item, index) => (
              <DetailItem key={index} label={item.label} value={nodeDetail[item.field] || '---'} />
            ))}
          </Stack>
        </ContainerBox>
      )}
      <ConfirmButton
        onClick={() => navigate('/dashboard/node')}
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
