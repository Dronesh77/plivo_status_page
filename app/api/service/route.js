// app/api/service/route.js

import { connectToDB } from "@/utils/database";
import Service from "@/models/service";

// GET: fetch all services (names only)
export async function GET(req) {
  await connectToDB();

  const services = await Service.find({}, 'name'); // only fetch 'name' field
  return Response.json(services);
}

// POST: create new service
export async function POST(req) {
  await connectToDB();

  const { name, status, description } = await req.json();
  const newService = await Service.create({ name, status, description });

  return Response.json(newService);
}
