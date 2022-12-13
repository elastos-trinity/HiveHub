import { useState } from 'react';
import { Stack, Divider, Box, List, ListItem, ListItemText } from '@mui/material';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { SettingTitleTypo, LabelTypo, NormalTypo } from '../../../components/Custom/CustomTypos';
import { useLanguageContext } from '../../../contexts/LanguageContext';

export default function LanguageSettings() {
  const { t } = useTranslation();
  const { language, setLanguage, changeLanguage } = useLanguageContext();
  const [selected, setSelected] = useState(language === 'en' ? 0 : 1);

  const languageData = [
    { title: 'English', value: t('settings-language-english') },
    { title: '中文 (简体)', value: t('settings-language-chinese-simplified') }
  ];

  const handleChange = (id) => {
    if (id === 0) {
      setLanguage('en');
      changeLanguage('en');
    } else {
      setLanguage('zh');
      changeLanguage('zh');
    }
    setSelected(id);
  };

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
        <NormalTypo sx={{ textAlign: 'left', width: '100%' }}>
          {t('settings-language-title')}
        </NormalTypo>
        <List sx={{ p: 0, width: '100%' }}>
          {languageData.map((item, _i) => (
            <Box key={_i} sx={{ width: '100%', pt: _i ? 2 : 0 }}>
              <ListItem button sx={{ p: 0 }} onClick={() => handleChange(_i)}>
                <Stack
                  direction="row"
                  sx={{ width: '100%', color: 'text.primary' }}
                  alignItems="center"
                >
                  <ListItemText
                    primary={
                      <SettingTitleTypo sx={{ fontWeight: 700 }}>{item.title}</SettingTitleTypo>
                    }
                    secondary={
                      <LabelTypo
                        component="span"
                        my={1}
                        ml={0.5}
                        sx={{ color: 'rgba(196, 196, 196, 0.5)' }}
                      >
                        {item.value}
                      </LabelTypo>
                    }
                  />
                  {selected === _i && (
                    <Icon icon="akar-icons:check" fontSize="20pt" color="#FF931E" />
                  )}
                </Stack>
              </ListItem>
              <Divider sx={{ border: '1px solid #323B45' }} />
            </Box>
          ))}
        </List>
      </Stack>
    </Box>
  );
}
