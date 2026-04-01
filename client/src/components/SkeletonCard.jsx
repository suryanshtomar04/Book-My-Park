import { motion } from 'framer-motion';

export default function SkeletonCard({ index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-[1.25rem] border border-gray-200 overflow-hidden flex flex-col sm:flex-row w-full p-2.5 sm:p-3.5 gap-4 sm:gap-6 h-auto sm:h-[220px]"
    >
      
      {/* Image Block Skeleton with Shimmer */}
      <div className="w-full sm:w-[280px] xl:w-[320px] h-[200px] sm:h-full rounded-[1rem] shimmer flex-shrink-0"></div>

      {/* Content Skeleton */}
      <div className="py-2 pr-2 sm:pr-4 flex flex-col flex-1 min-w-0">
        
        <div className="mb-2 space-y-3">
          {/* Location Line */}
          <div className="h-3 shimmer rounded-full w-1/3"></div>
          
          {/* Title Lines */}
          <div className="h-5 shimmer rounded-lg w-3/4"></div>
          <div className="h-5 shimmer rounded-lg w-1/2"></div>
          
          <div className="w-8 h-[1px] bg-gray-200 my-4"></div>
          
          {/* Subtitle */}
          <div className="h-3 shimmer rounded-full w-2/3"></div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-end justify-between px-1">
          <div className="h-8 shimmer rounded-lg w-20"></div>
          <div className="h-10 shimmer rounded-xl w-28"></div>
        </div>
      </div>
    </motion.div>
  );
}
