"use client";
import { GiftResponse, GiftTable } from "@/components/gift-table";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<GiftResponse[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/gifts`, { cache: "no-store" })
        .then((res) => res.json())
        .then((json) => {
          if (isMounted) setData(json);
        });
    };

    fetchData();

    const intervalId = setInterval(fetchData, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return <GiftTable data={data} />;
}
