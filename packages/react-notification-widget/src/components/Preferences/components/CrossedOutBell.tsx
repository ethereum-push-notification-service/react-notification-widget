import React from 'react';
import { IconProps } from '../../icons/types';

const CrossedOutBell = ({ className }: IconProps) => (
  <svg
    width="100%"
    height="100%"
    className={className}
    viewBox="0 0 16 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.5929 14.8096L12.6429 12.8843H1.85V12.1791L3.27857 10.7687V6.53738C3.27857 5.73343 3.48571 4.93653 3.87143 4.22426L0.5 0.895628L1.41429 0L15.5 13.914L14.5929 14.8096ZM13.2786 9.92243V6.53738C13.2786 4.3512 11.8286 2.42595 9.70714 1.80536V1.60085C9.70714 1.22678 9.55663 0.868025 9.28872 0.603516C9.02081 0.339008 8.65745 0.190409 8.27857 0.190409C7.89969 0.190409 7.53633 0.339008 7.26842 0.603516C7.00051 0.868025 6.85 1.22678 6.85 1.60085V1.80536C6.41429 1.9323 5.99286 2.12271 5.60714 2.36953L13.2786 9.92243ZM8.27857 15C8.65745 15 9.02081 14.8514 9.28872 14.5869C9.55663 14.3224 9.70714 13.9636 9.70714 13.5896H6.85C6.85 13.9636 7.00051 14.3224 7.26842 14.5869C7.53633 14.8514 7.89969 15 8.27857 15Z"
      fill="currentColor"
    />
  </svg>
);

export default CrossedOutBell;
