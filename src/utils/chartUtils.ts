type ColorRangeInfo = {
  colorStart: number;
  colorEnd: number;
  useEndAsStart: boolean;
};

const calculatePoint = (
  i: number,
  intervalSize: number,
  colorRangeInfo: ColorRangeInfo
) => {
  const { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
  return useEndAsStart
    ? colorEnd - i * intervalSize
    : colorStart + i * intervalSize;
};

export const interpolateColors = (
  dataLength: number,
  colorScale: (t: number) => string,
  colorRangeInfo: ColorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false
  }
) => {
  const { colorStart, colorEnd } = colorRangeInfo;
  const colorRange = colorEnd - colorStart;
  const intervalSize = colorRange / dataLength;
  let i, colorPoint;
  const colorArray = [];

  for (i = 0; i < dataLength; i++) {
    colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
    colorArray.push(colorScale(colorPoint));
  }

  return colorArray;
};
