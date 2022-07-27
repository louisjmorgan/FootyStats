/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */

import { Arc } from '@visx/shape';
import { Group } from '@visx/group';

const lineColor = '#FDFFFC';
const pitchColor = '#7eaf34';

function FootballPitch({
  width, height, stroke,
}) {
  return (
    width
      ? (
        <svg>
          <Group style={{ zIndex: 1 }} data-testid="pitch">
            {/* pitch halves */}
            {/* <rect
            x={stroke}
            y={stroke}
            width={width}
            height={height}
            fill={pitchColor}
            strokeWidth={stroke * 2}
            stroke="black"
          /> */}
            <rect
              x={stroke}
              y={stroke}
              width={width / 2}
              height={height}
              fill={pitchColor}
              strokeWidth={stroke}
              stroke={lineColor}
            />
            <rect
              x={width / 2 + stroke}
              y={stroke}
              width={width / 2}
              height={height}
              fill={pitchColor}
              strokeWidth={stroke}
              stroke={lineColor}
            />
            {/* centre circle */}
            <circle
              cx={width / 2 + stroke}
              cy={height / 2 + stroke}
              r={height / 10}
              strokeWidth={stroke}
              stroke={lineColor}
              fill="none"
            />
            {/* penalty areas */}
            <rect
              x={stroke}
              y={height / 4.75 + stroke}
              width={width / 6}
              height={height / 1.75}
              strokeWidth={stroke}
              stroke={lineColor}
              fill="none"
            />
            <rect
              x={width - width / 6 + stroke}
              y={height / 4.75 + stroke}
              width={width / 6}
              height={height / 1.75}
              strokeWidth={stroke}
              stroke={lineColor}
              fill="none"
            />
            {/* six yard boxes */}
            <rect
              x={stroke}
              y={height / 2.7 + stroke}
              width={width / 16.7}
              height={height / 3.8}
              strokeWidth={stroke}
              stroke={lineColor}
              fill="none"
            />
            <rect
              x={width - width / 16.7 + stroke}
              y={height / 2.7 + stroke}
              width={width / 16.7}
              height={height / 3.8}
              strokeWidth={stroke}
              stroke={lineColor}
              fill="none"
            />
            {/* penalty spots */}
            <circle
              cx={width / 8.3 + stroke}
              cy={height / 2 + stroke}
              r={height / 100}
              fill={lineColor}
            />
            <circle
              cx={width - width / 8.3 + stroke}
              cy={height / 2 + stroke}
              r={height / 100}
              fill={lineColor}
            />
            {/* centre spot */}
            <circle
              cx={width / 2 + stroke}
              cy={height / 2 + stroke}
              r={height / 100}
              fill={lineColor}
            />
            {/* penalty box d */}
            <Arc
              transform={`translate(${(width / 8.5) + stroke}, ${(height / 2) + stroke})`}
              innerRadius={width / 14.3}
              outerRadius={width / 14.3 + stroke}
              startAngle={0.75}
              endAngle={2.4}
              fill={lineColor}
            />
            <Arc
              transform={`translate(${(width - width / 8.5) + stroke}, ${(height / 2) + stroke})`}
              innerRadius={width / 14.3}
              outerRadius={width / 14.3 + stroke}
              startAngle={-0.75}
              endAngle={-2.4}
              fill={lineColor}
            />
          </Group>
        </svg>
      ) : ''
  );
}

export default FootballPitch;
