import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Box, Button, Chip, Grid, Stack, Tab, Tabs, Typography, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import VaultSummaryItem from '../../../components/VaultSummaryItem';
import { createVault, getHiveNodesList, getHiveVaultInfo } from '../../../service/fetch';
import { emptyNodeItem, emptyVaultItem } from '../../../utils/filler';
import useUser from '../../../hooks/useUser';

const NodeTitle = styled(Typography)(({ theme }) => ({
  color: '#000',
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '24px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '30px',
    lineHeight: '36px'
  }
}));

const NodeTimeLable = styled(Typography)(({ theme }) => ({
  color: 'rgba(0,0,0, 0.3)',
  fontWeight: 400,
  fontSize: '10px',
  lineHeight: '12px',
  textAlign: 'right',
  [theme.breakpoints.up('sm')]: {
    fontSize: '15px',
    lineHeight: '18px'
  }
}));

const ContainerBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  border: '2px solid #E5E5E5',
  textAlign: 'center',
  borderRadius: '20px',
  width: '100%',
  padding: '15px 25px 20px 20px',
  [theme.breakpoints.up('md')]: {
    padding: '30px 72px 40px 40px'
  }
}));

const NodeDescription = styled(Typography)(({ theme }) => ({
  color: 'rgba(0,0,0, 0.3)',
  fontWeight: 400,
  fontSize: '10px',
  lineHeight: '12px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '20px',
    lineHeight: '24px'
  }
}));

const NodeValue = styled(Typography)(({ theme }) => ({
  color: '#000',
  fontWeight: 600,
  fontSize: '10px',
  lineHeight: '12px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '20px',
    lineHeight: '24px'
  }
}));

const DestroyVaultButton = styled(Button)(({ theme }) => ({
  borderRadius: '200px',
  backgroundColor: '#B3B3B3',
  color: 'white',
  fontWeight: 600,
  lineHeight: '12px',
  fontSize: '7px',
  // height: '9px',
  padding: '7px 15px',
  [theme.breakpoints.up('sm')]: {
    lineHeight: '18px',
    fontSize: '15px',
    // height: '44px',
    padding: '13px 25px'
  },
  '&:hover': {
    backgroundColor: 'rgba(179, 179, 179, 0.7)'
  }
}));

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#fff',
  height: '50px',
  width: 'fit-content',
  color: '#FF931E',
  border: '1px solid #FF931E',
  borderRadius: '200px',
  fontWeight: 600,
  lineHeight: '18px',
  fontSize: '15px',
  padding: '15px 11px',
  [theme.breakpoints.up('sm')]: {
    height: '70px',
    lineHeight: '24px',
    fontSize: '20px',
    padding: '23px 17px',
    border: '2px solid #FF931E'
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 147, 30, 0.3)',
    color: '#fff'
  }
}));

const PlusTypo = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  lineHeight: '37px',
  fontSize: '30px',
  marginRight: '5px',
  [theme.breakpoints.up('md')]: {
    lineHeight: '43px',
    fontSize: '35px'
  }
}));

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

function InfoItem({ label, value }) {
  return (
    <Grid item lg={6} md={12} sm={12} xs={12} sx={{ textAlign: 'left', mb: 2 }}>
      <Typography component="div" variant="body1" noWrap>
        <Stack direction="row" spacing={{ xs: '5px', sm: '10px' }}>
          <NodeDescription>{label}:</NodeDescription>
          <NodeValue noWrap>{value}</NodeValue>
        </Stack>
      </Typography>
    </Grid>
  );
}

