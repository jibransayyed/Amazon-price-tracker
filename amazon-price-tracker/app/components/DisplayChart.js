"use client";
import React, { useEffect } from "react";
import { Chart } from "react-charts";

const DisplayChart = ({ data }) => {
  useEffect(() => {
    console.log("Data received by chart:", data); // Log data to verify format
  }, [data]);

  const primaryAxis = React.useMemo(
    () => ({
      getValue: (datum) => datum.x, // Use `x` for the time scale
      scaleType: 'time', // Explicitly define the scale type as 'time'
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: (datum) => datum.y, // Use `y` for the price scale
        scaleType: 'linear', // Explicitly define the scale type as 'linear'
      },
    ],
    []
  );

  return (
    <div className="size-64">
      <Chart
        options={{
          data,
          primaryAxis,
          secondaryAxes,
        }}
      />
    </div>
  );
};

export default DisplayChart;
