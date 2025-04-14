'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const StatusPage = () => {
  const [name, setName] = useState('')
  const [status, setStatus] = useState('Operational')
  const [description, setDescription] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api/service', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, status, description }),
    })
    router.push('/dashboard')
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add a New Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Service Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Operational</option>
            <option>Degraded Performance</option>
            <option>Partial Outage</option>
            <option>Major Outage</option>
            <option>Investgating</option>
            <option>Identified</option>
            <option>Monitoring</option>
            <option>Resolved</option>

          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional detailed status info"
          />
        </div>
        <button
          type="submit"
          className="bg-primary-orange text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Save
        </button>
      </form>
    </div>
  )
}

export default StatusPage;