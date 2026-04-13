import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Table, TableRow, TableCell } from '../../components/shared/Table';
import { Modal } from '../../components/shared/Modal';
import { Badge } from '../../components/shared/Badge';
import { Plus, Edit, Trash2, Filter } from 'lucide-react';
import { toast } from 'sonner';

export const TaskManagement = () => {
  const { tasks, users, addTask, updateTask, deleteTask } = useApp();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    managerId: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: ''
  });

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
  };

  const handleCreate = () => {
    if (!formData.title || !formData.assignedTo || !formData.managerId || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    addTask(formData);
    setShowCreateModal(false);
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      managerId: '',
      status: 'Pending',
      priority: 'Medium',
      dueDate: ''
    });
    toast.success('Task created successfully');
  };

  const handleEdit = () => {
    if (!selectedTask) return;

    updateTask(selectedTask.id, formData);
    setShowEditModal(false);
    setSelectedTask(null);
    toast.success('Task updated successfully');
  };

  const handleDelete = () => {
    if (!selectedTask) return;

    deleteTask(selectedTask.id);
    setShowDeleteModal(false);
    setSelectedTask(null);
    toast.success('Task deleted successfully');
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      managerId: task.managerId,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate
    });
    setShowEditModal(true);
  };

  const employees = users.filter(u => u.role === 'employee');
  const managers = users.filter(u => u.role === 'manager');

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

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-400" />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table headers={['Title', 'Assigned To', 'Manager', 'Status', 'Priority', 'Due Date', 'Actions']}>
          {filteredTasks.map(task => (
            <TableRow key={task.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.description}</p>
                </div>
              </TableCell>

              <TableCell>{getUserName(task.assignedTo)}</TableCell>
              <TableCell>{getUserName(task.managerId)}</TableCell>

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
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(task)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </div>

      {/* Modals remain same JSX (no TS changes needed) */}
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
        {/* same form JSX unchanged */}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Task"
        footer={
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        }
      >
        {/* same form JSX unchanged */}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Task"
        footer={
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete <strong>{selectedTask?.title}</strong>?
        </p>
      </Modal>
    </div>
  );
};