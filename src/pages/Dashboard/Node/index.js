import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import NodeInitialView from '../../../components/Dashboard/Node/InitialView';
import NodeItemBox from '../../../components/NodeItemBox';
import { PlusButton } from '../../../components/Custom/CustomButtons';
import { HeaderTypo } from '../../../components/Custom/CustomTypos';
import { useUserContext } from '../../../contexts/UserContext';
import useHiveHubContracts from '../../../hooks/useHiveHubContracts';
import ConfirmDlg from '../../../components/Dialog/ConfirmDlg';
import ModalDialog from '../../../components/Dialog/ModalDialog';
import { useDialogContext } from '../../../contexts/DialogContext';

export default function MyNode() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { getHiveNodesList, removeHiveNode } = useHiveHubContracts();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [myNodeList, setMyNodeList] = useState(Array(2).fill(0));

  const { dlgState, setDlgState } = useDialogContext({
    confirmDlgOpened: false,
    removeNodeNid: null,
    removeNodeOwnerDid: null
  });
  const [onProgress, setOnProgress] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const nodeList = await getHiveNodesList(undefined, user.did, true, true, false);
        setMyNodeList(nodeList || []);
      } catch (e) {
        console.error(`Failed to load my nodes: ${e}`);
        setMyNodeList([]);
      }
      setIsLoading(false);
    };
    if (user.did) fetchData();
    else navigate('/');
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
    // const result = true;
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
          <NodeInitialView
            onClickEnvConfig={() => navigate('/dashboard/node/envconfig')}
            onClickCreateNode={() => navigate('/dashboard/node/create')}
          />
        </div>
      )}
      {!!myNodeList.length && (
        <>
          <HeaderTypo sx={{ py: 1 }}>{t('node-deployed-node')}</HeaderTypo>
          <Stack mt={{ xs: 2.5, md: 5 }} mb={5} spacing={{ xs: 3.75, md: 6.25 }}>
            {myNodeList.map((item, index) => (
              <NodeItemBox
                key={`MyNode-Item-${index}`}
                nodeId={item?.nid}
                name={item?.name}
                status={item?.status}
                time={item?.created}
                description={item?.remark}
                endpoint={item?.url}
                isOwner={item?.owner_did === user.did}
                isLoading={isLoading}
                onRemoveNode={() => {
                  setDlgState({
                    ...dlgState,
                    confirmDlgOpened: true,
                    removeNodeNid: item?.nid,
                    removeNodeOwnerDid: item?.owner_did
                  });
                }}
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
              {t('btn-config-env')}
            </PlusButton>
            <PlusButton hasPlus={false} onClick={() => navigate('/dashboard/node/create')}>
              {t('btn-register-node')}
            </PlusButton>
          </Stack>
        </>
      )}
      <ModalDialog open={dlgState.confirmDlgOpened}>
        <ConfirmDlg
          message="After clicked the 'Confirm' button, please verify on the Essentials application."
          onProgress={onProgress}
          onClose={() => {
            setDlgState({
              ...dlgState,
              confirmDlgOpened: false,
              removeHiveNode: null,
              removeNodeOwnerDid: null
            });
          }}
          onClick={() => handleRemoveNode(dlgState.removeNodeNid, dlgState.removeNodeOwnerDid)}
        />
      </ModalDialog>
    </>
  );
}
