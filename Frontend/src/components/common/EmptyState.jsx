import * as Icons from 'lucide-react';

export function EmptyState({ title, description, icon }) {
  const Icon = Icons[icon];

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <Icon className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-sm">
        {description}
      </p>
    </div>
  );
}
