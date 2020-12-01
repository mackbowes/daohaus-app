import React, { useEffect, useState } from 'react';
import {
  FlexibleXYPlot,
  GradientDefs,
  XAxis,
  YAxis,
  LineSeries,
  AreaSeries,
} from 'react-vis';
import { Box } from '@chakra-ui/react';
import { useTheme } from '../../contexts/CustomThemeContext';
import { useBalances } from '../../contexts/PokemolContext';
import {
  getDateRange,
  getDatesArray,
  groupBalancesMemberToDateRange,
} from '../../utils/bank-helpers';

const MemberSnapshotChart = ({ chartDimension, dao }) => {
  const [theme] = useTheme();
  const [balances] = useBalances();
  const [chartData, setChartData] = useState([]);
  const [preppedData, setPreppedData] = useState([]);

  useEffect(() => {
    if (balances.length > 0 && dao && dao.graphData) {
      const dateRange = getDateRange(
        { value: 'lifetime' },
        balances,
        dao.graphData.summoningTime,
      );
      const dates = getDatesArray(dateRange.start, dateRange.end);
      const groupedBalances = groupBalancesMemberToDateRange(balances, dates);
      setPreppedData(groupedBalances);
    }
  }, [balances, dao]);

  useEffect(() => {
    if (preppedData.length > 0 && chartDimension) {
      setTypeData(chartDimension, preppedData);
    }
  }, [chartDimension, preppedData]);

  const setTypeData = (type, balances) => {
    const data = balances.map((balance, i) => {
      return {
        x: balance.date,
        y: balance[type],
        y0: 0,
      };
    });
    setChartData(data);
  };

  const gradient = (
    <GradientDefs>
      <linearGradient id='gradient' x1='0' x2='0' y1='0' y2='100%'>
        <stop offset='0%' stopColor={theme.colors.primary[50]} />
        <stop
          offset='100%'
          stopColor={theme.colors.primary[50]}
          stopOpacity={0}
        />
      </linearGradient>
    </GradientDefs>
  );

  return (
    <Box w='100%' minH='300px'>
      {chartData.length > 0 ? (
        <FlexibleXYPlot
          yDomain={[0, chartData[chartData.length - 1].y || 10]}
          margin={{ left: 0, right: 0, top: 40, bottom: 40 }}
        >
          <XAxis xType='time' tickTotal={0} />
          <YAxis tickTotal={0} />
          {gradient}
          <LineSeries
            animate
            curve='curveNatural'
            data={chartData}
            color={theme.colors.primary[50]}
          />
          <AreaSeries
            animate
            curve='curveNatural'
            data={chartData}
            fill={'url(#gradient)'}
            stroke='transparent'
          />
        </FlexibleXYPlot>
      ) : null}
    </Box>
  );
};

export default MemberSnapshotChart;
