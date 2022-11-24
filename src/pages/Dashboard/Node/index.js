import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import NodeInitialView from '../../../components/Node/InitialView';
import NodeItemBox from '../../../components/NodeItemBox';
import { PlusButton } from '../../../components/Custom/CustomButtons';
import { HeaderTypo } from '../../../components/Custom/CustomTypos';
import { useUserContext } from '../../../contexts/UserContext';
import { useDialogContext } from '../../../contexts/DialogContext';
import useHiveHubContracts from '../../../hooks/useHiveHubContracts';
import ModalDialog from '../../../components/ModalDialog';
import ConfirmDlg from '../../../components/Dialog/ConfirmDlg';

export default function MyNodes() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUserContext();
  const { getHiveNodesList, removeHiveNode } = useHiveHubContracts();
  const { dlgState, setDlgState } = useDialogContext();
  const [isLoading, setIsLoading] = useState(false);
  const [myNodeList, setMyNodeList] = useState(Array(2).fill(0));
  const [onProgress, setOnProgress] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const nodeList = await getHiveNodesList(undefined, user.did, true, true, false);
        setMyNodeList(nodeList);
      } catch (e) {
        console.error(`Failed to load my nodes: ${e}`);
        setMyNodeList([]);
      }
      setIsLoading(false);
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
      {!isLoading && !myNodeList.length && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}
        >
          <NodeInitialView />
        </div>
      )}
      {!!myNodeList.length && (
        <>
          <HeaderTypo sx={{ py: 1 }}>Deployed Hive nodes</HeaderTypo>
          <Stack mt={{ xs: 2.5, md: 5 }} mb={5} spacing={{ xs: 3.75, md: 6.25 }}>
            {myNodeList.map((item, index) => (
              <NodeItemBox
                key={`node-item-${index}`}
                nodeId={item?.nid}
                name={item?.name}
                status={item?.status}
                time={item?.created}
                description={item?.remark}
                endpoint={item?.url}
                isLoading={isLoading}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setDlgState({
                    ...dlgState,
                    confirmDlgOpened: true,
                    removeNodeNid: item.nid,
                    removeNodeOwnerDid: item.owner_did
                  });
                }}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Stack>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            mt={{ xs: 4, md: 6 }}
            spacing={{ xs: 3.5, md: 5 }}
            sx={{ alignItems: 'left' }}
          >
            <PlusButton hasPlus={false} onClick={() => navigate('/dashboard/node/envconfig')}>
              Configure .env file
            </PlusButton>
            <PlusButton hasPlus={false} onClick={() => navigate('/dashboard/node/create')}>
              Create node
            </PlusButton>
          </Stack>
        </>
      )}
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
