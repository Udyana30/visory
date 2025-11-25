export default function ProjectSkeleton() {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
        <div className="h-56 bg-gray-200"></div>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="w-5 h-5 bg-gray-200 rounded ml-2"></div>
          </div>
        </div>
      </div>
    );
  }