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
  nodes: PropTypes.array
};

export default function NodesMapView({ nodes = [] }) {
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

  // nodes = [
  //   {
  //     latitude: 43,
  //     longitude: -79,
  //     status: true,
  //     name: 'Rong',
  //     created: 1669721460,
  //     remark: 'mock hive node 1',
  //     url: 'testnet-hive1.trinity-tech.io',
  //     owner_did: 'did:elastos:ijvDXRSCwFF9uMzpdLMZJW2e8i6xSjAkxQ'
  //   },
  //   {
  //     latitude: 20,
  //     longitude: 73,
  //     status: false,
  //     name: 'Frost',
  //     created: 1669721460,
  //     remark: 'mock hive node 2',
  //     url: 'testnet-hive2.trinity-tech.io',
  //     owner_did: 'did:elastos:ijvDXRSCwFF9uMzpdLMZJW2e8i6xSjAkxQ'
  //   }
  // ];
  const isLoaded = nodes.length > 0 && Object.keys(nodes[0]).length > 0;

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
            points={getHexFromCircle(item.x, item.y, 3.5)}
            stroke="#1D1F21"
            fill="#B3B3B3"
            strokeWidth="1"
            onClick={() => {}}
          />
        ))}
        {isLoaded &&
          nodes.map((item, index) => (
            <NodePopup
              key={index}
              longitude={item.longitude}
              latitude={item.latitude}
              name={item?.name || ''}
              status={item?.status}
              time={item?.created}
              description={item?.remark}
              endpoint={item?.url}
              ownerDid={item?.owner_did || ''}
            />
          ))}
      </svg>
    </>
  );
}
