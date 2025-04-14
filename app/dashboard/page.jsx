"use client"

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const DashboardPage = () => {
  const { data: session } = useSession()
  const [services, setServices] = useState([])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/service')
        const data = await res.json()
        setServices(data)
      } catch (err) {
        console.error('Failed to fetch services:', err)
      }
    }
    fetchServices()
  }, [])

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome, {session?.user?.name}</p>

      <Link
        href="/status"
        className="inline-block mb-6 text-blue-600 hover:underline"
      >
        + Add Service
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Link
            href={`/service/${service._id}`}
            key={service._id}
            className="bg-white p-6 rounded shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-blue-600 hover:underline">
              {service.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage
