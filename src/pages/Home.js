import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { LandingTitleTypo } from '../components/Custom/CustomTypos';
import { LinkButton } from '../components/Custom/CustomButtons';
import useConnectEE from '../hooks/useConnectEE';
import { useUserContext } from '../contexts/UserContext';
import HexagonShape from '../components/HexagonShape';
import FeaturePanel from '../components/Home/FeaturePanel';
import PublicNodes from '../components/Home/PublicNodes';
import { config } from '../config';

export default function HomePage() {
  const { isConnectedEE, signInWithEssentials, signOutWithEssentialsWithoutRefresh } =
    useConnectEE();
  const { user } = useUserContext();
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

  const handleSeeMore = async () => {
    if (user.did) navigate('/dashboard/explore');
    else {
      await login();
      navigate('/dashboard/explore');
    }
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
          paddingBottom: { xs: '250px', md: '500px' }
        }}
      >
        <Box mt={{ xs: '70px', md: '135px' }} sx={{ position: 'relative' }}>
          {matchMdUp ? (
            <>
              <LandingTitleTypo>
                <span style={{ color: '#FF931E' }}>Your</span> Decentralized Storage
              </LandingTitleTypo>
              <LandingTitleTypo sx={{ color: '#FF931E' }}>Manager</LandingTitleTypo>
            </>
          ) : (
            <>
              <LandingTitleTypo>
                <span style={{ color: '#FF931E' }}>Your</span> Decentralized
              </LandingTitleTypo>
              <LandingTitleTypo>
                Storage <span style={{ color: '#FF931E' }}>Manager</span>
              </LandingTitleTypo>
            </>
          )}
          <Box
            sx={{
              position: 'absolute',
              top: { xs: '-20vw', sm: '-15vw', md: '-10vw' },
              right: { xs: '8vw', sm: '10vw', md: '12vw' },
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
          mt={7.5}
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
              onClick={() => navigate('/dashboard/node')}
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
        </Stack>
      </Box>
      <Box sx={{ px: 2 }}>
        <FeaturePanel />
      </Box>
      <PublicNodes onClick={handleSeeMore} />
      <Typography
        sx={{
          fontSize: { xs: '15px', md: '20px' },
          lineHeight: '50px',
          fontWeight: 400,
          fontFamily: 'Red Hat Display',
          color: '#FFF',
          textAlign: 'center',
          mt: { xs: 10, md: 20 },
          mb: { xs: 2, md: 4 }
        }}
      >
        @ 2022 Trinity Tech Ltd.
      </Typography>
    </Container>
  );
}
