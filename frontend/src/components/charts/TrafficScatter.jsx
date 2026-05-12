import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts'

export default function TrafficScatter({ data }) {
  const points = data.map((row, i) => ({
    t: i + 1,
    b: row.bytes / 1024,
    score: row.anomaly,
  }))

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid stroke="rgba(0,245,255,0.1)" />
          <XAxis type="number" dataKey="t" name="event" stroke="#7fa7a7" />
          <YAxis type="number" dataKey="b" name="kb" stroke="#7fa7a7" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#0d1117', border: '1px solid #1a3a3a' }} />
          <Scatter data={points} fill="#00f5ff" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
