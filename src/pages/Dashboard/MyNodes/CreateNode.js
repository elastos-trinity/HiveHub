import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PageTitleTypo } from '../style';
import useUser from '../../../hooks/useUser';
import CustomTextField from '../../../components/CustomTextField';
import { getTime } from '../../../service/common';
import HiveHubServer from '../../../service/hivehub';

const ContainerBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  border: '2px solid #E5E5E5',
  textAlign: 'center',
  borderRadius: '20px',
  width: '100%',
  padding: '20px 50px 20px 20px',
  [theme.breakpoints.up('md')]: {
    padding: '30px 70px'
  }
}));

const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: '200px',
  backgroundColor: '#FF931E',
  color: 'white',
  fontWeight: 600,
  lineHeight: '12px',
  fontSize: '10px',
  height: '30px',
  padding: '9px 38px',
  [theme.breakpoints.up('md')]: {
    lineHeight: '24px',
    fontSize: '20px',
    height: '60px',
    padding: '17px 68px'
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 147, 30, 0.7)'
  }
}));

export default function CreateNode() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [ownerDid, setOwnerDid] = useState(`did:elastos:${user.did}`);
  const [ownerDidErr, setOwnerDidErr] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [nodeNameErr, setNodeNameErr] = useState(false);
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const [country, setCountry] = useState('');
  const [countryErr, setCountryErr] = useState(false);
  const [province, setProvince] = useState('');
  const [provinceErr, setProvinceErr] = useState(false);
  const [district, setDistrict] = useState('');
  const [districtErr, setDistrictErr] = useState(false);
  const [url, setUrl] = useState('');
  const [urlErr, setUrlErr] = useState(false);
  const [description, setDescription] = useState('');
  const [descriptionErr, setDescriptionErr] = useState(false);

  const handleCreateNode = async () => {
    if (ownerDid && nodeName && email && country && province && district && url && description) {
      const curTime = getTime(new Date().getTime());
      const newNode = {
        name: nodeName,
        created: `${curTime.date} ${curTime.time}`, // TODO:
        ip: '192.115.24.2', // TODO:
        owner_did: ownerDid,
        area: `${country} ${province} ${district}`,
        email,
        url,
        remark: description
      };
      console.log(newNode);
      const json = await HiveHubServer.addHiveNode(newNode);
      // acknowledged: true
      // inserted_id: "62c2e6560d6930f229239199"
      navigate('/dashboard/nodes');
    } else {
      setOwnerDidErr(!ownerDid);
      setNodeNameErr(!nodeName);
      setEmailErr(!email);
      setCountryErr(!country);
      setProvinceErr(!province);
      setDistrictErr(!district);
      setUrlErr(!url);
      setDescriptionErr(!description);
    }
  };

  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <PageTitleTypo mt={{ xs: 6.25, md: 3.15 }}>Create Node</PageTitleTypo>
      <ContainerBox mt={{ xs: 2.5, md: 5 }}>
        <Stack spacing={{ xs: 5, md: 7.5 }} mt={{ xs: 3.75, md: 5 }}>
          <CustomTextField
            placeholder="Owner DID"
            variant="standard"
            inputValue={ownerDid}
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={ownerDidErr}
            errorText="Owner DID can not be empty"
            disabled
          />
          <CustomTextField
            placeholder="Node Name"
            variant="standard"
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={nodeNameErr}
            errorText="Node Name can not be empty"
            changeHandler={(value) => {
              setNodeName(value);
              setNodeNameErr(false);
            }}
          />
          <CustomTextField
            placeholder="Email"
            variant="standard"
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={emailErr}
            errorText="Email can not be empty"
            changeHandler={(value) => {
              setEmail(value);
              setEmailErr(false);
            }}
          />
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'left', md: 'center' }}
            spacing={{ xs: 5, md: 12.5 }}
          >
            <CustomTextField
              placeholder="Country"
              variant="standard"
              fontSize={matchDownMd ? 10 : 20}
              height={matchDownMd ? 12 : 24}
              error={countryErr}
              errorText="Country can not be empty"
              changeHandler={(value) => {
                setCountry(value);
                setCountryErr(false);
              }}
            />
            <CustomTextField
              placeholder="Province"
              variant="standard"
              fontSize={matchDownMd ? 10 : 20}
              height={matchDownMd ? 12 : 24}
              error={provinceErr}
              errorText="Province can not be empty"
              changeHandler={(value) => {
                setProvince(value);
                setProvinceErr(false);
              }}
            />
            <CustomTextField
              placeholder="District"
              variant="standard"
              fontSize={matchDownMd ? 10 : 20}
              height={matchDownMd ? 12 : 24}
              error={districtErr}
              errorText="District can not be empty"
              changeHandler={(value) => {
                setDistrict(value);
                setDistrictErr(false);
              }}
            />
          </Stack>
          <CustomTextField
            placeholder="URL"
            variant="standard"
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={urlErr}
            errorText="Url can not be empty"
            changeHandler={(value) => {
              setUrl(value);
              setUrlErr(false);
            }}
          />
          <CustomTextField
            placeholder="Description"
            variant="standard"
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={descriptionErr}
            errorText="Description can not be empty"
            changeHandler={(value) => {
              setDescription(value);
              setDescriptionErr(false);
            }}
          />
        </Stack>
        <Stack direction="row" mt={{ xs: 10, md: 17.5 }} spacing={{ xs: 2.5, md: 5 }}>
          <CustomButton
            sx={{
              background: '#B3B3B3',
              '&:hover': {
                backgroundColor: 'rgba(179, 179, 179, 0.7)'
              }
            }}
            onClick={() => navigate('/dashboard/nodes')}
          >
            Cancel
          </CustomButton>
          <CustomButton onClick={handleCreateNode}>Confirm</CustomButton>
        </Stack>
      </ContainerBox>
    </>
  );
}
