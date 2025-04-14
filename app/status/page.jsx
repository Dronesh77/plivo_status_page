'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const StatusPage = () => {
  const [name, setName] = useState('Website')
  const [status, setStatus] = useState('Operational')
  const [description, setDescription] = useState('')
  const router = useRouter()

  // Predefined service options
  const serviceOptions = [
    'Website',
    'API',
    'Database',
    'Authentication',
    'Payment Processing',
    'Email Service',
    'File Storage',
    'CDN',
    'Search',
    'Analytics'
  ]

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
          <select
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          >
            {serviceOptions.map((service, index) => (
              <option key={index} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Save
        </button>
      </form>
    </div>
  )
}

export default StatusPage;