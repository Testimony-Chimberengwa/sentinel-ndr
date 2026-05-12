import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function DriftTracker({ data }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid stroke="rgba(0,245,255,0.1)" />
          <XAxis dataKey="day" stroke="#7fa7a7" />
          <YAxis stroke="#7fa7a7" domain={[0, 1]} />
          <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid #1a3a3a' }} />
          <Area type="monotone" dataKey="drift" stroke="#00f5ff" fill="rgba(0,245,255,0.2)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
