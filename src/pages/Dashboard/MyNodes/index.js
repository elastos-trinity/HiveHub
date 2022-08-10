import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { PageTitleTypo } from '../style';
import NodeItem from '../../../components/NodeItem';
import useUser from '../../../hooks/useUser';
import { getHiveNodesList } from '../../../service/fetch';
import { emptyNodeItem } from '../../../utils/filler';
import PlusButton from '../../../components/Buttons/PlusButton';

export default function HiveNodes() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [myNodeList, setMyNodeList] = useState(Array(2).fill(emptyNodeItem));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const nodeList = await getHiveNodesList(undefined, user.did, false, false);
      setMyNodeList(nodeList);
      setLoading(false);
    };
    fetchData();
  }, [user.did]);

  return (
    <>
      <PageTitleTypo mt={{ xs: 5, md: 6 }} mb={myNodeList.length ? 0 : 1.25}>
        My Nodes
      </PageTitleTypo>
      <Stack mt={{ xs: 4, md: 8 }} mb={5} spacing={{ xs: 3.75, md: 6.25 }}>
        {myNodeList.map((node, index) => (
          <NodeItem
            key={index}
            id={node._id}
            name={node.name}
            status={node.status}
            time={node.created}
            description={node.remark}
            ip={node.ip}
            did={node.owner_did}
            ownerName={node.ownerName}
            isMyNode
            isLoading={loading}
            sx={{ cursor: 'pointer' }}
          />
        ))}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3.75, md: 6.25 }}>
          <PlusButton onClick={() => navigate('/dashboard/nodes/create')}>
            Create Hive Node
          </PlusButton>
          <PlusButton onClick={() => navigate('/dashboard/nodes/envconfig')}>
            Create Hive Node Config
          </PlusButton>
        </Stack>
      </Stack>
    </>
  );
}
