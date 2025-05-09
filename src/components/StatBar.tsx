import './StatBar.css';

interface StatBarProps {
  stats: { label: string; value: number | string }[];
}

const StatBar = ({ stats }: StatBarProps) => (
  <div className="stat-bar">
    {stats.map((stat, idx) => (
      <div className="stat-bar__item" key={idx}>
        <div className="stat-bar__value">{stat.value}</div>
        <div className="stat-bar__label">{stat.label}</div>
      </div>
    ))}
  </div>
);

export default StatBar; 