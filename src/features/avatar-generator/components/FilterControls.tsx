import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { SortOption, FilterStatus } from '../utils/projectFilters';

interface FilterControlsProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: FilterStatus;
    onStatusChange: (status: FilterStatus) => void;
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
    onReset: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
    sortBy,
    onSortChange,
    onReset
}) => {
    const [showFilters, setShowFilters] = React.useState(false);
    const hasActiveFilters = searchQuery || statusFilter !== 'all' || sortBy !== 'date-desc';

    return (
        <div className="flex items-center gap-2">
            {/* Search Input - Compact */}
            <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                {searchQuery && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded transition"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Filter Button - Compact */}
            <div className="relative">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${showFilters || hasActiveFilters
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <Filter className="w-4 h-4" />
                    Filter
                    {hasActiveFilters && !showFilters && (
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                </button>

                {/* Dropdown Panel */}
                {showFilters && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-4 space-y-3">
                            {/* Status Filter */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                                    Status
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => onStatusChange(e.target.value as FilterStatus)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="finished">Completed</option>
                                    <option value="processing">Processing</option>
                                    <option value="queued">Queued</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => onSortChange(e.target.value as SortOption)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="date-desc">Newest First</option>
                                    <option value="date-asc">Oldest First</option>
                                    <option value="duration-desc">Longest Duration</option>
                                    <option value="duration-asc">Shortest Duration</option>
                                </select>
                            </div>

                            {/* Reset Button */}
                            {hasActiveFilters && (
                                <button
                                    onClick={() => {
                                        onReset();
                                        setShowFilters(false);
                                    }}
                                    className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-900 transition-colors"
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
