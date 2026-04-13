import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Table, TableRow, TableCell } from '../../components/shared/Table';
import { Modal } from '../../components/shared/Modal';
import { Badge } from '../../components/shared/Badge';
import { Plus, CheckCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export const ManagerTasks = () => {
  const { user } = useAuth();
  const { tasks, users, addTask, updateTask } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [reviewComment, setReviewComment] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: ''
  });

  const teamTasks = tasks.filter(t => t.managerId === user?.id);
  const teamMembers = users.filter(u => u.managerId === user?.id);

  const getUserName = (userId) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser ? foundUser.name : 'Unassigned';
  };

  const handleCreate = () => {
    if (!formData.title || !formData.assignedTo || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    addTask({
      ...formData,
      managerId: user?.id || ''
    });

    setShowCreateModal(false);
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      status: 'Pending',
      priority: 'Medium',
      dueDate: ''
    });

    toast.success('Task created successfully');
  };

  const handleApprove = () => {
    if (!selectedTask) return;

    updateTask(selectedTask.id, { status: 'Completed' });

    toast.success(
      `Task approved${reviewComment ? ' with comment' : ''}`
    );

    setShowReviewModal(false);
    setSelectedTask(null);
    setReviewComment('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Task Management</h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Create Task
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table
          headers={[
            'Title',
            'Assigned To',
            'Status',
            'Priority',
            'Due Date',
            'Actions'
          ]}
        >
          {teamTasks.map(task => (
            <TableRow key={task.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-gray-500">
                    {task.description}
                  </p>
                </div>
              </TableCell>

              <TableCell>{getUserName(task.assignedTo)}</TableCell>

              <TableCell>
                <Badge
                  variant={
                    task.status === 'Completed'
                      ? 'success'
                      : task.status === 'In Progress'
                      ? 'info'
                      : 'warning'
                  }
                >
                  {task.status}
                </Badge>
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    task.priority === 'High'
                      ? 'error'
                      : task.priority === 'Medium'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {task.priority}
                </Badge>
              </TableCell>

              <TableCell>
                {new Date(task.dueDate).toLocaleDateString()}
              </TableCell>

              <TableCell>
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setShowReviewModal(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  <CheckCircle size={14} />
                  Review
                </button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
        footer={
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={e =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={e =>
              setFormData({
                ...formData,
                description: e.target.value
              })
            }
            className="w-full px-4 py-2 border rounded-lg"
          />

          <select
            value={formData.assignedTo}
            onChange={e =>
              setFormData({
                ...formData,
                assignedTo: e.target.value
              })
            }
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select Employee</option>
            {teamMembers.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.priority}
              onChange={e =>
                setFormData({
                  ...formData,
                  priority: e.target.value
                })
              }
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <input
              type="date"
              value={formData.dueDate}
              onChange={e =>
                setFormData({
                  ...formData,
                  dueDate: e.target.value
                })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Review Task"
        footer={
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => setShowReviewModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="font-semibold">
            {selectedTask?.title}
          </p>

          <Badge
            variant={
              selectedTask?.status === 'Completed'
                ? 'success'
                : selectedTask?.status === 'In Progress'
                ? 'info'
                : 'warning'
            }
          >
            {selectedTask?.status}
          </Badge>

          <textarea
            value={reviewComment}
            onChange={e =>
              setReviewComment(e.target.value)
            }
            placeholder="Add review comment..."
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </Modal>
    </div>
  );
};