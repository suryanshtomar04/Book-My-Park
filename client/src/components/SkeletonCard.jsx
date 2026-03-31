export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-[1.25rem] border border-gray-200 overflow-hidden flex flex-col sm:flex-row w-full p-2.5 sm:p-3.5 gap-4 sm:gap-6 h-auto sm:h-[220px] animate-pulse">
      
      {/* Image Block Skeleton */}
      <div className="w-full sm:w-[280px] xl:w-[320px] h-[200px] sm:h-full rounded-[1rem] bg-gray-200 flex-shrink-0"></div>

      {/* Content Skeleton */}
      <div className="py-2 pr-2 sm:pr-4 flex flex-col flex-1 min-w-0">
        
        <div className="mb-2 space-y-3">
          {/* Location Line */}
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          
          {/* Title Lines */}
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          
          <div className="w-8 h-[1px] bg-gray-200 my-4"></div>
          
          {/* Subtitle */}
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-end justify-between px-1">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
        </div>
      </div>
    </div>
  );
}
