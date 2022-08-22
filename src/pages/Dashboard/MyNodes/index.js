import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { PageTitleTypo } from '../../../components/CustomTypos';
import NodeItem from '../../../components/NodeItem';
import { useUserContext } from '../../../contexts/UserContext';
import { getHiveNodesList, removeHiveNode } from '../../../service/fetch';
import { emptyNodeItem } from '../../../utils/filler';
import { PlusButton } from '../../../components/CustomButtons';

export default function HiveNodes() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [myNodeList, setMyNodeList] = useState(Array(2).fill(emptyNodeItem));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const nodeList = await getHiveNodesList(undefined, user.did, false, true, false);
      setMyNodeList(nodeList);
      setLoading(false);
    };
    fetchData();
  }, [user.did]);

  const handleRemoveNode = async (nid) => {
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
  };

  return (
    <>
      <PageTitleTypo mt={{ xs: 5, md: 6 }} mb={myNodeList.length ? 0 : 1.25}>
        My Nodes
      </PageTitleTypo>
      <Stack mt={{ xs: 4, md: 8 }} mb={5} spacing={{ xs: 3.75, md: 6.25 }}>
        {myNodeList.map((node, index) => (
          <NodeItem
            key={index}
            id={node.nid}
            name={node.name}
            status={node.status}
            time={node.created}
            description={node.remark}
            ip={node.ip}
            did={node.owner_did}
            ownerName={node.ownerName}
            isMyNode
            isLoading={loading}
            onClick={() => handleRemoveNode(node.nid)}
            sx={{ cursor: 'pointer' }}
          />
        ))}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3.75, md: 6.25 }}>
          <PlusButton onClick={() => navigate('/dashboard/nodes/envconfig')}>
            Create Hive Node Config
          </PlusButton>
          <PlusButton onClick={() => navigate('/dashboard/nodes/create')}>
            Create Hive Node
          </PlusButton>
        </Stack>
      </Stack>
    </>
  );
}
