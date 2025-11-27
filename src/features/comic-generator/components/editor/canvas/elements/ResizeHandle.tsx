import React from 'react';

export const ResizeHandle = () => (
  <div className="w-3 h-3 bg-blue-500 rounded-full border border-white shadow-sm" />
);

export const customResizeHandles = {
  bottomRight: <ResizeHandle />,
  bottomLeft: <ResizeHandle />,
  topRight: <ResizeHandle />,
  topLeft: <ResizeHandle />,
};