import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSnackbar } from 'notistack';
// eslint-disable-next-line camelcase
import { binary_to_base58 } from 'base58-js';
import { DIDStore, Mnemonic, RootIdentity } from '@elastosfoundation/did-js-sdk';
import { DID as ConDID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { useTranslation } from 'react-i18next';
import { HeaderTypo } from '../../../components/Custom/CustomTypos';
import { ConfirmButton } from '../../../components/Custom/CustomButtons';
import { ContainerBox } from '../../../components/Custom/CustomContainer';
import CustomTextField from '../../../components/Custom/CustomTextField';
import { useUserContext } from '../../../contexts/UserContext';
import { createHiveNodeEnvConfig } from '../../../service/fetch';
import EnvConfigDownloadDlg from '../../../components/Dialog/EnvConfigDownloadDlg';
import CredentialIssueConfirmDlg from '../../../components/Dialog/CredentialIssueConfirmDlg';

export default function NodeEnvConfig() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUserContext();
  const { t } = useTranslation();
  const [ownerDid] = useState(user.did);
  const [ownerDidErr, setOwnerDidErr] = useState(false);
  const [servicePK, setServicePK] = useState('');
  const [servicePKErr, setServicePKErr] = useState(false);
  const [serviceDIDContent, setServiceDIDContent] = useState('');
  const [pageLoaded, setPageLoaded] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState(false);
  const [repeatPwd, setRepeatPwd] = useState('');
  const [repeatPwdErr, setRepeatPwdErr] = useState(false);
  const [paymentReceivingAddress, setPaymentReceivingAddress] = useState('');
  const [paymentReceivingAddressErr, setPaymentReceivingAddressErr] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [nodeNameErr, setNodeNameErr] = useState(false);
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const [nodeDescription, setNodeDescription] = useState('');
  const [nodeDescriptionErr, setNodeDescriptionErr] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  const [serviceDIDPassword, storePass] = ['password', 'password'];

  const popUpErrorMsg = (msg) =>
    enqueueSnackbar(msg, {
      variant: 'error',
      anchorOrigin: { horizontal: 'right', vertical: 'top' }
    });

  const generateNewServiceDid = async () => {
    // Get root identity
    const store = await DIDStore.open(`/data/didCache/serviceDID`);
    let identity = await store.loadRootIdentity();
    if (!identity) {
      const mnemonic = Mnemonic.getInstance(Mnemonic.ENGLISH);
      identity = RootIdentity.createFromMnemonic(
        mnemonic.generate(),
        serviceDIDPassword,
        store,
        storePass,
        true
      );
    }
    store.setDefaultRootIdentity(identity);

    // clean existed DIDs.
    let dids = await store.listDids();
    if (dids) {
      // eslint-disable-next-line no-restricted-syntax
      for (const did of dids) {
        store.deleteDid(did);
      }
    }

    // create a new one.
    await identity.newDid(storePass);
    identity.getDid(0);

    // generate content.
    dids = await store.listDids();
    const didContent = await store.exportDid(dids[0], serviceDIDPassword, storePass);
    setServiceDIDContent(binary_to_base58(new Uint8Array(Buffer.from(didContent))));
    return `${dids[0].toString()}`;
  };

  const getCredentialFromOwner = async () => {
    try {
      const vc = await new ConDID.DIDAccess().issueCredential(
        servicePK,
        ['HiveNodeOwnerCredential', 'VerifiableCredential'],
        { did: servicePK },
        'hivenodeowner'
      );
      if (!vc) return null;

      return binary_to_base58(new Uint8Array(Buffer.from(vc.toString())));
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    generateNewServiceDid().then((didStr) => {
      setServicePK(didStr);
      setPageLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateEnvConfig = async () => {
    if (
      ownerDid &&
      servicePK &&
      password &&
      repeatPwd &&
      password === repeatPwd &&
      nodeName &&
      email &&
      nodeDescription
    ) {
      setDownloadOpen(true);
    } else {
      setOwnerDidErr(!ownerDid);
      setServicePKErr(!servicePK);
      setPasswordErr(!password);
      setNodeNameErr(!nodeName);
      setNodeDescriptionErr(!nodeDescription);
      setEmailErr(!email);
      setRepeatPwdErr(repeatPwd !== password);
    }
  };

  const handleSaveEnvConfig = async () => {
    setTipOpen(true);
    const nodeCredential = await getCredentialFromOwner();
    setTipOpen(false);
    if (!nodeCredential) {
      popUpErrorMsg('Failed to generate the credential.');
      return;
    }

    try {
      createHiveNodeEnvConfig(
        serviceDIDContent,
        serviceDIDPassword,
        password,
        nodeCredential,
        paymentReceivingAddress,
        nodeName,
        email,
        nodeDescription
      );
      enqueueSnackbar('Generating .env file success.', {
        variant: 'success',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
      navigate('/dashboard/node');
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Generating .env file failed.', {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
      });
    }
  };

  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <HeaderTypo sx={{ py: 1 }}>{t('node-envconfig-title')}</HeaderTypo>
      <ContainerBox mt={{ xs: 2.5, md: 5 }}>
        <Stack spacing={{ xs: 5, md: 7.5 }} mt={{ xs: 0, md: 1 }}>
          <CustomTextField
            placeholder="Owner DID"
            variant="standard"
            inputValue={`${ownerDid} (Owner DID)`}
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={ownerDidErr}
            errorText="Owner DID can not be empty"
            disabled
          />
          <CustomTextField
            placeholder="Service private Key"
            variant="standard"
            inputValue={`${servicePK} (Service DID)`}
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={servicePKErr}
            errorText="Service private key can not be empty"
            changeHandler={(value) => {
              setServicePK(value);
              setServicePKErr(false);
            }}
            disabled
          />
          <CustomTextField
            placeholder="Password"
            variant="standard"
            type="password"
            inputValue={password}
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={passwordErr}
            errorText="Password can not be empty"
            changeHandler={(value) => {
              setPassword(value);
              setPasswordErr(false);
            }}
          />
          <CustomTextField
            placeholder="Repeat password"
            variant="standard"
            type="password"
            inputValue={repeatPwd}
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={repeatPwdErr}
            errorText="Incorrect password"
            changeHandler={(value) => {
              setRepeatPwd(value);
              setRepeatPwdErr(value !== password);
            }}
          />
          <CustomTextField
            placeholder="Payment Receiving Address"
            variant="standard"
            inputValue={paymentReceivingAddress}
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={paymentReceivingAddressErr}
            errorText="Payment receiving address can not empty"
            changeHandler={(value) => {
              setPaymentReceivingAddress(value);
              setPaymentReceivingAddressErr(false);
            }}
          />
          <CustomTextField
            placeholder="Node name"
            variant="standard"
            inputValue={nodeName}
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={nodeNameErr}
            errorText="Node name can not be empty"
            changeHandler={(value) => {
              setNodeName(value);
              setNodeNameErr(false);
            }}
          />
          <CustomTextField
            placeholder="Node description"
            variant="standard"
            inputValue={nodeDescription}
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={nodeDescriptionErr}
            errorText="Node description can not be empty"
            changeHandler={(value) => {
              setNodeDescription(value);
              setNodeDescriptionErr(false);
            }}
          />
          <CustomTextField
            placeholder="Email"
            variant="standard"
            inputValue={email}
            fontSize={matchDownMd ? 10 : 20}
            height={matchDownMd ? 12 : 24}
            error={emailErr}
            errorText="Email can not be empty"
            changeHandler={(value) => {
              setEmail(value);
              setEmailErr(false);
            }}
          />
        </Stack>
        <Stack
          direction="row"
          mt={{ xs: 6, md: 7.5 }}
          mb={{ xs: 4, md: 12 }}
          spacing={{ xs: 1.5, md: 3 }}
        >
          <ConfirmButton
            onClick={() => navigate('/dashboard/node')}
            sx={{
              color: '#FF931E',
              background: 'transparent',
              border: { xs: '1px solid #FF931E', md: '2px solid #FF931E' }
            }}
          >
            {t('btn-back')}
          </ConfirmButton>
          <ConfirmButton onClick={handleGenerateEnvConfig} disabled={!pageLoaded}>
            {t('Generate .env file')}
          </ConfirmButton>
        </Stack>
      </ContainerBox>
      <EnvConfigDownloadDlg
        open={downloadOpen}
        onClickCancel={() => setDownloadOpen(false)}
        onClickDownload={handleSaveEnvConfig}
      />
      <CredentialIssueConfirmDlg open={tipOpen} />
    </>
  );
}
