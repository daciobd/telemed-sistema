# Performance Testing Guide

## Overview
This document outlines the performance testing setup for the TeleMed Sistema, specifically for the VideoConsultation component which serves as our performance optimization pilot.

## Performance Budget
Our performance targets are defined in `perf/budget.json`:

- **LCP (Largest Contentful Paint)**: ≤ 3.5s
- **TBT (Total Blocking Time)**: ≤ 300ms  
- **TTI (Time to Interactive)**: ≤ 4.0s
- **CLS (Cumulative Layout Shift)**: ≤ 0.1
- **Total Transfer Size**: ≤ 1.5MB

## Running Performance Tests

### Prerequisites
1. Ensure the development server is running: `npm run dev`
2. VideoConsultation endpoint should be accessible at `/video-consultation?consultationId=demo`

### Lighthouse Testing

#### Single Test Run
```bash
npm run lighthouse:video
```

#### Full Performance Analysis
```bash
npm run perf:video
```

This script will:
1. Start the development server (if not running)
2. Run Lighthouse against the VideoConsultation page
3. Generate HTML and JSON reports
4. Save results to `perf/video-baseline.html` and `perf/video-baseline.json`

### Understanding Results

#### Key Metrics to Monitor
1. **Performance Score**: Should be 90+ for production
2. **LCP**: How quickly the main content loads
3. **TBT**: How much the main thread is blocked
4. **CLS**: Visual stability during loading

#### Report Files
- `perf/video-baseline.html`: Visual report with detailed breakdown
- `perf/video-baseline.json`: Raw data for programmatic analysis

#### Optimization Strategies Applied
1. **React Optimizations**: memo, useCallback, useMemo
2. **Query Optimization**: staleTime, payload reduction
3. **Bundle Optimization**: Code splitting, tree shaking
4. **Accessibility**: WCAG 2.1 compliance
5. **Server Performance**: Server-Timing headers, compression

## Monitoring Setup

### Development Instrumentation
The VideoConsultation component includes development tools:
- `useRenders`: Tracks component re-render count
- `usePerfMarks`: Marks performance milestones
- Server-Timing headers for backend performance

### Continuous Monitoring
For production deployment, consider:
- Web Vitals monitoring
- Real User Monitoring (RUM)
- Synthetic testing with Lighthouse CI

## Performance Optimization Checklist

### Frontend Optimizations
- [x] Component memoization (React.memo)
- [x] Callback stabilization (useCallback)
- [x] Computed value memoization (useMemo)
- [x] Query optimization (staleTime, select)
- [x] Accessibility improvements (ARIA labels)
- [x] Component isolation (prevent unnecessary re-renders)

### Backend Optimizations
- [x] Server-Timing middleware
- [x] Compression middleware
- [x] Security headers optimization
- [x] Health check endpoints

### Next Steps
1. Apply optimizations to other components
2. Implement Lighthouse CI for automated testing
3. Set up performance monitoring in production
4. Create performance regression tests