import { useState, useEffect } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import useHiveHubContracts from '../../hooks/useHiveHubContracts';
import { LandingTitleTypo } from '../CustomTypos';
import NodeItemBox from '../NodeItemBox';

const mockData = [
  {
    id: 1,
    name: 'Node A',
    url: 'hive1.trinitytech.io',
    remark: 'This is the local hive node',
    ip: '',
    did: '',
    ownerName: '',
    status: true,
    created: '05-04-2022 21:00:00',
    isLoading: false
  },
  {
    id: 2,
    name: 'Node B',
    url: 'hive2.trinitytech.io',
    remark: 'This is the local hive node',
    ip: '',
    did: '',
    ownerName: '',
    status: false,
    created: '05-04-2022 21:00:00',
    isLoading: false
  }
];

export default function PublicNodes() {
  const { getHiveNodesList } = useHiveHubContracts();
  const [nodes, setNodes] = useState(mockData);
  const [isLoading, setIsLoading] = useState(false);

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       setIsLoading(true);
  //       try {
  //         const nodeList = await getHiveNodesList(undefined, undefined, true, true, false);
  //         setNodes(nodeList);
  //       } catch (e) {
  //         console.log(`Failed to load nodes: ${e}`);
  //         setNodes([]);
  //       }
  //       setIsLoading(false);
  //     };
  //     fetchData();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  return (
    <Box
      sx={{
        mx: { xs: '100px', md: '200px' }
      }}
    >
      <LandingTitleTypo sub mt={{ xs: '50px', md: '100px' }} mb={{ xs: '40px', md: '80px' }}>
        Public Nodes
      </LandingTitleTypo>
      <Stack spacing={6.25}>
        {nodes.map((item, index) => (
          <NodeItemBox
            key={`node-item-${index}`}
            nodeId={item.nid}
            name={item.name}
            status={item.status}
            time={item.created}
            description={item.remark}
            endpoint={item.url}
            isLoading={isLoading}
          />
        ))}
      </Stack>
    </Box>
  );
}
PublicNodes.propTypes = {};
