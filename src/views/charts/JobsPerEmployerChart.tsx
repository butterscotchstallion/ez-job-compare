import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

export default function JobsPerEmployerChart({ data }: any) {

    return (
        <BarChart 
            width={800}
            height={300}
            data={data}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="employerName" />
            <YAxis dataKey="jobCount" />
            <Legend />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="jobCount" fill="#8884d8" />
        </BarChart>
    );
};