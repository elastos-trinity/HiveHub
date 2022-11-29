import * as React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import * as DotMap from 'dotted-map';
import DottedMap from 'dotted-map/without-countries';

const { getMapJSON } = DotMap;
const mapJsonString = getMapJSON({
  width: 100,
  grid: 'diagonal'
});
const map = new DottedMap({ map: JSON.parse(mapJsonString) });

NodesMapView.propTypes = {
  nodes: PropTypes.array,
  sx: PropTypes.object
};

export default function NodesMapView({ nodes = [], sx = {} }) {
  const svgMap = map.getSVG({
    shape: 'hexagon',
    radius: 0.22,
    color: '#B3B3B3',
    backgroundColor: '#1D1F21'
  });
  const [srcMap, setSrcMap] = React.useState(svgMap);

  React.useEffect(() => {
    const nullIndex = nodes.indexOf(0);
    if (nullIndex === -1) {
      nodes.forEach((item) => {
        if (item?.latitude && item?.longitude) {
          let color = '#B3B3B3'; // blank
          if (item?.status === true) color = '#67B674'; // online
          else if (item?.status === false) color = '#E23A45'; // offline
          else color = '#FF881B'; // connecting
          map.addPin({
            lat: item.latitude,
            lng: item.longitude,
            svgOptions: { color, radius: 0.22 }
          });
        }
      });
      const svgMap = map.getSVG({
        shape: 'hexagon',
        radius: 0.22,
        color: '#B3B3B3',
        backgroundColor: '#1D1F21'
      });
      setSrcMap(svgMap);
    }
  }, [nodes]);

  return (
    <Box
      component="img"
      src={`data:image/svg+xml;utf8,${encodeURIComponent(srcMap)}`}
      alt="world_map"
      height="100%"
      sx={{ ...sx }}
    />
  );
}
