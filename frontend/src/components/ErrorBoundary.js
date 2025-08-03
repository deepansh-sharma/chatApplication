import React from "react";
import config from "../config/config";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error("Error caught by boundary:", error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-8">
                We're sorry, but something unexpected happened. Our team has
                been notified and is working to fix this issue.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={this.handleReload}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Go to Homepage
              </button>
            </div>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left bg-gray-100 rounded-lg p-4 mt-8">
                <summary className="cursor-pointer font-medium text-gray-900 mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="text-sm text-gray-700 space-y-2">
                  <div>
                    <strong>Error:</strong>
                    <pre className="mt-1 text-xs bg-red-50 p-2 rounded overflow-auto">
                      {this.state.error && this.state.error.toString()}
                    </pre>
                  </div>
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="mt-1 text-xs bg-red-50 p-2 rounded overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}

            <div className="text-xs text-gray-500">
              {config.APP_NAME} v{config.APP_VERSION}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
