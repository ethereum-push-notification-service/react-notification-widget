import React from 'react';

export const Users = (props: { color?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.22741 9.14873H7.26218C8.19013 9.14873 8.49074 8.82691 8.49074 8.3069C8.49074 7.04191 6.8199 5.32106 4.2448 5.32106C1.67464 5.32106 0 7.04191 0 8.3069C0 8.82691 0.300597 9.14873 1.22741 9.14873ZM4.24594 4.46326C5.39115 4.46326 6.30263 3.4727 6.30263 2.22091C6.30263 1.01812 5.3798 0.0229492 4.24594 0.0229492C3.11214 0.0229492 2.18548 1.0266 2.19306 2.22704C2.19685 3.4727 3.10339 4.46326 4.24594 4.46326ZM10.0063 5.32106C9.23101 5.32106 8.53605 5.48043 7.9485 5.73121C8.80164 6.42875 9.34715 7.33935 9.34715 8.3069C9.34715 8.63312 9.28118 8.91705 9.14811 9.14873H13.0237C13.9505 9.14873 14.251 8.82691 14.251 8.3069C14.251 7.04191 12.5764 5.32106 10.0063 5.32106ZM10.0063 4.46326C11.1489 4.46326 12.0592 3.4727 12.0592 2.22091C12.0592 1.01812 11.1401 0.0229492 10.0063 0.0229492C8.87362 0.0229492 7.94579 1.0266 7.95074 2.22704C7.95455 3.4727 8.86109 4.46326 10.0063 4.46326ZM15.7541 5.32106C14.9826 5.32106 14.2926 5.48043 13.7012 5.73006C14.5631 6.4238 15.1086 7.33558 15.1086 8.3069C15.1086 8.63312 15.0377 8.91705 14.9058 9.14873H18.7714C19.6994 9.14873 20 8.82691 20 8.3069C20 7.04191 18.3292 5.32106 15.7541 5.32106ZM15.7552 4.46326C16.8978 4.46326 17.8119 3.4727 17.8119 2.22091C17.8119 1.01812 16.8891 0.0229492 15.7552 0.0229492C14.6214 0.0229492 13.6947 1.0266 13.7023 2.22704C13.7061 3.4727 14.6127 4.46326 15.7552 4.46326Z"
        fill={props.color || 'white'}
      />
    </svg>
  );
};
