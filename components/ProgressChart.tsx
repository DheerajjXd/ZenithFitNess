
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProgressData } from '../types';

interface ProgressChartProps {
  data: ProgressData[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  return (
    <div className="w-full h-80 bg-brand-gray p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-brand-accent">Weekly Progress</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4E4E50" />
          <XAxis dataKey="day" stroke="#F5F5F5" />
          <YAxis stroke="#F5F5F5" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1A1A1D', border: '1px solid #00A8E8' }}
            labelStyle={{ color: '#FFD166' }}
          />
          <Legend />
          <Bar dataKey="minutes" fill="#00A8E8" name="Workout Minutes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
