import { connectToDB } from "@/utils/database";
import Service from "@/models/service";

// Get service by ID, return all status updates
export async function GET(req, { params }) {
  await connectToDB();
  const serviceId = params.id;

  const service = await Service.findById(serviceId);

  if (!service) {
    return new Response("Service not found", { status: 404 });
  }

  return Response.json(service);
}

// Update service status and keep track of past status updates
export async function PUT(req, { params }) {
  await connectToDB();
  const { status, description } = await req.json();

  const serviceId = params.id;

  // Push the new status update while preserving previous ones
  const updatedService = await Service.findByIdAndUpdate(
    serviceId,
    {
      $push: {
        statusUpdates: {
          status,
          description,
          createdAt: new Date(),
        },
      },
    },
    { new: true }
  );

  if (!updatedService) {
    return new Response("Service not found", { status: 404 });
  }

  return Response.json(updatedService);
}

// Create new service with initial status
export async function POST(req) {
  await connectToDB();

  const { name, status, description } = await req.json();

  // Create the new service with the initial status
  const newService = await Service.create({
    name,
    statusUpdates: [
      {
        status,
        description,
        createdAt: new Date(),
      },
    ],
  });

  return Response.json(newService);
}
