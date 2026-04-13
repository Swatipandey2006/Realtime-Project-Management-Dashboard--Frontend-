import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Send, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const SubmitReports = () => {
  const { user } = useAuth();
  const { tasks, reports, addReport } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [relatedTaskId, setRelatedTaskId] = useState('');
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const myTasks = tasks.filter(t => t.assignedTo === user?.id);
  const myReports = reports.filter(r => r.submittedBy === user?.id);

  const handleSubmit = () => {
    if (!title || !description || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    addReport({
      title,
      description,
      relatedTaskId: relatedTaskId || undefined,
      submittedBy: user?.id || '',
      date
    });

    setTitle('');
    setDescription('');
    setRelatedTaskId('');
    setDate(new Date().toISOString().split('T')[0]);

    toast.success('Report submitted successfully');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Submit Reports</h1>

      <div className="grid gap-6">
        {/* New Report Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText size={24} className="text-blue-600" />
            <h2 className="text-lg font-semibold">New Report</h2>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Report Title *
              </label>

              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter report title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>

              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Write your report details..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Related Task */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Related Task (optional)
              </label>

              <select
                value={relatedTaskId}
                onChange={e => setRelatedTaskId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Task</option>
                {myTasks.map(task => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Date *
              </label>

              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Send size={18} />
              Submit Report
            </button>
          </div>
        </div>

        {/* My Reports */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">My Reports</h2>

          {myReports.length > 0 ? (
            <div className="space-y-3">
              {myReports.map(report => (
                <div
                  key={report.id}
                  className="p-4 border border-gray-100 rounded-lg"
                >
                  <h3 className="font-medium">{report.title}</h3>
                  <p className="text-sm text-gray-600">
                    {report.description}
                  </p>
                  <span className="text-xs text-gray-400">
                    {new Date(report.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reports submitted yet</p>
          )}
        </div>
      </div>
    </div>
  );
};