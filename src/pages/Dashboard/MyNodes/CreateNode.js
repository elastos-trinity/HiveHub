import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSnackbar } from 'notistack';
// import dns from 'dns';
import { PageTitleTypo } from '../../../components/CustomTypos';
import { ConfirmButton } from '../../../components/CustomButtons';
import { ContainerBox } from '../../../components/CustomContainer';
import useUser from '../../../hooks/useUser';
import CustomTextField from '../../../components/CustomTextField';
import { getTime } from '../../../service/common';
import HiveHubServer from '../../../service/HiveHubServer';
import { getRestService } from '../../../service/fetch';

export default function CreateNode() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUser();
  const [ownerDid] = useState(user.did);
  const [ownerDidErr, setOwnerDidErr] = useState(false);
  const [country, setCountry] = useState('');
  const [countryErr, setCountryErr] = useState(false);
  const [province, setProvince] = useState('');
  const [provinceErr, setProvinceErr] = useState(false);
  const [district, setDistrict] = useState('');
  const [districtErr, setDistrictErr] = useState(false);
  const [url, setUrl] = useState('');
  const [urlErr, setUrlErr] = useState(false);

  const handleCreateNode = async () => {
    if (ownerDid && country && province && district && url) {
      // dns.lookup(url, (err, address, familly) => {
      //   console.log(address);
      //   console.log(familly)
      //   console.log(err)
      // });
      const restService = await getRestService(user.did);
      const nodeInfo = await restService.serviceEndpoint.getNodeInfo();
      if (!nodeInfo) {
        enqueueSnackbar('Invalid node url', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        return;
      }
      const nodeName = nodeInfo.getName();
      const email = nodeInfo.getEmail();
      const description = nodeInfo.getDescription();
      if (!nodeName || !email || !description) {
        enqueueSnackbar("Hive node's information is insufficient.", {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        return;
      }
      const curTime = getTime(new Date().getTime());
      const newNode = {
        name: nodeName,
        created: `${curTime.date} ${curTime.time}`,
        ip: '192.115.24.2', // TODO:
        owner_did: ownerDid,
        area: `${country} ${province} ${district}`,
        email,
        url,
        remark: description
      };

      // check accessible and ownership
      const nodeServiceDid = nodeInfo.getServiceDid();
      const nodeOwnerDid = nodeInfo.getOwnerDid();
      const nodeOwnershipPresentation = nodeInfo.getOwnershipPresentation();
      const vcs = nodeOwnershipPresentation.getCredentials();
      const credentialIssuer = `did:elastos:${vcs[0].getIssuer().getMethodSpecificId()}`;
      const holderDid = nodeOwnershipPresentation.getHolder().getMethodSpecificId();
      const presentationHolder = `did:elastos:${holderDid}`;
      if (
        !(
          ownerDid === user.did &&
          nodeOwnerDid === user.did &&
          nodeServiceDid === presentationHolder &&
          user.did === credentialIssuer
        )
      ) {
        enqueueSnackbar('Invalid owner', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        return;
      }
      const status = await HiveHubServer.isOnline(url);
      if (!status) {
        enqueueSnackbar('Hive Node is not accessible.', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        return;
      }
      try {
        await HiveHubServer.addHiveNode(newNode);
      } catch (err) {
        console.error(err);
      }
      // const json = await HiveHubServer.addHiveNode(newNode);
      // acknowledged: true
      // inserted_id: "62c2e6560d6930f229239199"
      navigate('/dashboard/nodes');
    } else {
      setOwnerDidErr(!ownerDid);
      setCountryErr(!country);
      setProvinceErr(!province);
      setDistrictErr(!district);
      setUrlErr(!url);
    }
  };

  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <PageTitleTypo mt={{ xs: 5, md: 6 }}>Create Node</PageTitleTypo>
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
        </Stack>
        <Stack direction="row" mt={{ xs: 8, md: 10 }} spacing={{ xs: 2.5, md: 5 }}>
          <ConfirmButton
            sx={{
              background: '#B3B3B3',
              '&:hover': {
                backgroundColor: 'rgba(179, 179, 179, 0.7)'
              }
            }}
            onClick={() => navigate('/dashboard/nodes')}
          >
            Cancel
          </ConfirmButton>
          <ConfirmButton onClick={handleCreateNode}>Confirm</ConfirmButton>
        </Stack>
      </ContainerBox>
    </>
  );
}
