import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Select, Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../Custom/CustomTypos';
import { PrimaryButton } from '../Custom/CustomButtons';
import { MenuItemStyle } from '../Custom/CustomContainer';

SelectBackupNodeDlg.propTypes = {
  dlgType: PropTypes.number.isRequired,
  activeNodes: PropTypes.array,
  fromNode: PropTypes.string,
  onClose: PropTypes.func,
  onClick: PropTypes.func,
  onProgress: PropTypes.bool
};

export default function SelectBackupNodeDlg({
  dlgType,
  activeNodes,
  fromNode,
  onClose,
  onClick,
  onProgress
}) {
  const [nodeList, setNodeList] = useState(activeNodes.filter((item) => item !== fromNode));
  const [selected, setSelected] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const availableNodes = activeNodes.filter((item) => item !== fromNode);
    // const availableNodes = ['hive-testnet2.trinity-tech.io', 'hive-testnet3.trinity-tech.io'];
    if (!availableNodes.length) onClose();
    else setNodeList(availableNodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNodes, fromNode]);

  const handleChange = (event) => {
    const selectedIndex = event.target.value;
    setSelected(selectedIndex);
    setError(false);
  };

  return (
    <Stack spacing={5} width={320}>
      <Stack alignItems="center">
        <DialogTitleTypo>Select Node</DialogTitleTypo>
      </Stack>
      <Stack spacing={1}>
        <Typography fontSize={16} fontWeight={400} textAlign="center">
          Select the node to {dlgType === 0 ? 'backup' : 'migrate'} your vault. (Need confirmed on
          the Essentials application)
        </Typography>
        <Stack spacing={0.5}>
          <Typography fontSize={12} fontWeight={700}>
            Node Provider
          </Typography>
          <Select
            variant="outlined"
            value={selected}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'Without label' }}
            size="small"
            sx={{
              mr: 0,
              width: '100%',
              height: '40px',
              borderRadius: '12px',
              alignItems: 'center',
              border: error ? '2px solid #EB5757' : 'none'
            }}
          >
            {nodeList.map((type, i) => (
              <MenuItemStyle
                key={i}
                value={i}
                autoFocus={selected === i}
                sx={{ display: i === selected ? 'none' : 'block' }}
              >
                {type}
              </MenuItemStyle>
            ))}
          </Select>
          {error > 0 && (
            <Typography fontSize={12} fontWeight={500} color="#EB5757">
              Node Provider should be selected.
            </Typography>
          )}
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2}>
        <PrimaryButton btncolor="secondary" fullWidth onClick={onClose}>
          close
        </PrimaryButton>
        <PrimaryButton
          fullWidth
          onClick={() => {
            if (selected !== undefined && selected !== null)
              onClick(nodeList.length && selected < nodeList.length ? nodeList[selected] : '');
            else setError(selected === undefined || selected === null);
          }}
          disabled={onProgress}
        >
          confirm
        </PrimaryButton>
      </Stack>
    </Stack>
  );
}
