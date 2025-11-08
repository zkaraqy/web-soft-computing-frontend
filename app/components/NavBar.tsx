"use client";

import { useEffect } from "react";

const testFetch = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/");
    const data = await response.json();
    console.log("Response from backend:", data);
  } catch (error) {
    console.error("Error fetching from backend:", error);
  }
};
export default function NavBar() {
  useEffect(() => {
    testFetch();
  }, []);
  return (
    <div className="navbar shadow-sm fixed top-0 z-50 bg-indigo-300/50 backdrop-blur-xl px-8">
      <div className="flex-1">
        <a className="text-xl italic font-bold">Soft Computing</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Tugas 1</a>
          </li>
          <li>
            <a>Tugas 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
