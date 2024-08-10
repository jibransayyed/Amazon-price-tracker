
import Image from "next/image";
import React from "react";

import Navbar from "./components/Navbar";
import { MongoClient } from "mongodb";
import Link from "next/link";


const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'amazon';


export default async function Home() {
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('prices');
  const findResult = await collection.aggregate([
    {
      $group: {
        _id: "$asin",
        title: {$first: "$title"}
      }
        
      },
      {
        $project:{
          _id: 0,
          asin: "$_id",
          title: 1
        }
      }
    ]).toArray();

    console.log(findResult)


 
  return (
    <>
    <Navbar/>
    <div className="container mx-auto">

      <h1 className="text-center font-bold text-3xl p-5"> Welcome to Amazon Price Tracker</h1>

      <ul className='list-decimal p-10 font-bold'>

        {findResult.map(item=>{
        return <li className="my-4"><Link href={`/${item.asin}`}><div>{item.title}</div></Link></li>

      })}
    </ul>

  </div>    
</>
  );

}
