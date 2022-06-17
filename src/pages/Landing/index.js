import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Grid, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import useUser from '../../hooks/useUser';
import SmallHexagon from '../../components/SmallHexagon';
import generatedGitInfo from '../../generatedGitInfo.json';

const ConnectButton = styled(Button)({
  color: '#FF931E',
  borderColor: '#FF931E',
  height: '46px',
  borderRadius: '23px',
  display: 'inline-box',
  marginRight: '20px',
  '&:hover': {
    borderColor: '#FF931E',
    backgroundColor: 'white'
  }
});

const GitHubButton = styled(Button)({
  color: 'black',
  borderColor: 'black',
  height: '46px',
  borderRadius: '23px',
  display: 'inline-box',
  marginRight: '20px',
  '&:hover': {
    borderColor: 'black',
    backgroundColor: 'white'
  }
});

const MyGrid = styled(Grid)({
  textAlign: 'center',
  padding: '20px 0 30px'
});

CustomBox.propTypes = {
  children: PropTypes.node
};

function CustomBox({ children }) {
  return (
    <Box
      sx={{
        margin: '20px auto',
        width: '25px',
        height: '25px',
        borderRadius: '50%',
        boxShadow: '0px 0px 20px 4px rgba(255, 147, 30, 0.3)'
      }}
    >
      <SmallHexagon
        borderColor="#FF931E"
        rootHexagon
        sideLength={15}
        borderWidth={0}
        backColor="white"
      >
        <Typography variant="body2" sx={{ color: '#FF931E', height: '15px', lineHeight: '15px' }}>
          {children}
        </Typography>
      </SmallHexagon>
    </Box>
  );
}

