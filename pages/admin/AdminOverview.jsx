import { useApp } from '../../contexts/AppContext';
import { StatCard } from '../../components/shared/StatCard';
import { Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { generateTaskCompletionData } from '../../utils/mockData';

export const AdminOverview = () => {
  const { users, tasks, activities } = useApp();

  const totalUsers = users.length + 3; // Include hardcoded login users
  const activeTasks = tasks.filter(t => t.status !== 'Completed').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;

  const chartData = generateTaskCompletionData(7);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          color="blue"
          trend={{ value: '12%', isPositive: true }}
        />
        <StatCard
          title="Active Tasks"
          value={activeTasks}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Completed Tasks"
          value={completedTasks}
          icon={CheckCircle}
          color="green"
          trend={{ value: '8%', isPositive: true }}
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon={AlertCircle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Task Completion Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#10b981" name="Completed" />
              <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" />
              <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {activities.slice(0, 10).map((activity) => (
              <div key={activity.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                  {activity.userName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.userName}</span>{' '}
                    <span className="text-gray-600">{activity.action.toLowerCase()}</span>{' '}
                    <span className="font-medium">{activity.entity}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};