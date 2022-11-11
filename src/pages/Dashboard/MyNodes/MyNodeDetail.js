import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Chip, Grid, Stack, Tab, Tabs, Typography, Skeleton } from '@mui/material';
import { useSnackbar } from 'notistack';
import {
  NodeTitle,
  NodeTimeLable,
  NodeValue,
  NodeDescription
} from '../../../components/CustomTypos';
import { NodeDetailBox } from '../../../components/CustomContainer';
import VaultSummaryItem from '../../../components/VaultSummaryItem';
import {
  createVault,
  destroyVault,
  getHiveNodeInfo,
  getMyHiveNodeDetails
} from '../../../service/fetch';
import { emptyNodeItem, emptyVaultItem } from '../../../utils/filler';
import { useUserContext } from '../../../contexts/UserContext';
import { useDialogContext } from '../../../contexts/DialogContext';
import { PlusButton, DestroyVaultButton } from '../../../components/CustomButtons';
import useHiveHubContracts from '../../../hooks/useHiveHubContracts';
import ModalDialog from '../../../components/ModalDialog';
import ConfirmDlg from '../../../components/Dialog/ConfirmDlg';

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

function InfoItemOwnerName({ label, value, value2 }) {
  const isOwnerName = !value2.startsWith('did:elastos:');
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    if (isOwnerName) setIsHovering(true);
  };
  const handleMouseOut = () => {
    if (isOwnerName) setIsHovering(false);
  };
  return (
    <Grid item lg={6} md={12} sm={12} xs={12} sx={{ textAlign: 'left', mb: 2 }}>
      <Typography component="div" variant="body1" noWrap>
        <Stack direction="row" spacing={{ xs: '5px', sm: '10px' }}>
          <NodeDescription>{label}:</NodeDescription>
          <NodeValue noWrap onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            {isHovering ? value : value2}
          </NodeValue>
        </Stack>
      </Typography>
    </Grid>
  );
}

