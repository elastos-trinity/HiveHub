import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-scroll';
import { LandingTitleTypo } from '../../components/CustomTypos';
import { LinkButton } from '../../components/CustomButtons';
import { FeatureGrid } from '../../components/CustomContainer';
import useConnectEE from '../../hooks/useConnectEE';
import { useUserContext } from '../../contexts/UserContext';
import SmallHexagon from '../../components/SmallHexagon';
import HexagonShape from '../../components/HexagonShape';
import generatedGitInfo from '../../generatedGitInfo.json';
import { config } from '../../config';

// CustomBox.propTypes = {
//   children: PropTypes.node
// };

// function CustomBox({ children }) {
//   return (
//     <Box
//       sx={{
//         margin: '20px auto',
//         width: '25px',
//         height: '25px',
//         borderRadius: '50%',
//         boxShadow: '0px 0px 20px 4px rgba(255, 147, 30, 0.3)'
//       }}
//     >
//       <SmallHexagon
//         borderColor="#FF931E"
//         rootHexagon
//         sideLength={15}
//         borderWidth={0}
//         backColor="white"
//       >
//         <Typography variant="body2" sx={{ color: '#FF931E', height: '15px', lineHeight: '15px' }}>
//           {children}
//         </Typography>
//       </SmallHexagon>
//     </Box>
//   );
// }

export default function LandingPage() {
  const { isConnectedEE, signInWithEssentials, signOutWithEssentialsWithoutRefresh } =
    useConnectEE();
  const { user } = useUserContext();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const matchMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const login = async () => {
    setLoading(true);
    if (isConnectedEE) {
      await signOutWithEssentialsWithoutRefresh();
      await signInWithEssentials();
    } else {
      await signInWithEssentials();
    }
    setLoading(false);
  };

  return (
    <Container
      maxWidth="1000"
      sx={{ pt: 15, pb: 2.5, overflow: 'hidden', position: 'relative', zIndex: 10 }}
    >
      <Box
        sx={{
          background: `url('/static/img_landing_graph.svg')`,
          width: '100%',
          height: '100%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          paddingBottom: '500px'
        }}
      >
        <Box mt={{ xs: '70px', md: '135px' }} sx={{ position: 'relative' }}>
          <LandingTitleTypo>
            <span style={{ color: '#FF931E' }}>Your</span>
            <span style={{ color: '#FFFFFF' }}> Decentralized Storage</span>
          </LandingTitleTypo>
          <LandingTitleTypo sx={{ color: '#FF931E' }}>Manager</LandingTitleTypo>
          <Box
            sx={{
              position: 'absolute',
              top: '-10vw',
              right: '12vw',
              zIndex: 1
            }}
          >
            <HexagonShape size={matchMdUp ? 1 : 0.3} blurVal={10} opacityVal={0.3} width={7} />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '-3vw',
              left: { xs: '-15vw', md: '10vw' },
              zIndex: 1
            }}
          >
            <HexagonShape
              size={matchMdUp ? 2 : 0.6}
              blurVal={matchMdUp ? 20 : 7.5}
              opacityVal={matchMdUp ? 0.4 : 0.3}
              width={matchMdUp ? 15 : 7.5}
            />
          </Box>
        </Box>
        <Stack
          direction="row"
          spacing={{ xs: 2.5, md: 5 }}
          mt={{ xs: '50px', md: '40px' }}
          justifyContent="center"
          sx={{ position: 'relative' }}
        >
          {!user.did ? (
            <LinkButton btncolor="#FF931E" variant="outlined" onClick={login} disabled={loading}>
              Sign in with DID
            </LinkButton>
          ) : (
            <LinkButton
              btncolor="#FF931E"
              variant="outlined"
              onClick={() => navigate('/dashboard/home')}
            >
              Dashboard
            </LinkButton>
          )}
          <LinkButton
            btncolor="#FFFFFF"
            variant="outlined"
            target="_blank"
            href={config.GitHubRepo}
          >
            GitHub
          </LinkButton>
          <Box
            sx={{
              position: 'absolute',
              top: { xs: '20vw', md: '5vw' },
              right: { xs: '-15vw', md: '-10vw' },
              zIndex: 1
            }}
          >
            <HexagonShape
              size={matchMdUp ? 3 : 0.9}
              blurVal={matchMdUp ? 40 : 17.5}
              opacityVal={matchMdUp ? 0.7 : 0.6}
              width={matchMdUp ? 30 : 15}
            />
          </Box>
        </Stack>
      </Box>
      <Box
        sx={{
          backgroundColor: 'white',
          width: '100%',
          maxWidth: '1600px',
          minHeight: '420px',
          margin: '80px auto',
          padding: '20px',
          background: 'rgba(255, 147, 30, 0.05)',
          boxShadow: '0px 0px 100px rgba(0, 0, 0, 0.05)',
          borderRadius: '50px',
          position: 'relative',
          zIndex: 10
        }}
      >
        <Typography
          sx={{
            color: '#FFFFFF',
            textAlign: 'center',
            font: 'Montserrat',
            fontStyle: 'normal',
            fontWeight: 700,
            margin: '10px 0 50px',
            fontSize: { xs: '20px', md: '60px' },
            lineHeight: { xs: '24px', md: '73px' }
          }}
        >
          Features
        </Typography>
        <Grid container direction="row" alignItems="center" justifyContent="space-around">
          <FeatureGrid item xs={12} sm={6} md={3} sx={{ position: 'relative', top: '2px' }}>
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
                  sx={{ color: '#FFC98F', height: '30px', lineHeight: '32px' }}
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
            <span style={{ color: '#FFFFFF' }}>Deploy Node</span>
          </FeatureGrid>
          <FeatureGrid item xs={12} sm={6} md={3}>
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
            <span style={{ color: '#FFFFFF' }}>Create Vault</span>
          </FeatureGrid>
          <FeatureGrid item xs={12} sm={6} md={3}>
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
            <span style={{ color: '#FFFFFF' }}>Backup</span>
          </FeatureGrid>
          <FeatureGrid item xs={12} sm={6} md={3}>
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
            <span style={{ color: '#FFFFFF' }}>Migrate</span>
          </FeatureGrid>
        </Grid>
      </Box>
      <Box sx={{ pt: { xs: 10, md: 20 } }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ textAlign: 'center' }}
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            sx={{
              fontSize: { xs: '15px', md: '20px' },
              lineHeight: '50px',
              fontWeight: 400,
              fontFamily: 'Red Hat Display',
              color: '#000'
            }}
          >
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
