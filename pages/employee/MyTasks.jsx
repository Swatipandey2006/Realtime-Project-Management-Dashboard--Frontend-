import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Badge } from '../../components/shared/Badge';
import { Filter } from 'lucide-react';
import { toast } from 'sonner';

export const MyTasks = () => {
  const { user } = useAuth();
  const { tasks, updateTask, addActivity } = useApp();

  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const myTasks = tasks.filter(t => t.assignedTo === user?.id);

  const filteredTasks = myTasks.filter(task => {
    const matchesStatus =
      statusFilter === 'all' || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesStatus && matchesPriority;
  });

  const canUpdateStatus = (currentStatus, newStatus) => {
    if (currentStatus === 'Completed' && newStatus !== 'Completed') {
      return false;
    }
    if (currentStatus === 'Pending' && newStatus === 'Completed') {
      return false;
    }
    return true;
  };

  const handleStatusChange = (taskId, currentStatus, newStatus) => {
    if (!canUpdateStatus(currentStatus, newStatus)) {
      toast.error(
        'Invalid status transition. Please follow: Pending → In Progress → Completed'
      );
      return;
    }

    updateTask(taskId, { status: newStatus });

    addActivity({
      userId: user?.id || '',
      userName: user?.name || '',
      action: 'Updated',
      entity: 'Task',
      details: `Changed task status to ${newStatus}`
    });

    toast.success('Task status updated successfully');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Tasks</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-400" />

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid gap-4">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {task.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={
                        task.priority === 'High'
                          ? 'error'
                          : task.priority === 'Medium'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {task.priority} Priority
                    </Badge>

                    <span className="text-sm text-gray-500">
                      Due:{' '}
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Status</label>

                  <select
                    value={task.status}
                    onChange={e =>
                      handleStatusChange(
                        task.id,
                        task.status,
                        e.target.value
                      )
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-w-[150px]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="text-xs text-gray-400">
                Created:{' '}
                {new Date(task.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No tasks found</p>
        </div>
      )}
    </div>
  );
};