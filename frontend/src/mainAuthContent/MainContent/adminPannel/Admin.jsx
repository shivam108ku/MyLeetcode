import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { NavLink } from 'react-router'; // ✅ Correct import

function Admin() {
  const [selectedOption, setSelectedOption] = useState(null);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'btn-success',
      bgColor: 'bg-success/10',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'btn-warning',
      bgColor: 'bg-warning/10',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'btn-error',
      bgColor: 'bg-error/10',
      route: '/admin/delete'
    },
    {
      id: 'createBlog',
      title: 'Create Blog',
      description: 'Add your blogs',
      icon: Plus,
      color: 'btn-primary',
      bgColor: 'bg-primary/10',
      route: '/admin/blog/create'
    },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">Admin Panel</h1>
          <p className="text-base-content/70 text-lg">
            Manage coding problems and content on your platform
          </p>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {adminOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                className="card bg-base-100 border border-green-700 rounded-b-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              >
                <div className="card-body items-center text-center p-8">
                  {/* Icon */}
                  <div className={`${option.bgColor} p-4 rounded-full mb-4`}>
                    <Icon size={32} className="text-base-content" />
                  </div>

                  {/* Title */}
                  <h2 className="card-title text-xl mb-2">{option.title}</h2>

                  {/* Description */}
                  <p className="text-base-content/70 mb-6">{option.description}</p>

                  {/* Button */}
                  <div className="card-actions">
                    <NavLink to={option.route} className={`btn ${option.color} border p-2 rounded-b-xl border-green-400 btn-wide`}>
                      {option.title}
                    </NavLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;
