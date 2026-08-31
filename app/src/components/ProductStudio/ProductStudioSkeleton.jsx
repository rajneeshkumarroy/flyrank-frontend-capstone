import React from 'react';

export default function ProductStudioSkeleton() {
  return (
    <div
      className="studio-skeleton"
      role="status"
      aria-label="Loading 3D Product Studio..."
    >
      <div className="skeleton-stage">
        <div className="skeleton-orb-placeholder">
          <div className="skeleton-spinner" aria-hidden="true" />
          <p className="skeleton-text">Initializing 3D WebGL Studio...</p>
        </div>
      </div>
      <div className="skeleton-panel">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-subtitle" />
        <div className="skeleton-group">
          <div className="skeleton-box" />
          <div className="skeleton-box" />
          <div className="skeleton-box" />
          <div className="skeleton-box" />
        </div>
        <div className="skeleton-line" />
        <div className="skeleton-line" />
      </div>
    </div>
  );
}
