import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PageTitleTypo } from '../style';
import NodeItem from '../../../components/NodeItem';

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#fff',
  height: '50px',
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

const NodeList = [
  {
    id: 1,
    name: 'Node A',
    status: true,
    time: '2022-01-01 20:00:00',
    description: 'This is a local hive node',
    ip: '192.115.24.2',
    did: 'did:elastos:ikkFHgoUHrVDTU8HTYDAWH9Z8S377Qvt7n'
  },
  {
    id: 2,
    name: 'Node B',
    status: false,
    time: '2022-01-01 20:00:00',
    description: 'This is a local hive node',
    ip: '192.115.24.2',
    did: 'did:elastos:ikkFHgoUHrVDTU8HTYDAWH9Z8S377Qvt7n'
  }
];

export default function HiveNodes() {
  const navigate = useNavigate();
  const [myNodeList, setMyNodeList] = React.useState(NodeList);

  return (
    <>
      <PageTitleTypo mt={{ xs: 7, md: 15 }} mb={myNodeList.length ? 0 : 1.25}>
        My Nodes
      </PageTitleTypo>
      <Stack mt={{ xs: 1.75, md: 5 }} spacing={{ xs: 3.75, md: 6.25 }}>
        {myNodeList.map((node, index) => (
          <NodeItem
            key={index}
            id={node.id}
            name={node.name}
            status={node.status}
            time={node.time}
            description={node.description}
            ip={node.ip}
            did={node.did}
            isMyNode
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Stack>
      <CustomButton onClick={() => navigate("/dashboard/nodes/add")} sx={{ mt: { xs: 3, md: 5 }, mb: 10 }}>
        <PlusTypo>+</PlusTypo>
        Create Hive Node
      </CustomButton>
    </>
  );
}
