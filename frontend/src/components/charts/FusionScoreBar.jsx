import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'

export default function FusionScoreBar({ data }) {
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(0,245,255,0.1)" />
          <XAxis dataKey="x" stroke="#7fa7a7" />
          <YAxis stroke="#7fa7a7" domain={[0, 1]} />
          <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid #1a3a3a' }} />
          <Bar dataKey="fusion">
            {data.map((row) => {
              const color = row.fusion >= 0.75 ? '#ff2020' : row.fusion >= 0.45 ? '#ffaa00' : '#00f5ff'
              return <Cell key={`${row.x}-${row.fusion}`} fill={color} />
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
