import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { StatCard } from '../../components/shared/StatCard';
import { ClipboardList, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { generateWeeklyCompletionData } from '../../utils/mockData';

export const EmployeeOverview = () => {
  const { user } = useAuth();
  const { tasks } = useApp();

  const myTasks = tasks.filter(t => t.assignedTo === user?.id);

  const tasksAssigned = myTasks.length;
  const inProgress = myTasks.filter(t => t.status === 'In Progress').length;
  const completed = myTasks.filter(t => t.status === 'Completed').length;

  const overdue = myTasks.filter(
    t => new Date(t.dueDate) < new Date() && t.status !== 'Completed'
  ).length;

  const chartData = generateWeeklyCompletionData(4);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Employee Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tasks Assigned"
          value={tasksAssigned}
          icon={ClipboardList}
          color="blue"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Completed"
          value={completed}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Overdue"
          value={overdue}
          icon={AlertCircle}
          color="red"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">
          Personal Task Completion
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#10b981"
              strokeWidth={2}
              name="Completed Tasks"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};