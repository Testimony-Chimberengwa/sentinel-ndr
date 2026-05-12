import { Line, LineChart, ResponsiveContainer } from 'recharts'

export default function MiniSparkline({ values }) {
  const data = values.map((v, i) => ({ i, v }))

  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="v" stroke="#00f5ff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
