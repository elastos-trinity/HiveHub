import { Box, Button, Chip, Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as React from 'react';

const CustomButton = styled(Button)({
  backgroundColor: '#fff',
  boxShadow: '0px 0px 10px rgba(255, 147, 30, 0.3)',
  width: '180px',
  height: '50px',
  color: '#FF931E',
  borderRadius: '25px',
  fontSize: '15px',
  fontWeight: 'bold',
  padding: '10px',
  '&:hover': {
    backgroundColor: 'rgba(255, 147, 30, 0.3)',
    color: '#fff'
  }
});

const CustomBox = styled(Box)({
  backgroundColor: '#fff',
  boxShadow: '0px 0px 10px rgba(255, 147, 30, 0.3)',
  borderRadius: '18px',
  height: '200px',
  width: '100%',
  marginBottom: '20px',
  padding: '10px 20px'
});

NodeItem.propTypes = {
  id: PropTypes.number.isRequired,
  nodeName: PropTypes.string.isRequired,
  nodeStatus: PropTypes.bool.isRequired,
  date: PropTypes.string.isRequired,
  nodeDescription: PropTypes.string,
  nodeIP: PropTypes.string.isRequired,
  ownerDID: PropTypes.string.isRequired
};

function NodeItem({ id, nodeName, nodeStatus, date, nodeDescription, nodeIP, ownerDID }) {
  return (
    <CustomBox>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ my: 2 }}>
        <Typography variant="h5">
          <Link
            href={`/dashboard/nodes/detail/${id}`}
            sx={{ textDecoration: 'none', color: '#000' }}
          >
            {nodeName}
          </Link>
          <Box component="span" sx={{ ml: 2 }}>
            {nodeStatus ? (
              <Chip label="online" color="success" sx={{ height: '20px', color: 'white' }} />
            ) : (
              <Chip label="offline" sx={{ height: '20px' }} />
            )}
          </Box>
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.3)' }}>
          {date}
        </Typography>
      </Stack>
      <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.3)' }}>
        {nodeDescription}
      </Typography>

      <Stack direction="row" alignItems="center" sx={{ mb: 2, mt: 6 }}>
        <Typography variant="body1" sx={{ mr: 2 }}>
          <Box component="span" sx={{ mr: 1, color: 'rgba(0,0,0,0.3)' }}>
            IP:
          </Box>
          {nodeIP}
        </Typography>
        <Typography variant="body1">
          <Box component="span" sx={{ mr: 1, color: 'rgba(0,0,0,0.3)' }}>
            Owner DID:
          </Box>
          {ownerDID}
        </Typography>
      </Stack>
    </CustomBox>
  );
}

const NodeList = [
  {
    id: 1,
    nodeName: 'Node A',
    nodeStatus: true,
    date: '2022-01-01 20:00:00',
    nodeDescription: 'This is a local hive node',
    nodeIP: '192.115.24.2',
    ownerDID: 'did:elastos:ikkFHgoUHrVDTU8HTYDAWH9Z8S377Qvt7n'
  },
  {
    id: 2,
    nodeName: 'Node B',
    nodeStatus: false,
    date: '2022-01-01 20:00:00',
    nodeDescription: 'This is a local hive node',
    nodeIP: '192.115.24.2',
    ownerDID: 'did:elastos:ikkFHgoUHrVDTU8HTYDAWH9Z8S377Qvt7n'
  }
];

export default function HiveNodes() {
  const [nodeList, setNodeList] = React.useState(NodeList);

  return (
    <>
      <Box sx={{ my: 8 }}>
        <Typography variant="h3">My Nodes</Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        {nodeList.map((node, index) => (
          <NodeItem
            key={index}
            id={node.id}
            nodeName={node.nodeName}
            nodeStatus={node.nodeStatus}
            date={node.date}
            nodeDescription={node.nodeDescription}
            nodeIP={node.nodeIP}
            ownerDID={node.ownerDID}
          />
        ))}
      </Box>

      <CustomButton href="/dashboard/nodes/add">
        <Box
          component="span"
          sx={{ fontSize: '25px', display: 'inline-block', marginRight: '8px' }}
        >
          +
        </Box>
        Create Hive Node
      </CustomButton>
    </>
  );
}
