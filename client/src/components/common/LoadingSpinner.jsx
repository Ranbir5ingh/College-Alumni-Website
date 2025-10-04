function LoadingSpinner({ message = "Loading events..." }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="ml-3 text-gray-600">{message}</p>
    </div>
  );
}

export default LoadingSpinner;