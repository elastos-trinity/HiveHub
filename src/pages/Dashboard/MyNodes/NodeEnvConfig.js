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
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PageTitleTypo } from '../../../components/CustomTypos';
import { ConfirmButton } from '../../../components/CustomButtons';
import { ContainerBox } from '../../../components/CustomContainer';
import { useUserContext } from '../../../contexts/UserContext';
import CustomTextField from '../../../components/CustomTextField';
import { createHiveNodeEnvConfig } from '../../../service/fetch';

export default function NodeEnvConfig() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUserContext();
  const [ownerDid] = useState(user.did);
  const [ownerDidErr, setOwnerDidErr] = useState(false);
  const [servicePK, setServicePK] = useState('');
  const [serviceDIDContent, setServiceDIDContent] = useState('');
  const [pageLoaded, setPageLoaded] = useState(false);
  const [servicePKErr, setServicePKErr] = useState(false);
  const [paymentReceivingAddress, setPaymentReceivingAddress] = useState('');
  const [paymentReceivingAddressErr, setPaymentReceivingAddressErr] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [nodeNameErr, setNodeNameErr] = useState(false);
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const [nodeDescription, setNodeDescription] = useState('');
  const [nodeDescriptionErr, setNodeDescriptionErr] = useState(false);

  const [open, setOpen] = useState(false);

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
      identity = await RootIdentity.createFromMnemonic(
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
    // const doc = await identity.newDid(storePass);
    // const did = await identity.getDid(0);

    // generate content.
    dids = await store.listDids();
    const didContent = await store.exportDid(dids[0], serviceDIDPassword, storePass);
    setServiceDIDContent(binary_to_base58(new Uint8Array(Buffer.from(didContent))));
    return `${dids[0].toString()}`;
  };

  useEffect(() => {
    generateNewServiceDid().then((didStr) => {
      setServicePK(didStr);
      setPageLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveEnvConfig = async () => {
    async function getCredentialFromOwner() {
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
    }

    if (ownerDid && servicePK && nodeName && email && nodeDescription) {
      setOpen(true);
      const nodeCredential = await getCredentialFromOwner();
      setOpen(false);
      if (!nodeCredential) {
        popUpErrorMsg('Failed to generate the credential.');
        return;
      }

      try {
        createHiveNodeEnvConfig(
          serviceDIDContent,
          serviceDIDPassword,
          storePass,
          nodeCredential,
          paymentReceivingAddress,
          nodeName,
          email,
          nodeDescription
        );
        enqueueSnackbar('Create Hive Node ENV success.', {
          variant: 'success',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
        navigate('/dashboard/nodes');
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Creating Hive Node ENV failed.', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
      }
    } else {
      setOwnerDidErr(!ownerDid);
      setServicePKErr(!servicePK);
      setNodeNameErr(!nodeName);
      setEmailErr(!email);
      setNodeDescriptionErr(!nodeDescription);
    }
  };

  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <PageTitleTypo mt={{ xs: 5, md: 6 }}>Env Configuration</PageTitleTypo>
      <ContainerBox mt={{ xs: 2.5, md: 5 }}>
        <Stack spacing={{ xs: 5, md: 7.5 }} mt={{ xs: 3.75, md: 5 }}>
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
          <ConfirmButton onClick={handleSaveEnvConfig} disabled={!pageLoaded}>
            Confirm
          </ConfirmButton>
        </Stack>
      </ContainerBox>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Operation Tip</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please open Essentials application, and confirm the credential issuing dialog.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
