export const MAP_WIDTH = 845.2;
export const MAP_HEIGHT = 458;
export const getMapX = (longitude) => (MAP_WIDTH / 360.0) * (180 + longitude) - 20.5;
export const getMapY = (latitude) => (MAP_HEIGHT / 180.0) * (90 - latitude) + 60;
export const getHexFromCircle = (rx, ry, rd) => {
  const rate1 = 0.5;
  const rate2 = Math.sqrt(3) * 0.5;
  return `${rx - rate1 * rd} ${ry + rate2 * rd},${rx + rate1 * rd} ${ry + rate2 * rd},${
    rx + rd
  } ${ry},${rx + rate1 * rd} ${ry - rate2 * rd},${rx - rate1 * rd} ${ry - rate2 * rd},${
    rx - rd
  } ${ry}`;
};
