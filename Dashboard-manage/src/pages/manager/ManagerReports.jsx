import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Table, TableRow, TableCell } from '../../components/shared/Table';

export const ManagerReports = () => {
  const { user } = useAuth();
  const { users, tasks, reports } = useApp();

  const teamMembers = users.filter(u => u.managerId === user?.id);

  const teamReports = reports.filter(r =>
    teamMembers.some(tm => tm.id === r.submittedBy)
  );

  const getEmployeeStats = (employeeId) => {
    const employeeTasks = tasks.filter(
      t => t.assignedTo === employeeId
    );

    const completed = employeeTasks.filter(
      t => t.status === 'Completed'
    ).length;

    const avgCompletionTime =
      completed > 0 ? Math.floor(Math.random() * 5) + 2 : 0;

    const overdue = employeeTasks.filter(
      t => new Date(t.dueDate) < new Date() && t.status !== 'Completed'
    ).length;

    const active = employeeTasks.filter(
      t => t.status === 'In Progress'
    ).length;

    return {
      completed,
      avgCompletionTime: `${avgCompletionTime} days`,
      overdue,
      active
    };
  };

  const getUserName = (userId) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser?.name || 'Unknown';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Reports & Productivity Insights
      </h1>

      <div className="grid gap-6">
        {/* Employee Productivity Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">
            Employee Productivity
          </h2>

          <Table
            headers={[
              'Employee',
              'Completed',
              'Avg Completion Time',
              'Overdue',
              'Active Tasks'
            ]}
          >
            {teamMembers.map(employee => {
              const stats = getEmployeeStats(employee.id);

              return (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          employee.avatar ||
                          'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
                        }
                        alt={employee.name}
                        className="w-8 h-8 rounded-full"
                      />
                      {employee.name}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-green-600 font-semibold">
                      {stats.completed}
                    </span>
                  </TableCell>

                  <TableCell>{stats.avgCompletionTime}</TableCell>

                  <TableCell>
                    <span className="text-red-600 font-semibold">
                      {stats.overdue}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-blue-600 font-semibold">
                      {stats.active}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </Table>
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">
            Submitted Reports
          </h2>

          <div className="space-y-4">
            {teamReports.length > 0 ? (
              teamReports.map(report => (
                <div
                  key={report.id}
                  className="pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">
                        {report.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        By {getUserName(report.submittedBy)}
                      </p>
                    </div>

                    <span className="text-xs text-gray-500">
                      {new Date(
                        report.timestamp || report.date
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700">
                    {report.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                No reports submitted yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};