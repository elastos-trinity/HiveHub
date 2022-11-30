import { Stack, Grid, Divider, Box, Link } from '@mui/material';
import { SettingTitleTypo, LabelTypo } from '../../../components/Custom/CustomTypos';
import generatedGitInfo from '../../../generatedGitInfo.json';
import { config } from '../../../config';

const aboutData = [
  {
    title: 'Website',
    value: config.IsProductEnv ? 'https://hivehub.xyz' : 'https://testnet.hivehub.xyz'
  },
  { title: 'Email', value: 'hivehub@trinity-tech.io' },
  { title: 'Github', value: 'https://github.com/elastos-trinity/HiveHub.WebApp' },
  { title: 'Version', value: 'v1.0.1' },
  { title: 'Commit ID', value: generatedGitInfo.gitCommitHash }
];

export default function AboutSettings() {
  return (
    <Box
      sx={{
        px: { xs: 4, md: 8 },
        py: { xs: 3.5, md: 7 },
        background: 'rgba(255, 147, 30, 0.05)',
        borderRadius: '20px',
        width: '100%'
      }}
    >
      <Stack spacing={6} alignItems="center">
        <Box component="img" alt="hivehub" src="/static/Logo.svg" height={{ sx: 60, md: 90 }} />
        <Grid container direction="column">
          {aboutData.map((item, _i) => (
            <Grid item key={_i} pt={_i ? 2 : 0}>
              <SettingTitleTypo sx={{ fontWeight: 700 }}>{item.title}</SettingTitleTypo>
              {item.value.startsWith('https://') ? (
                <Link href={item.value} underline="none" target="_blank">
                  <LabelTypo my={1} ml={0.5} sx={{ color: 'rgba(196, 196, 196, 0.5)' }}>
                    {item.value}
                  </LabelTypo>
                </Link>
              ) : (
                <LabelTypo my={1} ml={0.5} sx={{ color: 'rgba(196, 196, 196, 0.5)' }}>
                  {item.value}
                </LabelTypo>
              )}
              <Divider sx={{ border: '1px solid #323B45' }} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}
