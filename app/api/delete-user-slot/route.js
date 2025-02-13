import { Redis } from "@upstash/redis";
import { handleError } from "@/lib/utils";

// Initialize the Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function DELETE(request) {
  try {
    // Parse the incoming request body
    const { user_id } = await request.json();

    console.log("User ID to delete:", user_id);

    // Delete the user data from Redis
    const response = await redis.del(`user:${user_id}`);

    if (response === 1) {
      return new Response(
        JSON.stringify({ message: "User data deleted successfully!" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "User ID not found in Redis." }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    // Handle errors
    handleError(error);

    return new Response(
      JSON.stringify({ message: "Error deleting data from Redis." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
