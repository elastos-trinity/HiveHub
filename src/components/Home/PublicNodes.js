import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import { Icon } from '@iconify/react';
import { useUserContext } from '../../contexts/UserContext';
import useHiveHubContracts from '../../hooks/useHiveHubContracts';
import { LandingTitleTypo } from '../Custom/CustomTypos';
import NodeItemBox from '../NodeItemBox';

export default function PublicNodes() {
  const { user } = useUserContext();
  const { getHiveNodesList } = useHiveHubContracts();
  const [nodes, setNodes] = useState(Array(3).fill(0));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const nodeList = await getHiveNodesList(undefined, undefined, true, true, false);
        setNodes(nodeList);
      } catch (e) {
        console.log(`Failed to load nodes: ${e}`);
        setNodes([]);
      }
      setIsLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        mx: { xs: 'auto', lg: '200px' }
      }}
    >
      <LandingTitleTypo sub="true" mt={{ xs: '50px', md: '100px' }} mb={{ xs: '40px', md: '80px' }}>
        Public Nodes
      </LandingTitleTypo>
      <Stack spacing={6.25}>
        {nodes.map((item, index) => (
          <NodeItemBox
            key={`node-item-${index}`}
            nodeId={item?.nid}
            name={item?.name}
            status={item?.status}
            time={item?.created}
            description={item?.remark}
            endpoint={item?.url}
            isOwner={item?.owner_did !== user.did}
            isLoading={isLoading}
          />
        ))}
        <Box sx={{ textAlign: 'right' }}>
          <Button
            to="/dashboard/explore"
            size="small"
            color="inherit"
            component={RouterLink}
            endIcon={<Icon icon="material-symbols:arrow-right-alt" color="#ff931e" />}
          >
            <span
              style={{
                color: '#ff931e',
                fontFamily: 'Roboto',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '19px'
              }}
            >
              See more
            </span>
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
PublicNodes.propTypes = {};
