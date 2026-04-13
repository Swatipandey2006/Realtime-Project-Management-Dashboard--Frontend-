import { useAuth } from '../../contexts/AuthContext';
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
import { generateEmployeePerformanceData } from '../../utils/mockData';

export const ManagerOverview = () => {
  const { user } = useAuth();
  const { users, tasks, activities } = useApp();

  const teamMembers = users.filter(u => u.managerId === user?.id);
  const teamTasks = tasks.filter(t => t.managerId === user?.id);

  const completedTasks = teamTasks.filter(
    t => t.status === 'Completed'
  ).length;

  const overdueTasks = teamTasks.filter(
    t => new Date(t.dueDate) < new Date() && t.status !== 'Completed'
  ).length;

  const chartData = generateEmployeePerformanceData(teamMembers);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Manager Overview
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Team Size"
          value={teamMembers.length}
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Tasks Assigned"
          value={teamTasks.length}
          icon={Clock}
          color="yellow"
        />

        <StatCard
          title="Tasks Completed"
          value={completedTasks}
          icon={CheckCircle}
          color="green"
        />

        <StatCard
          title="Tasks Overdue"
          value={overdueTasks}
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">
            Employee Task Completion
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
              />

              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />

              <Bar
                dataKey="completed"
                name="Completed"
                fill="#10b981"
              />

              <Bar
                dataKey="pending"
                name="Pending"
                fill="#f59e0b"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">
            Team Activity
          </h2>

          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {activities
              .filter(a =>
                teamMembers.some(tm => tm.id === a.userId)
              )
              .slice(0, 10)
              .map(activity => (
                <div
                  key={activity.id}
                  className="flex gap-3 pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                    {activity.userName
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">
                        {activity.userName}
                      </span>{' '}
                      <span className="text-gray-600">
                        {activity.action.toLowerCase()}
                      </span>{' '}
                      <span className="font-medium">
                        {activity.entity}
                      </span>
                    </p>

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