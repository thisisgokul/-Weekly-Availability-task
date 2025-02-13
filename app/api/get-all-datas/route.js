


import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Initialize the Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});


export async function GET(request) {
    try {
      
  
      // Retrieve all keys with the "user:" prefix
      const keys = await redis.keys("user:*");
  
      // Fetch values for the keys
      const users = await Promise.all(keys.map((key) => redis.get(key)));
  
 
        return NextResponse.json( users , { status: 200 });
   
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json(
        { error: "Failed to retrieve users" },
        { status: 500 }
      );
    }
  }
  

