'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Predefined status options
  const statusOptions = [
    'Operational',
    'Degraded Performance',
    'Partial Outage',
    'Major Outage',
    'Investigating',
    'Identified',
    'Monitoring',
    'Resolved',
  ];

  // Status color mapping
  const statusColorMap = {
    'Operational': 'bg-green-100 text-green-800',
    'Degraded Performance': 'bg-yellow-100 text-yellow-800',
    'Partial Outage': 'bg-orange-100 text-orange-800',
    'Major Outage': 'bg-red-100 text-red-800',
    'Investigating': 'bg-blue-100 text-blue-800',
    'Identified': 'bg-purple-100 text-purple-800',
    'Monitoring': 'bg-cyan-100 text-cyan-800',
    'Resolved': 'bg-green-100 text-green-800',
  };

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/service/${id}`);
        if (!res.ok) throw new Error('Failed to fetch service');
        const data = await res.json();
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      alert('Please select a status!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/service/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          description: newDescription,
        }),
      });

      if (!res.ok) throw new Error('Failed to update service');
      const updatedService = await res.json();
      setService(updatedService);
      setNewStatus('');
      setNewDescription('');
    } catch (error) {
      console.error('Error updating service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 rounded-lg shadow-md bg-white text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 rounded-lg shadow-md bg-white text-center">
          <div className="text-red-500 text-xl font-semibold">Service Not Found</div>
          <p className="mt-2 text-gray-600">The requested service could not be found.</p>
          <Link 
            href="/dashboard" 
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-10 relative">
      {/* Back button */}
      <Link 
        href="/dashboard" 
        className="absolute top-6 left-6 flex items-center text-blue-600 hover:text-blue-800 transition font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Dashboard
      </Link>

      <div className="mt-8 border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Service: {service.name}</h1>
        <div className="mt-2 flex items-center">
          <span className="text-gray-500">Current Status: </span>
          <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${statusColorMap[service.statusUpdates[0]?.status || 'bg-gray-100 text-gray-800']}`}>
            {service.statusUpdates[0]?.status || 'Unknown'}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Status History</h2>
        {service.statusUpdates.length === 0 ? (
          <p className="text-gray-500 italic">No status updates available</p>
        ) : (
          <div className="space-y-4">
            {service.statusUpdates.map((update, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColorMap[update.status] || 'bg-gray-100 text-gray-800'}`}>
                    {update.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(update.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{update.description || 'No description provided'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Update Service Status</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">Select a Status</option>
              {statusOptions.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-32"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Provide details about the current status..."
              rows={4}
            />
          </div>

          <button
            onClick={handleUpdateStatus}
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update Status'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;