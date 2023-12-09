import clsx from 'clsx';
import { ReactNode } from 'react';

const FilterButton = ({
  bgClassName,
  icon,
}: {
  bgClassName: string;
  icon: ReactNode;
}) => {
  return (
    <button className="group relative h-10 w-10 overflow-clip rounded-md border border-gray-300 bg-gray-200 fill-gray-500 p-2 shadow-sm transition-all duration-200 ease-out hover:fill-white">
      <div
        className={clsx(
          'absolute inset-0 opacity-0 transition-all duration-200 ease-out group-hover:opacity-100',
          bgClassName
        )}
      />
      {icon}
    </button>
  );
};

export default FilterButton;
