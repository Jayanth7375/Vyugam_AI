import React from 'react';
import { cn } from '@/lib/utils';

export interface LoaderProps {
  className?: string;
  size?: number | string;
  text?: string;
}

export const Component: React.FC<LoaderProps> = ({ className, size = 160, text }) => {
  const dim = typeof size === 'number' ? `${size}px` : size;

  return (
    <div className={cn("inline-flex flex-col items-center justify-center p-4 select-none", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={dim}
        width={dim}
        viewBox="0 0 200 200"
        className="pencil text-purple-600"
        style={{ width: dim, height: dim }}
      >
        <defs>
          <clipPath id="pencil-eraser">
            <rect height="30" width="30" ry="5" rx="5"></rect>
          </clipPath>
        </defs>

        {/* Drawn Circular Arc */}
        <circle
          transform="rotate(-113,100,100)"
          strokeLinecap="round"
          strokeDashoffset="439.82"
          strokeDasharray="439.82 439.82"
          strokeWidth="3.5"
          stroke="currentColor"
          fill="none"
          r="70"
          className="pencil__stroke"
        ></circle>

        {/* Rotating Pencil Rig */}
        <g transform="translate(100,100)" className="pencil__rotate">
          <g fill="none">
            <circle
              transform="rotate(-90)"
              strokeDashoffset="402"
              strokeDasharray="402.12 402.12"
              strokeWidth="30"
              stroke="hsl(268,85%,52%)"
              r="64"
              className="pencil__body1"
            ></circle>
            <circle
              transform="rotate(-90)"
              strokeDashoffset="465"
              strokeDasharray="464.96 464.96"
              strokeWidth="10"
              stroke="hsl(268,85%,62%)"
              r="74"
              className="pencil__body2"
            ></circle>
            <circle
              transform="rotate(-90)"
              strokeDashoffset="339"
              strokeDasharray="339.29 339.29"
              strokeWidth="10"
              stroke="hsl(268,85%,42%)"
              r="54"
              className="pencil__body3"
            ></circle>
          </g>

          {/* Eraser */}
          <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
            <g className="pencil__eraser-skew">
              <rect height="30" width="30" ry="5" rx="5" fill="hsl(330,90%,65%)"></rect>
              <rect clipPath="url(#pencil-eraser)" height="30" width="5" fill="hsl(330,90%,55%)"></rect>
              <rect height="20" width="30" fill="hsl(223,10%,90%)"></rect>
              <rect height="20" width="15" fill="hsl(223,10%,70%)"></rect>
              <rect height="20" width="5" fill="hsl(223,10%,80%)"></rect>
              <rect height="2" width="30" y="6" fill="hsla(223,10%,10%,0.2)"></rect>
              <rect height="2" width="30" y="13" fill="hsla(223,10%,10%,0.2)"></rect>
            </g>
          </g>

          {/* Sharpened Lead Point */}
          <g transform="rotate(-90) translate(49,-30)" className="pencil__point">
            <polygon points="15 0,30 30,0 30" fill="hsl(33,90%,70%)"></polygon>
            <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)"></polygon>
            <polygon points="15 0,20 10,10 10" fill="hsl(268,90%,18%)"></polygon>
          </g>
        </g>
      </svg>

      {text && (
        <p className="mt-3 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase text-purple-900 animate-pulse text-center">
          {text}
        </p>
      )}
    </div>
  );
};

export const PencilLoader = Component;
export default Component;
