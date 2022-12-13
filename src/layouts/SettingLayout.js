import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Typography, Stack, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { HeaderTypo } from '../components/Custom/CustomTypos';

export default function SettingLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState(pathname.split('/')[2]); // value can be 'home' 'explore' 'nodes' 'vaults'

  useEffect(() => {
    const segPath = pathname.split('/').filter((item) => item);
    if (segPath.length) setActiveSection(segPath[2]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const subMenuItemsList = [
    {
      title: t('settings-menu-about'),
      path: '/dashboard/settings/about',
      label: 'about'
    },
    {
      title: t('settings-menu-language'),
      path: '/dashboard/settings/language',
      label: 'language'
    }
  ];

  return (
    <>
      <HeaderTypo sx={{ py: 1 }}>{t('settings-title')}</HeaderTypo>
      <Stack direction="row" mt={{ xs: 2.5, md: 5 }} spacing={6}>
        <Stack
          sx={{
            background: 'rgba(255, 147, 30, 0.05)',
            borderRadius: '30px',
            px: { xs: 2, md: 5 },
            py: { xs: 2, md: 2.5 },
            width: { xs: '120px', md: '270px' },
            height: 'fit-content'
          }}
          spacing={1}
        >
          {subMenuItemsList.map((item, index) => (
            <Box
              key={`sidebar-menu-${index}`}
              onClick={() => navigate(item.path)}
              sx={{ cursor: 'pointer' }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                spacing="15px"
                py={1}
              >
                <Typography
                  sx={{
                    fontWeight: activeSection === item.label ? 700 : 400,
                    fontSize: '18px',
                    lineHeight: '28px',
                    color: '#FFF'
                  }}
                >
                  {item.title}
                </Typography>
              </Stack>
            </Box>
          ))}
        </Stack>
        <Outlet />
      </Stack>
    </>
  );
}
