import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import SmallHexagon from '../../../components/SmallHexagon';

import NodeItem from '../../../components/NodeItem';
import { useUserContext } from '../../../contexts/UserContext';
import { useDialogContext } from '../../../contexts/DialogContext';
import { emptyNodeItem } from '../../../utils/filler';
import { PlusButton } from '../../../components/CustomButtons';
import ModalDialog from '../../../components/ModalDialog';
import ConfirmDlg from '../../../components/Dialog/ConfirmDlg';
import useHiveHubContracts from '../../../hooks/useHiveHubContracts';

const FeatureGrid = styled(Grid)(({ theme }) => ({
  textAlign: 'center',
  padding: '20px 0 30px',
  fontSize: '30px',
  lineHeight: '37px',
  [theme.breakpoints.down('md')]: {
    fontSize: '15px',
    lineHeight: '18px'
  }
}));

export default function MyNodes() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUserContext();
  const { getHiveNodesList, removeHiveNode } = useHiveHubContracts();
  const { dlgState, setDlgState } = useDialogContext();
  const [loading, setLoading] = useState(false);
  const [myNodeList, setMyNodeList] = useState(Array(2).fill(emptyNodeItem));
  const [onProgress, setOnProgress] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const nodeList = await getHiveNodesList(undefined, user.did, true, true, false);
        setMyNodeList(nodeList);
      } catch (e) {
        console.error(`Failed to load my nodes: ${e}`);
        setMyNodeList([]);
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.did]);

  const handleRemoveNode = async (nid, ownerDid) => {
    if (ownerDid !== user.did) {
      enqueueSnackbar('Only owner can remove its node.', {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
      return;
    }
    setOnProgress(true);
    const result = await removeHiveNode(nid);
    if (result) {
      enqueueSnackbar('Remove Hive Node success.', {
        variant: 'success',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
      window.location.reload();
    } else {
      enqueueSnackbar('Remove Hive Node failed.', {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
    }
    setOnProgress(false);
  };

  return (
    <>
      {!loading && !myNodeList.length && (
        <>
          <FeatureGrid item xs={12} sm={6} md={3} spacing={2} mt={{ xs: 5, md: 15 }}>
            <Box sx={{ margin: '20px 0 20px' }}>
              <SmallHexagon
                borderColor="#FF931E"
                rootHexagon
                sideLength={30}
                borderWidth={2}
                backColor="transparent"
              >
                <Typography
                  variant="h3"
                  sx={{ color: '#FFC98F', height: '30px', lineHeight: '32px' }}
                >
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
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '25px',
                lineHeight: '30px',
                color: '#FFFFFF',
                py: 1
              }}
            >
              Become your own node operator now!
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '15px',
                lineHeight: '18px',
                color: '#C4C4C4',
                py: 1
              }}
            >
              Create and deploy your own Hive node!
            </Typography>
          </FeatureGrid>
          <Stack mt={{ xs: 4, md: 6 }} spacing={{ xs: 3.5, md: 5 }} sx={{ alignItems: 'center' }}>
            <PlusButton hasPlus={false} onClick={() => navigate('/dashboard/node/envconfig')}>
              Configure .env file
            </PlusButton>
            <PlusButton hasPlus={false} onClick={() => navigate('/dashboard/node/create')}>
              Create node
            </PlusButton>
          </Stack>
        </>
      )}

      <Stack mt={{ xs: 4, md: 8 }} mb={5} spacing={{ xs: 3.75, md: 6.25 }}>
        {myNodeList.map((node, index) => (
          <NodeItem
            key={index}
            id={node.nid}
            name={node.name}
            status={node.status}
            time={node.created}
            url={node.url}
            description={node.remark}
            ip={node.ip}
            did={node.owner_did}
            ownerName={node.ownerName}
            isMyNode
            isLoading={loading}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setDlgState({
                ...dlgState,
                confirmDlgOpened: true,
                removeNodeNid: node.nid,
                removeNodeOwnerDid: node.owner_did
              });
            }}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Stack>
      <ModalDialog
        open={dlgState.confirmDlgOpened}
        onClose={() => {
          setDlgState({
            ...dlgState,
            confirmDlgOpened: false,
            removeNodeNid: 0,
            removeNodeOwnerDid: ''
          });
          setOnProgress(false);
        }}
      >
        <ConfirmDlg
          message="If you remove this node, all the vaults will be lost."
          onProgress={onProgress}
          onClose={() => {
            setDlgState({
              ...dlgState,
              confirmDlgOpened: false,
              removeNodeNid: 0,
              removeNodeOwnerDid: ''
            });
            setOnProgress(false);
          }}
          onClick={() => handleRemoveNode(dlgState.removeNodeNid, dlgState.removeNodeOwnerDid)}
        />
      </ModalDialog>
    </>
  );
}
