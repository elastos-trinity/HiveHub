import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PageTitleTypo } from '../style';
import VaultItem from '../../../components/VaultItem';

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

const VaultList = [
  {
    id: 1,
    name: 'Sarah',
    total: 524,
    used: 112,
    time: '05-04-2022 21:00:00'
  },
  {
    id: 2,
    name: 'Teru',
    total: 524,
    used: 352,
    time: '05-04-2022 21:00:00'
  }
];

export default function HiveVaults() {
  const navigate = useNavigate();
  const [myVaultsList, setMyVaultsList] = React.useState(VaultList);

  return (
    <>
      <PageTitleTypo mt={{ xs: 7, md: 15 }} mb={myVaultsList.length ? 0 : 1.25}>
        My Vaults
      </PageTitleTypo>
      <Stack mt={{ xs: 1.75, md: 5 }} mb={10} spacing={{ xs: 3.75, md: 6.25 }}>
        {myVaultsList.map((item, index) => (
          <VaultItem
            key={index}
            id={item.id}
            name={item.name}
            total={item.total}
            used={item.used}
            time={item.time}
            did={item.did}
            isMyVault
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 3.125, md: 5 }}>
        <CustomButton onClick={() => {}}>
          <PlusTypo>+</PlusTypo>
          Create Hive Vault
        </CustomButton>
        <CustomButton onClick={() => {}}>
          {/* <PlusTypo>+</PlusTypo> */}
          Access Hive Vaults
        </CustomButton>
      </Stack>
    </>
  );
}
