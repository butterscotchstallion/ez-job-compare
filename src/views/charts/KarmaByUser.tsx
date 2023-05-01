import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

export default function KarmaByUser({ data }: any) {
    return (
        <BarChart 
            width={800}
            height={300}
            data={data}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis dataKey="karma" />
            <Legend />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="karma" fill="#8884d8" />
        </BarChart>
    );
};