export default function LandingPage() {
  const { user, isConnetedEE, signInWithEssentials, signOutWithEssentialsWithoutRefresh } =
    useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    setLoading(true);
    if (isConnetedEE) {
      await signOutWithEssentialsWithoutRefresh();
      await signInWithEssentials();
    } else {
      await signInWithEssentials();
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="1000" sx={{ pt: 15, pb: 2.5 }}>
      <Box>
        <Box
          sx={{ maxWidth: '800px', height: '160px', lineHeight: '80px', margin: '140px auto 0' }}
        >
          <Typography variant="h1" sx={{ font: 'Montserrat', textAlign: 'center' }}>
            Manage{' '}
            <Box component="span" sx={{ color: '#FF931E' }}>
              your
            </Box>{' '}
            Decentralized Storage
          </Typography>
        </Box>
        <Box sx={{ height: '40px', lineHeight: '40px' }}>
          <Typography
            sx={{
              font: 'Montserrat',
              textAlign: 'center',
              height: '40px',
              lineHeight: '40px',
              fontSize: '20px'
            }}
          >
            with Elastos
          </Typography>
        </Box>
        <Box sx={{ margin: '40px auto', textAlign: 'center' }}>
          {!user.did ? (
            <ConnectButton variant="outlined" onClick={login} disabled={loading}>
              Connect Wallet
            </ConnectButton>
          ) : (
            <ConnectButton variant="outlined" onClick={() => navigate('/dashboard/home')}>
              Dashboard
            </ConnectButton>
          )}
          <GitHubButton
            variant="outlined"
            target="_blank"
            href="https://github.com/elastos/Elastos.Hive.Node"
          >
            GitHub
          </GitHubButton>
        </Box>

        <Box
          sx={{
            width: '25px',
            height: '40px',
            borderRadius: '25px',
            border: '1px solid black',
            margin: '140px auto 0',
            textAlign: 'center'
          }}
        >
          {' '}
        </Box>
        <Box
          sx={{
            width: '2px',
            height: '12px',
            border: '1px solid black',
            margin: '0 auto',
            position: 'relative',
            top: '-17px'
          }}
        >
          {' '}
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: 'white',
          width: '100%',
          maxWidth: '1600px',
          minHeight: '420px',
          margin: '60px auto',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 20px'
        }}
      >
        <Typography
          variant="h3"
          sx={{ textAlign: 'center', font: 'Montserrat', margin: '10px 0 50px' }}
        >
          Features
        </Typography>
        <Grid container direction="row" alignItems="center" justifyContent="space-around">
          <MyGrid item xs={12} sm={6} md={3} sx={{ position: 'relative', top: '2px' }}>
            <Box sx={{ margin: '40px 0 40px' }}>
              <SmallHexagon
                borderColor="#FF931E"
                rootHexagon
                sideLength={30}
                borderWidth={2}
                backColor="transparent"
              >
                <Typography
                  variant="h3"
                  sx={{ color: '#FF931E', height: '30px', lineHeight: '32px' }}
                >
                  +
                </Typography>

                <Box
                  sx={{
                    transform: 'rotate(300deg)',
                    position: 'absolute',
                    top: '-23px',
                    left: '-22px'
                  }}
                >
                  <Box
                    sx={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '8px',
                      backgroundColor: '#FFC98F'
                    }}
                  />
                  <Box
                    sx={{
                      width: '2px',
                      height: '16px',
                      backgroundColor: '#FFC98F',
                      marginLeft: '7px'
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    transform: 'rotate(120deg)',
                    position: 'absolute',
                    top: '21px',
                    left: '53px'
                  }}
                >
                  <Box
                    sx={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '8px',
                      backgroundColor: '#FFC98F'
                    }}
                  />
                  <Box
                    sx={{
                      width: '2px',
                      height: '16px',
                      backgroundColor: '#FFC98F',
                      marginLeft: '7px'
                    }}
                  />
                </Box>
              </SmallHexagon>
            </Box>
            <CustomBox>1</CustomBox>
            Register Hive Node
          </MyGrid>
          <MyGrid item xs={12} sm={6} md={3}>
            <Box sx={{ margin: '30px 0 40px' }}>
              <Box
                sx={{
                  width: '70px',
                  height: '70px',
                  lineHeight: '70px',
                  margin: '0 auto',
                  borderRadius: '5px',
                  border: '2px solid #FF931E'
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ color: '#FF931E', height: '70px', lineHeight: '70px' }}
                >
                  +
                </Typography>
              </Box>
            </Box>
            <CustomBox>2</CustomBox>
            Create Vault
          </MyGrid>
          <MyGrid item xs={12} sm={6} md={3}>
            <Box sx={{ margin: '30px 0 40px' }}>
              <Box
                sx={{
                  width: '65px',
                  height: '65px',
                  margin: '0 auto',
                  borderRadius: '5px',
                  border: '2px solid #FF931E',
                  boxShadow: ' 8px -8px 0px 0px rgba(255, 201, 143, 1)',
                  position: 'relative',
                  top: '5px',
                  left: '-5px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Box
                  sx={{
                    color: '#FF931E',
                    height: '20px',
                    width: '20px',
                    margin: '0 auto',
                    borderRadius: '10px',
                    border: '2px solid #FF931E'
                  }}
                />
              </Box>
            </Box>
            <CustomBox>3</CustomBox>
            Backup Vault
          </MyGrid>
          <MyGrid item xs={12} sm={6} md={3}>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              spacing={0.5}
              sx={{ margin: '30px 0 40px' }}
            >
              <Grid item>
                <Box
                  sx={{
                    width: '65px',
                    height: '65px',
                    margin: '0 auto',
                    borderRadius: '5px',
                    border: '2px solid #FF931E',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Box
                    sx={{
                      color: '#FF931E',
                      height: '20px',
                      width: '20px',
                      margin: '0 auto',
                      borderRadius: '10px',
                      border: '2px solid #FF931E'
                    }}
                  />
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    width: '35px',
                    height: '35px',
                    margin: '0 auto',
                    borderRadius: '5px',
                    backgroundColor: 'rgba(255, 212, 165, 1)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Box
                    sx={{
                      color: '#FF931E',
                      height: '10px',
                      width: '10px',
                      margin: '0 auto',
                      borderRadius: '10px',
                      border: '2px solid white'
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
            <CustomBox>4</CustomBox>
            Migrate Vault
          </MyGrid>
        </Grid>
      </Box>

      <Box sx={{ padding: '200px 0 0' }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ textAlign: 'center' }}
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            @ 2022 Trinity Tech Ltd.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#1890FF',
              paddingX: 1,
              paddingY: 0.5,
              borderRadius: 2,
              background: '#E8F4FF'
            }}
          >
            v1 - {generatedGitInfo.gitCommitHash}
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
}
