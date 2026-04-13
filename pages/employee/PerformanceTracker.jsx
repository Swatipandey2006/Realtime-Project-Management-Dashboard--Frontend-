import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
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
import { generateWeeklyCompletionData } from '../../utils/mockData';

export const PerformanceTracker = () => {
  const { user } = useAuth();
  const { tasks } = useApp();

  const myTasks = tasks.filter(t => t.assignedTo === user?.id);

  const completedTasks = myTasks.filter(
    t => t.status === 'Completed'
  ).length;

  const totalTasks = myTasks.length;

  const completionPercentage =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const chartData = generateWeeklyCompletionData(8);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Performance Tracker
      </h1>

      <div className="grid gap-6">
        {/* Overall Progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">
            Overall Progress
          </h2>

          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium">
              Task Completion Rate
            </span>

            <span className="text-2xl font-bold text-blue-600">
              {completionPercentage}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {totalTasks}
              </p>
              <p className="text-sm text-gray-600">
                Total Tasks
              </p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {completedTasks}
              </p>
              <p className="text-sm text-gray-600">
                Completed
              </p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {
                  myTasks.filter(
                    t => t.status === 'In Progress'
                  ).length
                }
              </p>
              <p className="text-sm text-gray-600">
                In Progress
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">
            Completed Tasks Per Week
          </h2>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
              />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="completed"
                name="Completed Tasks"
                fill="#10b981"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};