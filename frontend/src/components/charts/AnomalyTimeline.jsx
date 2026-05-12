import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function AnomalyTimeline({ data }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(0,245,255,0.1)" />
          <XAxis dataKey="minute" stroke="#7fa7a7" />
          <YAxis stroke="#7fa7a7" domain={[0, 1]} />
          <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid #1a3a3a' }} />
          <Legend />
          <Line type="monotone" dataKey="gmm" stroke="#00f5ff" dot={false} strokeWidth={2} name="GMM" />
          <Line type="monotone" dataKey="kde" stroke="#ff2020" dot={false} strokeWidth={2} name="KDE" />
          <Line type="monotone" dataKey="lowess" stroke="#ffaa00" dot={false} strokeWidth={2} name="LOWESS" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
