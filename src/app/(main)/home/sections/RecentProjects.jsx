'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MoreVertical, Play } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Delicate Pour, Perfect Art Latte',
    type: 'Video',
    image: '/images/project/coffee.jpg',
    edited: 'September 13, 2025, 10:00 AM',
  },
  {
    id: 2,
    title: 'A Treasure Beans from Timor',
    type: 'Image',
    image: '/images/project/beans.jpg',
    edited: 'September 11, 2025, 07:30 PM',
  },
  {
    id: 3,
    title: 'The Strategic Branding Content',
    type: 'Video',
    image: '/images/project/woman.jpg',
    edited: 'September 09, 2025, 02:45 AM',
  },
];

const filters = ['All', 'Videos', 'Images', 'Audio'];

export default function RecentProjects() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <section className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Project</h2>
          
          {/* Filters */}
          <div className="flex items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <button className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
          See all
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Thumbnail */}
            <div className="relative h-56 overflow-hidden bg-gray-100">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Type Badge */}
              <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded text-xs font-medium">
                {project.type}
              </div>

              {/* Play Button for Videos */}
              {project.type === 'Video' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white/90 backdrop-blur-sm p-4 rounded-full hover:bg-white transition-colors">
                    <Play size={24} className="text-gray-900 fill-gray-900" />
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Edited {project.edited}
                  </p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors ml-2">
                  <MoreVertical size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}