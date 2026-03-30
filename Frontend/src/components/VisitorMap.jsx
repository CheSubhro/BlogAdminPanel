import React from 'react'
import { Paper, Typography, Box } from "@mui/material";
import { Chart } from "react-google-charts";

const data = [
    ["Country", "Visitors"],
    ["Germany", 200],
    ["United States", 300],
    ["Brazil", 400],
    ["Canada", 500],
    ["France", 600],
    ["India", 700],
];

const VisitorMap = () => {
    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #f0f0f0', mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Global Audience</Typography>
            <Box sx={{ width: '100%', height: '400px' }}>
                <Chart
                chartEvents={[
                    {
                    eventName: "select",
                    callback: ({ chartWrapper }) => {
                        const chart = chartWrapper.getChart();
                        const selection = chart.getSelection();
                        if (selection.length === 0) return;
                        const region = data[selection[0].row + 1];
                        console.log("Selected : " + region);
                    },
                    },
                ]}
                chartType="GeoChart"
                width="100%"
                height="400px"
                data={data}
                options={{
                    colorAxis: { colors: ["#e3f2fd", "#1976d2"] }, // Light to Dark Blue
                    backgroundColor: "transparent",
                    datalessRegionColor: "#f5f5f5",
                    defaultColor: "#f5f5f5",
                }}
                />
            </Box>
        </Paper>
    )
}

export default VisitorMap