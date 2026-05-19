import type {Metadata} from "next";
import {redirect} from "next/navigation";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  redirect("/about#contact");
}
