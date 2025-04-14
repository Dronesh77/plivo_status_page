"use client";

import { useEffect, useState } from "react";

const statusColors = {
  Operational: "text-green-600",
  "Degraded Performance": "text-yellow-600",
  "Partial Outage": "text-orange-600",
  "Major Outage": "text-red-600",
};

const ServiceList = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, []);

  return (
    <div className="space-y-4">
      {services.map((s) => (
        <div key={s._id} className="border p-4 rounded shadow-sm">
          <div className="text-lg font-semibold">{s.name}</div>
          <div className={statusColors[s.status] + " font-medium"}>{s.status}</div>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;