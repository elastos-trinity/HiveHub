import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import StatusSelect from '../../../components/Explore/StatusSelect';
import ViewToggleGroup from '../../../components/Explore/ViewToggleGroup';
import EmptyNodeView from '../../../components/Explore/EmptyNodeView';
import NodesMapView from '../../../components/Explore/WorldMap/NodesMapView';
import NodeItemBox from '../../../components/NodeItemBox';
import { HeaderTypo } from '../../../components/Custom/CustomTypos';
import { useUserContext } from '../../../contexts/UserContext';
import useHiveHubContracts from '../../../hooks/useHiveHubContracts';

export default function ExploreNode() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { getHiveNodesList } = useHiveHubContracts();
  const [statusFilter, setStatusFilter] = useState(0);
  const [viewMode, setViewMode] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [nodeList, setNodeList] = useState(Array(2).fill(0));
  const [filteredNodeList, setFilteredNodeList] = useState(nodeList);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const nodeItems = await getHiveNodesList(undefined, undefined, true, true, false);
        setNodeList(nodeItems || []);
      } catch (e) {
        console.error(`Failed to load public nodes: ${e}`);
        setNodeList([]);
      }
      setIsLoading(false);
    };
    if (user.did) fetchData();
    else navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.did]);

  useEffect(() => {
    let status;
    if (statusFilter === 1) status = true;
    else if (statusFilter === 2) status = false;
    if (status !== undefined) {
      const filteredItems = nodeList.filter((item) => item.status === status);
      setFilteredNodeList(filteredItems || []);
    } else setFilteredNodeList(nodeList);
  }, [statusFilter, nodeList]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <HeaderTypo sx={{ py: 1 }}>Explore all public Hive nodes</HeaderTypo>
        <Stack direction="row" spacing={2}>
          <StatusSelect selected={statusFilter} onChange={setStatusFilter} />
          <ViewToggleGroup selected={viewMode} onChange={setViewMode} />
        </Stack>
      </Stack>
      {!isLoading && !filteredNodeList.length && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '90%'
          }}
        >
          <EmptyNodeView />
        </div>
      )}
      {!!filteredNodeList.length && viewMode === 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80%'
          }}
        >
          <NodesMapView nodes={filteredNodeList} sx={{ mt: { xs: 2.5, md: 5 } }} />
        </div>
      )}
      {!!filteredNodeList.length && viewMode === 1 && (
        <Stack mt={{ xs: 2.5, md: 5 }} mb={5} spacing={{ xs: 3.75, md: 6.25 }}>
          {filteredNodeList.map((item, index) => (
            <NodeItemBox
              key={`MyNode-Item-${index}`}
              nodeId={item?.nid}
              name={item?.name}
              status={item?.status}
              time={item?.created}
              description={item?.remark}
              endpoint={item?.url}
              isLoading={isLoading}
            />
          ))}
        </Stack>
      )}
    </>
  );
}
