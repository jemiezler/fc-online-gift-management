"use client";
import { GiftResponse, GiftTable } from "@/components/gift-table";

import React, { useEffect, useState } from "react";


export default function Page() {
  const [data, setData] = useState<GiftResponse[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/gifts`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);
  console.log("Data fetched:", data);
  return <GiftTable data={data} />;
}
