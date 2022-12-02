import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Stack } from '@mui/material';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '../../contexts/UserContext';
import useHiveHubContracts from '../../hooks/useHiveHubContracts';
import { LandingTitleTypo } from '../Custom/CustomTypos';
import NodeItemBox from '../NodeItemBox';

PublicNodes.propTypes = {
  onClick: PropTypes.func
};

export default function PublicNodes({ onClick }) {
  const { user } = useUserContext();
  const { t } = useTranslation();
  const { getHiveNodesList } = useHiveHubContracts();
  const [nodes, setNodes] = useState(Array(3).fill(0));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const nodeList = await getHiveNodesList(undefined, undefined, true, true, false);
        setNodes((nodeList || []).slice(0, 5));
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
      <LandingTitleTypo sub="true" mt={{ xs: '40px', md: '100px' }} mb={{ xs: '20px', md: '80px' }}>
        {t('home-public-nodes')}
      </LandingTitleTypo>
      <Stack spacing={{ xs: 3.5, md: 6.25 }}>
        {nodes.map((item, index) => (
          <NodeItemBox
            key={`node-item-${index}`}
            nodeId={item?.nid}
            name={item?.name}
            status={item?.status}
            time={item?.created}
            description={item?.remark}
            endpoint={item?.url}
            isOwner={item?.owner_did === user.did}
            isLoading={isLoading}
          />
        ))}
        <Box sx={{ textAlign: 'right' }}>
          <Button
            size="small"
            color="inherit"
            endIcon={<Icon icon="material-symbols:arrow-right-alt" color="#ff931e" />}
            onClick={onClick}
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
              {t('home-see-more')}
            </span>
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
