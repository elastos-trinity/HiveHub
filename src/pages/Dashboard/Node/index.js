import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import NodeInitialView from '../../../components/Node/InitialView';
import NodeItemBox from '../../../components/NodeItemBox';
import { PlusButton } from '../../../components/Custom/CustomButtons';
import { HeaderTypo } from '../../../components/Custom/CustomTypos';
import { useUserContext } from '../../../contexts/UserContext';
import useHiveHubContracts from '../../../hooks/useHiveHubContracts';

export default function MyNodes() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { getHiveNodesList } = useHiveHubContracts();
  const [isLoading, setIsLoading] = useState(false);
  const [myNodeList, setMyNodeList] = useState(Array(2).fill(0));

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const nodeList = await getHiveNodesList(undefined, user.did, true, true, false);
        setMyNodeList(nodeList || []);
      } catch (e) {
        console.error(`Failed to load my nodes: ${e}`);
        setMyNodeList([]);
      }
      setIsLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.did]);

  return (
    <>
      {!isLoading && !myNodeList.length && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}
        >
          <NodeInitialView />
        </div>
      )}
      {!!myNodeList.length && (
        <>
          <HeaderTypo sx={{ py: 1 }}>Deployed Hive nodes</HeaderTypo>
          <Stack mt={{ xs: 2.5, md: 5 }} mb={5} spacing={{ xs: 3.75, md: 6.25 }}>
            {myNodeList.map((item, index) => (
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
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            mt={{ xs: 4, md: 6 }}
            spacing={{ xs: 3.5, md: 5 }}
            sx={{ alignItems: 'left' }}
          >
            <PlusButton hasPlus={false} onClick={() => navigate('/dashboard/node/envconfig')}>
              Configure .env file
            </PlusButton>
            <PlusButton hasPlus={false} onClick={() => navigate('/dashboard/node/create')}>
              Create node
            </PlusButton>
          </Stack>
        </>
      )}
    </>
  );
}
