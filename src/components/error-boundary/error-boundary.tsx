'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode | ReactNode[];
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Application error caught:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Ошибка приложения</h1>
            <p className="text-gray-400 mb-2">Произошла ошибка при загрузке компонента</p>
            {this.state.error && (
              <p className="text-sm text-gray-500 font-mono">{this.state.error.message}</p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
