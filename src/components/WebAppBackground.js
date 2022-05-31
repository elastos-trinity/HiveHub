import { Box } from '@mui/material';
import Hexagon from './Hexagon';

export default function WebAppBackground() {
  return (
    <Box
      sx={{
        background: 'rgba(255, 147, 30, 0.03)',
        width: '100%',
        minWidth: '1584.83px',
        minHeight: '150vh',
        position: 'absolute',
        top: '-460px',
        zIndex: '-1'
      }}
    >
      <Hexagon sideLength={896.5} borderColor="white" rootHexagon>
        <Hexagon sideLength={853} borderColor="white">
          <Hexagon sideLength={809.5} borderColor="white">
            <Hexagon sideLength={766} borderColor="white">
              <Hexagon sideLength={722.5} borderColor="white">
                <Hexagon sideLength={679} borderColor="white">
                  <Hexagon sideLength={635.5} borderColor="white">
                    <Hexagon sideLength={592} borderColor="white">
                      <Hexagon sideLength={548.5} borderColor="white">
                        <Hexagon sideLength={505} borderColor="white">
                          <Hexagon sideLength={461.5} borderColor="white">
                            <Hexagon sideLength={418} borderColor="white">
                              <Hexagon sideLength={374.5} borderColor="white">
                                <Hexagon sideLength={331} borderColor="white">
                                  <Hexagon sideLength={287.5} borderColor="white">
                                    <Hexagon sideLength={244} borderColor="white">
                                      <Hexagon sideLength={200.5} borderColor="white">
                                        <Hexagon sideLength={157} borderColor="white">
                                          <Hexagon sideLength={113.5} borderColor="white" />
                                        </Hexagon>
                                      </Hexagon>
                                    </Hexagon>
                                  </Hexagon>
                                </Hexagon>
                              </Hexagon>
                            </Hexagon>
                          </Hexagon>
                        </Hexagon>
                      </Hexagon>
                    </Hexagon>
                  </Hexagon>
                </Hexagon>
              </Hexagon>
            </Hexagon>
          </Hexagon>
        </Hexagon>
      </Hexagon>
    </Box>
  );
}
