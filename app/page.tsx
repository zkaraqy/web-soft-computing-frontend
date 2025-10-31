import { permanentRedirect, redirect } from "next/navigation";
import HomePage from "./components/HomePage";

export default function Home() {
  // permanentRedirect('/tugas-1')
  return <HomePage />;
}
