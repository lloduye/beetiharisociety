import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Catches JavaScript errors in the dashboard tree and shows a fallback UI
 * instead of a white screen.
 */
class DashboardErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 text-sm mb-6">
            The dashboard hit an error. You can try refreshing or logging in again.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              Refresh page
            </button>
            <Link
              to="/dashboard/login"
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Back to login
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default DashboardErrorBoundary;
