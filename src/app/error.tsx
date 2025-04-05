'use client';

export default function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">500</h1>
        <p className="text-gray-600">Error del servidor</p>
      </div>
    </div>
  );
} 