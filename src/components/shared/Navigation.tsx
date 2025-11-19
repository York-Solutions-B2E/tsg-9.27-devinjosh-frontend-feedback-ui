import {Link} from "react-router"

export function Navigation() {
    return (
      <nav className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-semibold text-primary-600 dark:text-primary-400">
              Feedback Portal
            </div>
            <div className="flex space-x-4">
              <Link to="/submit" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-400 dark:text-gray-300">
                Submit Feedback
              </Link>
              <Link to="/my-feedback" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-400 dark:text-gray-300">
                My Feedback
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }