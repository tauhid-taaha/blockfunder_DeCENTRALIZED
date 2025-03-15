import {
  createCampaign,
  dashboard,
  logout,
  payment,
  profile,
  withdraw,
} from "../assets";
import { createThirdwebClient } from "thirdweb";
const CLIENT_ID = "a73644753ab5661818da3ad6d347bd27";
export const navlinks = [
  {
    name: "dashboard",
    imgUrl: dashboard,
    link: "/home",
  },
  {
    name: "campaign",
    imgUrl: createCampaign,
    link: "/create-campaign",
  },
  {
    name: "payment",
    imgUrl: payment,
    link: "/chatbot",
  },
  {
    name: "withdraw",
    imgUrl: withdraw,
    link: "/donated-campaigns",
    
  },
  {
    name: "profile",
    imgUrl: profile,
    link: "/profile",
  }
];
