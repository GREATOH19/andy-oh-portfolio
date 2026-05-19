import type { IconType } from "react-icons";
import {
  FaBehance,
  FaDribbble,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import type { ContactIcon } from "@/lib/types/project";

export const CONTACT_ICON_MAP: Record<ContactIcon, IconType> = {
  email: MdEmail,
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
  twitter: FaTwitter,
  github: FaGithub,
  behance: FaBehance,
  dribbble: FaDribbble,
  youtube: FaYoutube,
  website: FaGlobe,
};
