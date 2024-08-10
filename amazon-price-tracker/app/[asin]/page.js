import React from "react";
import Navbar from "../components/Navbar";
import { MongoClient } from "mongodb";
import DisplayChart from "../components/DisplayChart";

const url = "mongodb://localhost:27017/";
const client = new MongoClient(url);

// Database Name
const dbName = "amazon";

export default async function Page({ params }) {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("prices");

  let asin = params.asin;
  const result = await collection.aggregate([
    {
      $match: {
        asin: asin.toUpperCase()
      }
    },
    {
      $sort: {
        time: 1
      }
    },
    {
      $group: {
        _id: "$asin",
        data: {
          $push: {
            time: "$time", // Full timestamp
            price: { $toInt: "$priceInt" }
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        data: "$data"
      }
    }
  ]).toArray();

  console.log("Result from MongoDB:", JSON.stringify(result, null, 2)); // Log the structure

  // Transform the result into the format expected by the chart component
  const data = result.length > 0 ? [
    {
      label: "Product",
      data: result[0].data.map((item) => ({
        x: new Date(item.time), // Convert full timestamp to Date object
        y: item.price
      }))
    }
  ] : []; // Handle case where result is empty

  return (
    <div>
      <Navbar />
      <div className="Container mx-auto p-9">
        Track Price for: {params.asin}
        <DisplayChart data={data} />
      </div>
    </div>
  );
}
