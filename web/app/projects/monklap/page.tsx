import {MonklapPage} from "@/components/monklap/MonklapPage";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Monklap",
  description: "A touchless ambient scent system that answers a clap.",
};

export default function Page() {
  return <MonklapPage />;
}
