import * as React from 'react';
import PropTypes from 'prop-types';
// import * as DotMap from 'dotted-map';
// import DottedMap from 'dotted-map/without-countries';
import mapPattern from './map.json';
import { MAP_WIDTH, MAP_HEIGHT, getHexFromCircle } from './utils';
import NodePopup from './NodePopup';

// const { getMapJSON } = DotMap;
// const mapJsonString = getMapJSON({
//   width: 100,
//   grid: 'diagonal'
// });
// const map = new DottedMap({ map: JSON.parse(mapJsonString) });

NodesMapView.propTypes = {
  nodes: PropTypes.array,
  isLoading: PropTypes.bool
};

export default function NodesMapView({ nodes = [], isLoading }) {
  // const svgMap = map.getSVG({
  //   shape: 'hexagon',
  //   radius: 0.22,
  //   color: '#B3B3B3',
  //   backgroundColor: '#1D1F21'
  // });
  // const [srcMap, setSrcMap] = React.useState(svgMap);

  // React.useEffect(() => {
  //   const nullIndex = nodes.indexOf(0);
  //   if (nullIndex === -1) {
  //     nodes.forEach((item) => {
  //       if (item?.latitude && item?.longitude) {
  //         let color = '#B3B3B3'; // blank
  //         if (item?.status === true) color = '#67B674'; // online
  //         else if (item?.status === false) color = '#E23A45'; // offline
  //         else color = '#FF881B'; // connecting
  //         map.addPin({
  //           lat: item.latitude,
  //           lng: item.longitude,
  //           svgOptions: { color, radius: 0.22 }
  //         });
  //       }
  //     });
  //     console.log(map.getPoints());
  //     const svgMap = map.getSVG({
  //       shape: 'hexagon',
  //       radius: 0.22,
  //       color: '#B3B3B3',
  //       backgroundColor: '#1D1F21'
  //     });
  //     setSrcMap(svgMap);
  //   }
  // }, [nodes]);

  const [nodeList, setNodeList] = React.useState(nodes);

  React.useEffect(() => {
    if (!isLoading) {
      const grouped = nodes.reduce((acc, item) => {
        const lng = Math.round(item?.longitude ?? 0);
        const lat = Math.round(item?.latitude ?? 0);
        if (!acc.length) {
          acc = [{ longitude: lng, latitude: lat, data: [item] }];
        } else {
          const idx = acc.findIndex((el) => el.longitude === lng && el.latitude === lat);
          if (idx === -1) {
            acc = [...acc, { longitude: lng, latitude: lat, data: [item] }];
          } else {
            acc[idx].data.push(item);
          }
        }
        return acc;
      }, {});
      setNodeList(grouped);
    }
  }, [isLoading, nodes]);

  const handleAccess = (nId) => {
    console.log('====', nId);
  };

  return (
    <>
      {/* <Box
        component="img"
        src={`data:image/svg+xml;utf8,${encodeURIComponent(srcMap)}`}
        alt="world_map"
        height="100%"
      /> */}
      <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} stroke="#FF0000" fill="#FF0000">
        {mapPattern.map((item, index) => (
          <polygon
            key={index}
            points={getHexFromCircle(item.x, item.y, 3)}
            stroke="#1D1F21"
            fill="#B3B3B3"
            strokeWidth="1"
            onClick={() => {}}
          />
        ))}
        {!isLoading &&
          nodeList.map((item, index) => (
            <NodePopup
              key={index}
              data={item}
              isLoading={isLoading}
              onClick={(nId) => handleAccess(nId)}
            />
          ))}
      </svg>
    </>
  );
}
