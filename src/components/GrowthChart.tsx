import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { SeriesPoint } from '../lib/growth.mjs';

const dateLabel = (key: string) => new Date(`${key}T12:00:00`).toLocaleDateString(undefined, {month:'short',day:'numeric'});
const fullDateLabel = (key: string) => new Date(`${key}T12:00:00`).toLocaleDateString(undefined, {year:'numeric',month:'short',day:'numeric'});

export default function GrowthChart({data, positive}:{data:SeriesPoint[];positive:boolean}) {
  const color = positive ? '#49e2a0' : '#fb777c';
  if (!data.length) return <div className="chart-empty"><div className="empty-bars"><span/><span/><span/><span/><span/><span/><span/><span/><span/></div><p>Your chart starts with your first daily decision.</p><span>Starting index 100.00 · No history has been invented.</span></div>;
  return <div className="chart-surface" role="img" aria-label={`Growth index chart with ${data.length - 1} recorded days`}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{top:18,right:12,bottom:4,left:-12}}>
        <defs><linearGradient id="growthFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.20}/><stop offset="100%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
        <CartesianGrid stroke="#1e2c32" strokeDasharray="3 6" vertical={false}/>
        <XAxis dataKey="date" tickFormatter={dateLabel} stroke="#42535b" tick={{fill:'#70858c',fontSize:11}} tickLine={false} axisLine={false} minTickGap={28} dy={12}/>
        <YAxis domain={([min,max]:[number,number]) => [Math.floor(Math.min(min,100)-1), Math.ceil(Math.max(max,100)+1)]} tickFormatter={(v:number)=>v.toFixed(0)} stroke="#42535b" tick={{fill:'#70858c',fontSize:11}} tickLine={false} axisLine={false} width={48} tickCount={6}/>
        <ReferenceLine y={100} stroke="#667a7e" strokeDasharray="5 6" strokeOpacity={0.65}/>
        <Tooltip cursor={{stroke:'#82969b',strokeDasharray:'4 4'}} content={({active,payload}) => {
          if(!active || !payload?.length) return null;
          const point = payload[0].payload as SeriesPoint;
          return <div className="chart-tooltip"><span>{fullDateLabel(point.date)}</span><strong>{point.index.toFixed(2)}</strong><small>{point.outcome === 'baseline' ? 'Starting baseline' : point.outcome === 'completed' ? 'Completed · +1%' : 'Missed · −1%'}</small></div>;
        }}/>
        <Area dataKey="index" type="monotone" stroke={color} strokeWidth={3} fill="url(#growthFill)" dot={data.length < 16 ? {r:3,fill:color,stroke:'#091219',strokeWidth:2} : false} activeDot={{r:6,fill:color,stroke:'#0b151a',strokeWidth:3}} isAnimationActive={true}/>
      </AreaChart>
    </ResponsiveContainer>
  </div>;
}
