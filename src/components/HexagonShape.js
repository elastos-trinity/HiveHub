import PropTypes from 'prop-types';

export default function HexagonShape(props) {
  const { blurVal = 10, width = 15, size = 1, opacityVal = 0.3, mobile = false } = props;
  const svgWidth = mobile ? 76 : 256;
  const svgHeight = mobile ? 89 : 295;

  return (
    <svg
      width={svgWidth * size}
      height={svgHeight * size}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      // viewBox="0 0 256 295"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_466_139)">
        <path
          d="M127.75 28.7139L228 88.0132V206.701L127.75 265.794L27.5 206.701V88.0132L127.75 28.7139Z"
          stroke="#FF931E"
          strokeOpacity={opacityVal}
          strokeWidth={width}
        />
      </g>
      <defs>
        <filter
          id="filter0_f_466_139"
          x="0"
          y="0"
          width={svgWidth * size}
          height={svgHeight * size}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={blurVal} result="effect1_foregroundBlur_466_139" />
        </filter>
      </defs>
    </svg>
  );
}
