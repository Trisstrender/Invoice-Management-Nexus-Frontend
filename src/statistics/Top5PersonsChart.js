import React from 'react';
import {Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import formatCurrency from '../utils/currencyFormatter';

const Top5PersonsChart = ({top5Persons}) => {
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-secondary-700">Top 5 Persons by Revenue</h2>
            <div className="bg-white shadow-md rounded-lg p-6" style={{height: '400px'}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={top5Persons} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                        {/* Define gradients for bar colors */}
                        <defs>
                            {top5Persons.map((entry, index) => (
                                <linearGradient id={`colorUv${index}`} x1="0" y1="0" x2="0" y2="1" key={index}>
                                    <stop offset="5%" stopColor="#84d8ff" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={1}/>
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="personName" tick={{fill: '#4a5568'}}/>
                        <YAxis tick={{fill: '#4a5568'}}/>
                        <Tooltip formatter={(value) => formatCurrency(value)}
                                 contentStyle={{backgroundColor: '#f0f0f0', borderRadius: '5px'}}/>
                        <Legend
                            formatter={(value) => <span
                                style={{color: '#000'}}>{value.charAt(0).toUpperCase() + value.slice(1)}</span>}
                            iconType="square"
                            iconSize={10}
                            payload={[{value: 'Revenue', type: 'square', color: '#0ea5e9'}]}
                        />
                        <Bar dataKey="revenue">
                            {top5Persons.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`url(#colorUv${index})`}/>
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Top5PersonsChart;