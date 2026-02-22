import { FC } from 'react';

interface IconMenuGalleryProps {
    className?: string;
}

const IconMenuGallery: FC<IconMenuGalleryProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-6 w-6 ${className || ''}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5h18v14H3V5zm4 4l3 4 2-3 3 4 3-4"
    />
  </svg>
);

export default IconMenuGallery;
