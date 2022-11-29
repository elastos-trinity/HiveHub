import * as React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import * as DotMap from 'dotted-map';
import DottedMap from 'dotted-map/without-countries';

NodesMapView.propTypes = {
  nodes: PropTypes.array,
  sx: PropTypes.object
};

export default function NodesMapView({ nodes = [], sx = {} }) {
  const { getMapJSON } = DotMap;
  const mapJsonString = getMapJSON({ height: 100, grid: 'diagonal' });
  const map = new DottedMap({ map: JSON.parse(mapJsonString) });

  map.addPin({
    lat: 40.73061,
    lng: -73.935242,
    svgOptions: { color: '#d6ff79', radius: 0.4 }
  });

  const svgMap = map.getSVG({
    shape: 'hexagon', // if you use hexagon, prefer the grid `diagonal`
    radius: 0.22,
    color: '#B3B3B3',
    backgroundColor: '#1D1F21'
  });

  return (
    <Box sx={{ ...sx }}>
      <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`} alt="" />
    </Box>
  );
}
