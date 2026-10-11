import React from 'react';
import { Link } from 'react-router-dom';
import Icons from '../../utils/Icons';
import { FaWandMagicSparkles } from 'react-icons/fa6';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  iconName?: keyof typeof Icons;
  actionLabel?: string;
  onAction?: () => void;
  actionLink?: string;
  actionIcon?: React.ReactNode;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  secondaryActionLink?: string;
  className?: string;
  variant?: 'card' | 'dashed' | 'plain';
}

export default function EmptyState({
  title,
  description,
  icon,
  iconName,
  actionLabel,
  onAction,
  actionLink,
  actionIcon,
  secondaryActionLabel,
  onSecondaryAction,
  secondaryActionLink,
  className = '',
  variant = 'dashed',
}: EmptyStateProps) {
  const containerClasses = {
    card: 'bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 sm:p-12',
    dashed: 'bg-slate-50/40 rounded-2xl border-2 border-dashed border-slate-200 p-8 sm:p-12',
    plain: 'py-8 px-4',
  }[variant];

  // Render icon based on props
  const renderIcon = () => {
    if (icon) return icon;
    if (iconName) {
      return (
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-(--primaryBlue) border border-blue-100 flex items-center justify-center shadow-xs">
          <Icons name={iconName} size="md" />
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-(--primaryBlue) border border-blue-100 flex items-center justify-center shadow-xs">
        <FaWandMagicSparkles className="w-5 h-5 text-(--primaryBlue)" />
      </div>
    );
  };

  return (
    <div
      className={`w-full flex flex-col items-center justify-center text-center space-y-4 ${containerClasses} ${className}`}
    >
      <div className="shrink-0 animate-in fade-in zoom-in-95 duration-200">
        {renderIcon()}
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* Primary Action Button or Link */}
          {actionLabel && (
            <>
              {actionLink ? (
                <Link
                  to={actionLink}
                  className="px-4 py-2 bg-(--primaryBlue) hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  {actionIcon || <Icons name="plus" size="xs" />}
                  {actionLabel}
                </Link>
              ) : onAction ? (
                <button
                  type="button"
                  onClick={onAction}
                  className="px-4 py-2 bg-(--primaryBlue) hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  {actionIcon || <Icons name="plus" size="xs" />}
                  {actionLabel}
                </button>
              ) : null}
            </>
          )}

          {/* Secondary Action Button or Link */}
          {secondaryActionLabel && (
            <>
              {secondaryActionLink ? (
                <Link
                  to={secondaryActionLink}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
                >
                  {secondaryActionLabel}
                </Link>
              ) : onSecondaryAction ? (
                <button
                  type="button"
                  onClick={onSecondaryAction}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
                >
                  {secondaryActionLabel}
                </button>
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  );
}