export default function NodeDetail() {
  const { user } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [nodeDetail, setNodeDetail] = useState(emptyNodeItem);
  const [vaultItems, setVaultItems] = useState([emptyVaultItem]);
  const [value, setValue] = useState('vault');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { nodeId } = useParams();

  useEffect(async () => {
    setLoading(true);
    const details = await getHiveNodesList(nodeId, undefined, false);
    setNodeDetail(details.length ? details[0] : undefined);
    const vaultItem = await getHiveVaultInfo(user.did, details.length ? details[0].url : undefined);
    if (vaultItem) {
      setVaultItems([vaultItem]);
    } else setVaultItems([]);
    setLoading(false);
  }, []);

  const handleCreateVault = () => {
    if (user.nodeProvider !== nodeDetail.url) {
      enqueueSnackbar('You are connected to invalid Hive Node, Please Select another one.', {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
      return;
    }
    createVault(user.did, nodeDetail.url)
      .then((res) => {
        if (res)
          enqueueSnackbar('Create vault succeed', {
            variant: 'success',
            anchorOrigin: { horizontal: 'right', vertical: 'top' }
          });
        else
          enqueueSnackbar('Vault already exists', {
            variant: 'error',
            anchorOrigin: { horizontal: 'right', vertical: 'top' }
          });
      })
      .catch((e) => {
        enqueueSnackbar('Create vault error', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
      });
  };

  return (
    <>
      {loading ? (
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          sx={{
            bgcolor: '#E8F4FF',
            borderRadius: 1,
            height: { xs: '40px', md: '70px' },
            mt: { xs: 6.25, md: 3.15 },
            mb: 2.5
          }}
        />
      ) : (
        <>
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: '10px', sm: '20px' }}
            mt={{ xs: 6.25, md: 3.15 }}
          >
            <NodeTitle>{nodeDetail.name}</NodeTitle>
            {nodeDetail.status ? (
              <Chip
                label="online"
                color="success"
                sx={{
                  height: { xs: '11px !important', md: '19px !important' },
                  color: 'white',
                  '& .MuiChip-label': {
                    px: { xs: '5px !important', sm: '12px !important' }
                  }
                }}
              />
            ) : (
              <Chip
                label="offline"
                sx={{
                  height: { xs: '11px !important', md: '19px !important' },
                  color: 'black',
                  '& .MuiChip-label': {
                    px: { xs: '5px !important', sm: '12px !important' }
                  }
                }}
              />
            )}
          </Stack>
          <NodeTimeLable
            sx={{ whiteSpace: 'nowrap', textAlign: 'left', mt: { xs: '5px', md: '10px' }, mb: 2.5 }}
          >
            {nodeDetail.created}
          </NodeTimeLable>
        </>
      )}
      {loading ? (
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          sx={{ bgcolor: '#E8F4FF', borderRadius: 1, height: { xs: '500px', md: '800px' } }}
        />
      ) : (
        <ContainerBox>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <NodeDescription>{nodeDetail.remark}</NodeDescription>
            <DestroyVaultButton>Destroy Vault</DestroyVaultButton>
          </Stack>
          <Grid container sx={{ mt: { xs: '43px', md: '77px' } }}>
            <InfoItem label="IP" value={nodeDetail.ip} />
            <InfoItem label="Owner DID" value={nodeDetail.owner_did} />
            <InfoItem label="Country/Region" value={nodeDetail.area} />
            <InfoItem label="Email" value={nodeDetail.email} />
            <InfoItem label="URL" value={nodeDetail.url} />
          </Grid>
          <Tabs
            // centered
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            textColor="inherit"
            // aria-label="secondary tabs example"
            TabIndicatorProps={{
              sx: {
                backgroundColor: 'black'
              }
            }}
            sx={{
              marginTop: { xs: '57px', md: '96px' },
              fontSize: { xs: '12px', md: '25px' },
              lineHeight: { xs: '15px', md: '30px' },
              fontWeight: 700
            }}
          >
            <Tab value="vault" label="Vault Service" />
            <Tab value="backup" label="Backup Service" />
          </Tabs>
          {value === 'vault' ? (
            <Box
              sx={{ mt: { xs: 5, md: 12.5 }, width: '100%', height: '300px', textAlign: 'left' }}
            >
              <Stack mt={{ xs: 1.75, md: 5 }} mb={6.25} spacing={{ xs: 3.75, md: 6.25 }}>
                {vaultItems.map((item, index) => (
                  <VaultSummaryItem
                    key={`node-detail-vault-summary-${index}`}
                    vaultName={item.name}
                    vaultTotal={item.total}
                    vaultUsed={item.used}
                    isLoading={loading}
                  />
                ))}
              </Stack>
              <CustomButton
                sx={{ height: { xs: '30px', md: '70px' } }}
                onClick={handleCreateVault}
                disabled={vaultItems.length > 0}
              >
                <PlusTypo>+</PlusTypo>
                Add Vault
              </CustomButton>
            </Box>
          ) : (
            <Box
              sx={{ mt: { xs: 5, md: 9.375 }, width: '100%', height: '300px', textAlign: 'left' }}
            >
              <VaultSummaryItem
                vaultName={nodeDetail.vaultName}
                vaultTotal={nodeDetail.total}
                vaultUsed={nodeDetail.used}
              />
            </Box>
          )}
        </ContainerBox>
      )}
    </>
  );
}
