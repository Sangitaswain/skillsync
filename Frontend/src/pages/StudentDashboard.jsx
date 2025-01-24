import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { LogOut, Book, Award, Briefcase, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, StudentLogout } = useAuthStore();
  
  const handleLogout = async () => {
    try {
      await StudentLogout();
      toast.success('Logged out successfully');
      navigate('/auth/student-login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const stats = [
    { id: 1, icon: Book, label: 'Learning Streak', value: '24', subtext: 'Learning Streak' },
    { id: 2, icon: Award, label: 'Skills in Progress', value: '5', subtext: 'Skills in Progress' },
    { id: 3, icon: Briefcase, label: 'Certifications', value: '3', subtext: 'Certifications' },
    { id: 4, icon: FileText, label: 'Career Score', value: '86', subtext: 'Career Score' },
  ];

  const courses = [
    {
      id: 1,
      title: 'Advanced Digital Marketing',
      progress: 75,
      status: 'In Progress',
      nextTask: 'Growth Hacks Deep Dive • 2h 30m remaining'
    },
    {
      id: 2,
      title: 'Digital Marketing Fundamentals',
      progress: 100,
      status: 'Completed',
      completionDate: '17/01/2024'
    },
    {
      id: 3,
      title: 'Business Analyst',
      progress: 15,
      status: 'Just Started',
      timeSpent: '14 Lessons • 2 Hours'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="text-primary font-bold text-xl">SkillSync</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="text-gray-900 font-medium">
                  Welcome, {user?.first_Name} {user?.last_Name}!
                </div>
                <div className="text-gray-500">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.first_Name}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            You are making great progress. Keep up the Momentum.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <div className="text-sm text-gray-500">{stat.subtext}</div>
            </div>
          ))}
        </div>

        {/* Learning Path */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Current Learning Path</h2>
            <button className="text-primary text-sm hover:underline">
              View all Courses →
            </button>
          </div>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="border-b last:border-0 pb-4 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <span className="text-sm text-gray-500">{course.status}</span>
                </div>
                <div className="relative w-full h-2 bg-gray-100 rounded">
                  <div
                    className="absolute left-0 top-0 h-full bg-primary rounded"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {course.nextTask || course.completionDate || course.timeSpent}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Deadlines
          </h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-lg bg-gray-50"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div>
                  <div className="font-medium text-gray-900">React Assessment</div>
                  <div className="text-sm text-gray-500">
                    {new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    {' • '}
                    14:00
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;