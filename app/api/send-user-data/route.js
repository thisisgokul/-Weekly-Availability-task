import { Redis } from "@upstash/redis";
import { handleError } from "@/lib/utils";
import { randomUUID } from "crypto"; // Built-in Node.js module for UUID generation

// Initialize the Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(request) {
  try {
    // Parse the incoming request body
    const data = await request.json();

    // Generate a unique user ID
    const userId = randomUUID();

    const updatedData = {
        ...data,
        data: data.data.map((day) => ({
          ...day,
          timeSlots: day.timeSlots.map((slot) => ({
            ...slot,
            user_id: userId, // Add the user ID here
          })),
        })),
      };
  
      // Store the updated data in Redis under a unique key (e.g., user:id)
      const response = await redis.set(`user:${userId}`, JSON.stringify(updatedData));

    // Return the unique ID and a success message
    return new Response(
      JSON.stringify({
        message: "Data saved successfully",
        userId, // Return the unique user ID to the client
        redisResponse: response,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Handle errors
    handleError(error);

    return new Response(
      JSON.stringify({ message: "Error saving data to Redis" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
