import { useEffect, useRef, useState } from 'react';
import Icons from '../../../../../utils/Icons';

export type SortOption = 'newest' | 'oldest' | 'highestMatch' | 'lowestMatch';

interface JobSortDropdownProps {
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
}

export default function JobSortDropdown({ sortBy, onSortChange }: JobSortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionSelect = (option: SortOption) => {
    onSortChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 3-Dot Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200/60 flex items-center justify-center"
        title="Filter & Sort Options"
      >
        <Icons name="menuVerticalDot" size="xs" />
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-30 p-2.5 space-y-2.5 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Sort Job Descriptions
            </span>
            <span className="text-[10px] font-semibold text-(--primaryBlue) bg-blue-50 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>

          <div className="space-y-1 text-xs font-medium text-slate-700">
            {/* Sort by Date Section */}
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1">
              By Date
            </div>

            <label
              onClick={() => handleOptionSelect('newest')}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                sortBy === 'newest' ? 'bg-blue-50/70 text-(--primaryBlue) font-bold' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="jobSortToggle"
                  value="newest"
                  checked={sortBy === 'newest'}
                  onChange={() => handleOptionSelect('newest')}
                  className="accent-(--primaryBlue)"
                />
                <span>Sort by Newest</span>
              </div>
              {sortBy === 'newest' && <Icons name="check" size="xs" className="text-(--primaryBlue)" />}
            </label>

            <label
              onClick={() => handleOptionSelect('oldest')}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                sortBy === 'oldest' ? 'bg-blue-50/70 text-(--primaryBlue) font-bold' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="jobSortToggle"
                  value="oldest"
                  checked={sortBy === 'oldest'}
                  onChange={() => handleOptionSelect('oldest')}
                  className="accent-(--primaryBlue)"
                />
                <span>Sort by Oldest</span>
              </div>
              {sortBy === 'oldest' && <Icons name="check" size="xs" className="text-(--primaryBlue)" />}
            </label>

            {/* Sort by Job Match Score Section */}
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-2 border-t border-slate-100">
              By Match Score
            </div>

            <label
              onClick={() => handleOptionSelect('highestMatch')}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                sortBy === 'highestMatch' ? 'bg-blue-50/70 text-(--primaryBlue) font-bold' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="jobSortToggle"
                  value="highestMatch"
                  checked={sortBy === 'highestMatch'}
                  onChange={() => handleOptionSelect('highestMatch')}
                  className="accent-(--primaryBlue)"
                />
                <span>Highest Match (Desc)</span>
              </div>
              {sortBy === 'highestMatch' && <Icons name="check" size="xs" className="text-(--primaryBlue)" />}
            </label>

            <label
              onClick={() => handleOptionSelect('lowestMatch')}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                sortBy === 'lowestMatch' ? 'bg-blue-50/70 text-(--primaryBlue) font-bold' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="jobSortToggle"
                  value="lowestMatch"
                  checked={sortBy === 'lowestMatch'}
                  onChange={() => handleOptionSelect('lowestMatch')}
                  className="accent-(--primaryBlue)"
                />
                <span>Lowest Match (Asc)</span>
              </div>
              {sortBy === 'lowestMatch' && <Icons name="check" size="xs" className="text-(--primaryBlue)" />}
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