export default function MyNodeDetail() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { dlgState, setDlgState } = useDialogContext();
  const { getHiveNodesList } = useHiveHubContracts();
  const { nodeId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [nodeDetail, setNodeDetail] = useState(emptyNodeItem);
  const [vaultItems, setVaultItems] = useState([emptyVaultItem]);
  const [backupItems, setBackupItems] = useState([emptyVaultItem]);
  const [value, setValue] = useState('vault');
  const [onProgress, setOnProgress] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const details = await getHiveNodesList(nodeId, undefined, true, true, false);
      const myNodeInfo = details.length ? details[0] : undefined;
      setNodeDetail(myNodeInfo);
      if (myNodeInfo) {
        const nodeInfo = await getHiveNodeInfo(user.did, myNodeInfo.url);
        const nodeOwnerDid = nodeInfo.getOwnerDid();
        if (nodeOwnerDid !== user.did) {
          enqueueSnackbar('You are not the owner of this node.', {
            variant: 'error',
            anchorOrigin: { horizontal: 'right', vertical: 'top' }
          });
          navigate('/dashboard/nodes');
          return;
        }
        const myNodeDetails = await getMyHiveNodeDetails(user.did, myNodeInfo.url);
        if (myNodeDetails) {
          setVaultItems(myNodeDetails.vaults);
          setBackupItems(myNodeDetails.backups);
        } else {
          setVaultItems([]);
          setBackupItems([]);
        }
      } else {
        navigate('/dashboard/nodes');
        return;
      }
      setLoading(false);
    };
    if (user.did) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.did, nodeId]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
        if (res) {
          enqueueSnackbar('Create vault succeed', {
            variant: 'success',
            anchorOrigin: { horizontal: 'right', vertical: 'top' }
          });
          window.location.reload();
        } else
          enqueueSnackbar('Vault already exists', {
            variant: 'error',
            anchorOrigin: { horizontal: 'right', vertical: 'top' }
          });
      })
      .catch((e) => {
        console.error(e);
        enqueueSnackbar('Create vault error', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
      });
  };

  const handleDestroyVault = async () => {
    if (!user.did) return;
    if (!vaultItems.length) return;
    setOnProgress(true);
    try {
      console.log('Destroy vault on Node ', nodeDetail.url);
      const result = await destroyVault(user.did);
      if (result) {
        enqueueSnackbar('Destroy vault succeed', {
          variant: 'success',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        setDlgState({
          ...dlgState,
          confirmDlgOpened: false
        });
        window.location.reload();
      } else {
        enqueueSnackbar('Destroy vault error', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Destroy vault error', {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
    }
    setOnProgress(false);
  };

  return (
    <>
      {loading ? (
        <>
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            sx={{
              bgcolor: '#E8F4FF',
              borderRadius: 1,
              height: { xs: '40px', md: '70px' },
              mt: { xs: 5, md: 6 },
              mb: 2.5
            }}
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            sx={{ bgcolor: '#E8F4FF', borderRadius: 1, height: { xs: '500px', md: '800px' } }}
          />
        </>
      ) : (
        <>
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: '10px', sm: '20px' }}
            mt={{ xs: 5, md: 6 }}
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
          <NodeDetailBox>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <NodeDescription>{nodeDetail.remark}</NodeDescription>
              <DestroyVaultButton
                onClick={() => {
                  setDlgState({
                    ...dlgState,
                    confirmDlgOpened: true
                  });
                }}
                disabled={onProgress || !vaultItems.length}
              >
                Destroy Vault
              </DestroyVaultButton>
            </Stack>
            <Grid container sx={{ mt: { xs: 3, md: 6 } }}>
              <InfoItem label="IP" value={nodeDetail.ip} />
              <InfoItemOwnerName label="Owner" value={nodeDetail.owner_did} value2={nodeDetail.ownerName} />
              <InfoItem label="Country/Region" value={nodeDetail.area} />
              <InfoItem label="Email" value={nodeDetail.email} />
              <InfoItem label="URL" value={nodeDetail.url} />
            </Grid>
            <Tabs
              variant="fullWidth"
              value={value}
              onChange={handleChange}
              textColor="inherit"
              TabIndicatorProps={{
                sx: {
                  backgroundColor: 'black'
                }
              }}
              sx={{
                mt: { xs: 3, md: 6 },
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
                sx={{
                  mt: { xs: 2.5, md: 5 },
                  mb: { xs: 1, md: 2 },
                  width: '100%',
                  height: 'fit-content',
                  textAlign: 'left'
                }}
              >
                <Stack mt={{ xs: 1.75, md: 5 }} mb={5} spacing={{ xs: 3.75, md: 6.25 }}>
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
                <PlusButton onClick={handleCreateVault} disabled={vaultItems.length > 0}>
                  Add Vault
                </PlusButton>
              </Box>
            ) : (
              <Box
                sx={{
                  mt: { xs: 2.5, md: 5 },
                  mb: { xs: 1, md: 2 },
                  width: '100%',
                  height: 'fit-content',
                  textAlign: 'left'
                }}
              >
                {backupItems.map((item, index) => (
                  <VaultSummaryItem
                    key={`node-detail-backup-summary-${index}`}
                    vaultName={item.name}
                    vaultTotal={item.total}
                    vaultUsed={item.used}
                    isLoading={loading}
                  />
                ))}
              </Box>
            )}
          </NodeDetailBox>
        </>
      )}
      <ModalDialog
        open={dlgState.confirmDlgOpened}
        onClose={() => {
          setDlgState({
            ...dlgState,
            confirmDlgOpened: false
          });
          setOnProgress(false);
        }}
      >
        <ConfirmDlg
          message="If you remove this vault, your data will be lost."
          onProgress={onProgress}
          onClose={() => {
            setDlgState({
              ...dlgState,
              confirmDlgOpened: false
            });
            setOnProgress(false);
          }}
          onClick={handleDestroyVault}
        />
      </ModalDialog>
    </>
  );
}
