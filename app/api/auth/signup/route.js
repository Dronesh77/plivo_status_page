// app/api/auth/signup/route.js
import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, username, password } = await request.json();

    // Validate inputs
    if (!email || !username || !password) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDB();

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "User already exists" }), 
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      isAdmin: false // Default new users to non-admin
    });

    // Return success (don't send back password)
    const safeUser = {
      id: newUser._id.toString(),
      email: newUser.email,
      username: newUser.username
    };

    return new Response(
      JSON.stringify({ 
        message: "User created successfully", 
        user: safeUser 
      }), 
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to create user" }), 
      { status: 500 }
    );
  }
}