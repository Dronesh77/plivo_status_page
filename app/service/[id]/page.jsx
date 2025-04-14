// app/service/[id]/page.js

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newDescription, setNewDescription] = useState('');

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

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      const res = await fetch(`/api/service/${id}`);
      const data = await res.json();
      setService(data);
    };

    fetchService();
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      alert('Please select a status!');
      return;
    }

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

    const updatedService = await res.json();
    setService(updatedService);
    setNewStatus('');
    setNewDescription('');
  };

  if (!service) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold">Service: {service.name}</h1>
      <h2 className="mt-4 text-lg font-medium">Status Updates</h2>
      <ul className="mt-2">
        {service.statusUpdates.map((update, index) => (
          <li key={index} className="border-b pb-2 mb-2">
            <strong>Status:</strong> {update.status} <br />
            <strong>Description:</strong> {update.description} <br />
            <strong>Created At:</strong> {new Date(update.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>

      <h3 className="mt-6 text-lg font-medium">Update Service Status</h3>
      <div className="mt-4">
        <label className="block mb-1 font-medium">Update Status</label>
        <select
          className="w-full border px-3 py-2 rounded"
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

      <div className="mt-4">
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Enter status description"
        />
      </div>

      <button
        onClick={handleUpdateStatus}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Update Status
      </button>
    </div>
  );
};

export default ServiceDetailPage;
