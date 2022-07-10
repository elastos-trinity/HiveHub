import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PageTitleTypo } from '../style';
import NodeItem from '../../../components/NodeItem';
import { getHiveNodesList } from '../../../service/fetch';
import useUser from '../../../hooks/useUser';
import { emptyNodeItem } from '../../../utils/filler';

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
  [theme.breakpoints.up('md')]: {
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

export default function HiveNodes() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [myNodeList, setMyNodeList] = useState(Array(2).fill(emptyNodeItem));

  useEffect(async () => {
    setLoading(true);
    const nodeList = await getHiveNodesList(undefined, user.did, false);
    setMyNodeList(nodeList);
    setLoading(false);
  }, [user.did]);

  return (
    <>
      <PageTitleTypo mt={{ xs: 7, md: 15 }} mb={myNodeList.length ? 0 : 1.25}>
        My Nodes
      </PageTitleTypo>
      <Stack mt={{ xs: 1.75, md: 5 }} mb={10} spacing={{ xs: 3.75, md: 6.25 }}>
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
          <CustomButton onClick={() => navigate('/dashboard/nodes/create')}>
            <PlusTypo>+</PlusTypo>
            Create Hive Node
          </CustomButton>
          <CustomButton onClick={() => navigate('/dashboard/nodes/envconfig')}>
            <PlusTypo>+</PlusTypo>
            Create Hive Node Config
          </CustomButton>
        </Stack>
      </Stack>
    </>
  );
}
