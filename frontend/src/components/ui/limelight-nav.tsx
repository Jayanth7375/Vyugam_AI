import React, { useState, useRef, useLayoutEffect, cloneElement } from 'react';

// --- Internal Types and Defaults ---

const DefaultHomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

const DefaultCompassIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
  </svg>
);

const DefaultBellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export type NavItem = {
  id: string | number;
  icon: React.ReactElement<any>;
  label?: string;
  onClick?: () => void;
};

const defaultNavItems: NavItem[] = [
  { id: 'default-home', icon: <DefaultHomeIcon />, label: 'Home' },
  { id: 'default-explore', icon: <DefaultCompassIcon />, label: 'Explore' },
  { id: 'default-notifications', icon: <DefaultBellIcon />, label: 'Notifications' },
];

export type LimelightNavProps = {
  items?: NavItem[];
  defaultActiveIndex?: number;
  activeIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
  showLabels?: boolean;
  showIcons?: boolean;
};

/**
 * An adaptive-width navigation bar with a "limelight" effect that highlights the active item.
 */
export const LimelightNav: React.FC<LimelightNavProps> = ({
  items = defaultNavItems,
  defaultActiveIndex = 0,
  activeIndex: controlledActiveIndex,
  onTabChange,
  className,
  limelightClassName,
  iconContainerClassName,
  iconClassName,
  showLabels = true,
  showIcons = false,
}) => {
  const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActiveIndex);
  const activeIndex = controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (items.length === 0) return;

    const updatePosition = () => {
      const limelight = limelightRef.current;
      const activeItem = navItemRefs.current[activeIndex];
      
      if (limelight && activeItem) {
        const newLeft = activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2;
        limelight.style.left = `${newLeft}px`;

        if (!isReady) {
          setTimeout(() => setIsReady(true), 50);
        }
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [activeIndex, isReady, items]);

  if (items.length === 0) {
    return null; 
  }

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    if (controlledActiveIndex === undefined) {
      setInternalActiveIndex(index);
    }
    onTabChange?.(index);
    itemOnClick?.();
  };

  return (
    <nav className={`relative inline-flex items-center h-12 rounded-none bg-white text-slate-900 border border-slate-300 px-1 shadow-sm ${className || ''}`}>
      {items.map(({ id, icon, label, onClick }, index) => {
        const isCurrent = activeIndex === index;
        return (
          <a
            key={id}
            ref={el => {
              navItemRefs.current[index] = el;
            }}
            className={`relative z-20 flex h-full cursor-pointer items-center justify-center gap-2 px-3 sm:px-4 py-2 select-none shrink-0 whitespace-nowrap ${iconContainerClassName || ''}`}
            onClick={() => handleItemClick(index, onClick)}
            aria-label={label}
          >
            {showIcons && icon && cloneElement(icon as React.ReactElement<any>, {
              className: `w-4 h-4 transition-all duration-200 ease-in-out ${
                isCurrent ? 'opacity-100 text-[#2e1065] scale-110' : 'opacity-80 text-slate-700 hover:text-[#2e1065] hover:opacity-100'
              } ${(icon.props as any)?.className || ''} ${iconClassName || ''}`,
            })}
            {showLabels && label && (
              <span className={`text-sm lg:text-[15px] font-bold tracking-tight font-mono transition-colors duration-200 whitespace-nowrap ${
                isCurrent ? 'text-[#2e1065] font-black' : 'text-slate-700 hover:text-[#2e1065]'
              }`}>
                {label}
              </span>
            )}
          </a>
        );
      })}

      {/* Limelight Spotlight Indicator */}
      <div 
        ref={limelightRef}
        className={`absolute top-0 z-10 w-12 h-[3.5px] rounded-none bg-[#2e1065] shadow-[0_12px_24px_rgba(46,16,101,0.35)] ${
          isReady ? 'transition-[left] duration-300 ease-in-out' : ''
        } ${limelightClassName || ''}`}
        style={{ left: '-999px' }}
      >
        <div className="absolute left-[-45%] top-[3.5px] w-[190%] h-10 [clip-path:polygon(10%_100%,30%_0,70%_0,90%_100%)] bg-gradient-to-b from-[#2e1065]/20 to-transparent pointer-events-none" />
      </div>
    </nav>
  );
};
