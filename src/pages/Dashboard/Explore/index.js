import { useState, useEffect } from 'react';
import { Stack, Button } from '@mui/material';
import NodeItem from '../../../components/NodeItem';
import { PageTitleTypo, FilterByTypo } from '../../../components/CustomTypos';
import { useUserContext } from '../../../contexts/UserContext';
import { getHiveNodesList } from '../../../service/fetch';
import { emptyNodeItem } from '../../../utils/filler';

export default function HiveExplore() {
  const { user } = useUserContext();
  const [loadingNode, setLoadingNode] = useState(false);
  const [nodeItems, setNodeItems] = useState(Array(3).fill(emptyNodeItem));
  const [onlyActive, setOnlyActive] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingNode(true);
      const nodeList = await getHiveNodesList(undefined, undefined, true, true, onlyActive);
      setNodeItems(nodeList);
      setLoadingNode(false);
    };
    fetchData();
  }, [user.did, onlyActive]);

  return (
    <>
      <PageTitleTypo mt={{ xs: 5, md: 6 }}>Explore</PageTitleTypo>
      <Stack spacing={{ xs: 4, md: 5 }} mt={{ xs: 4, md: 8 }} sx={{ position: 'relative' }}>
        <Stack
          direction="row"
          spacing={{ xs: '25px', md: '50px' }}
          alignItems="baseline"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={{ xs: '25px', md: '50px' }} alignItems="baseline">
            <PageTitleTypo sub="true">Nodes</PageTitleTypo>
            <FilterByTypo>Filter by</FilterByTypo>
          </Stack>
          <Button
            onClick={() => setOnlyActive(!onlyActive)}
            sx={{
              height: { xs: '12px', md: '24px' },
              color: onlyActive ? '#FF931E' : '#00AB55',
              fontSize: { xs: '10px', md: '20px' },
              lineHeight: { xs: '12px', md: '24px' }
            }}
          >
            {onlyActive ? 'all' : 'online'}
          </Button>
        </Stack>
        <Stack spacing={3.75}>
          {nodeItems.map((item, index) => (
            <NodeItem
              key={`node-item-${index}`}
              id={item.nid}
              name={item.name}
              description={item.remark}
              ip={item.ip}
              did={item.owner_did}
              ownerName={item.ownerName}
              status={item.status}
              time={item.created}
              isLoading={loadingNode}
            />
          ))}
        </Stack>
      </Stack>
    </>
  );
}
