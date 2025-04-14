"use client"

import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const DashboardPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn() // Redirect to sign-in if not logged in
    }
  }, [status])

  useEffect(() => {
    if (status === "authenticated") {
      const fetchServices = async () => {
        setIsLoading(true)
        try {
          const res = await fetch('/api/service')
          if (!res.ok) throw new Error('Failed to fetch services')
          const data = await res.json()
          setServices(data)
        } catch (err) {
          console.error('Failed to fetch services:', err)
        } finally {
          setIsLoading(false)
        }
      }
      fetchServices()
    }
  }, [status])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Status color mapping for service status badges
  const getStatusColor = (status) => {
    const statusMap = {
      'Operational': 'bg-green-100 text-green-800 border-green-200',
      'Degraded Performance': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Partial Outage': 'bg-orange-100 text-orange-800 border-orange-200',
      'Major Outage': 'bg-red-100 text-red-800 border-red-200',
      'Investigating': 'bg-blue-100 text-blue-800 border-blue-200',
      'Identified': 'bg-purple-100 text-purple-800 border-purple-200',
      'Monitoring': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Resolved': 'bg-green-100 text-green-800 border-green-200',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Status Dashboard</h1>
            {session?.user && (
              <p className="mt-2 text-gray-600">
                Welcome back, <span className="font-medium">{session.user.name}</span>
              </p>
            )}
          </div>
          <Link
            href="/status"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Service
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No services found</h3>
            <p className="mt-2 text-gray-500">Get started by adding your first service.</p>
            <div className="mt-6">
              <Link
                href="/status"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Service
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const currentStatus = service.statusUpdates?.[0]?.status || 'Unknown';
              return (
                <Link
                  href={`/service/${service._id}`}
                  key={service._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col border border-gray-200"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {service.name}
                      </h2>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(currentStatus)}`}>
                        {currentStatus}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {service.description || 'No description provided'}
                    </p>
                  </div>
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {service.statusUpdates?.length > 0 
                        ? `Updated ${new Date(service.statusUpdates[0].createdAt).toLocaleDateString()}`
                        : 'No updates yet'}
                    </span>
                    <span className="text-blue-600 font-medium text-sm hover:text-blue-800">View Details &rarr;</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage