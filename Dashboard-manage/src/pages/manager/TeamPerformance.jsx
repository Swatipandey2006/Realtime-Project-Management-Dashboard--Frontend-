import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  generateTaskCompletionData,
  generateTaskStatusDistribution
} from '../../utils/mockData';

export const TeamPerformance = () => {
  const { user } = useAuth();
  const { users, tasks } = useApp();

  const teamTasks = tasks.filter(t => t.managerId === user?.id);
  const teamMembers = users.filter(u => u.managerId === user?.id);

  const lineChartData = generateTaskCompletionData(14);
  const pieChartData = generateTaskStatusDistribution(teamTasks);

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981'];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Team Performance
      </h1>

      <div className="grid gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">
            Team Completion Rate Over Time
          </h2>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={lineChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
              />

              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="completed"
                name="Completed"
                stroke="#10b981"
                strokeWidth={2}
              />

              <Line
                type="monotone"
                dataKey="inProgress"
                name="In Progress"
                stroke="#3b82f6"
                strokeWidth={2}
              />

              <Line
                type="monotone"
                dataKey="pending"
                name="Pending"
                stroke="#f59e0b"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Task Distribution by Status
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, value }) =>
                    `${name}: ${value}`
                  }
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Team Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">
                  Team Members
                </span>
                <span className="font-semibold text-lg">
                  {teamMembers.length}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">
                  Total Tasks
                </span>
                <span className="font-semibold text-lg">
                  {teamTasks.length}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">
                  Completed
                </span>
                <span className="font-semibold text-lg text-green-600">
                  {
                    teamTasks.filter(
                      t => t.status === 'Completed'
                    ).length
                  }
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">
                  In Progress
                </span>
                <span className="font-semibold text-lg text-blue-600">
                  {
                    teamTasks.filter(
                      t => t.status === 'In Progress'
                    ).length
                  }
                </span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">
                  Pending
                </span>
                <span className="font-semibold text-lg text-yellow-600">
                  {
                    teamTasks.filter(
                      t => t.status === 'Pending'
                    ).length
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};