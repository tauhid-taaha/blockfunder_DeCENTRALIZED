import {
  Dashboard,
  Campaign,
  CreditCard,
  LocalAtm,
  Article,
  Bookmark,
  AccountCircle,
  VolunteerActivism, // ✅ Added for "Donate" (Solid Hands Icon)
} from "@mui/icons-material"; // ✅ Using Material UI Icons

export const navlinks = [
  {
    name: "Dashboard",
    imgUrl: "Dashboard", // ✅ Store MUI icon name as a string
    link: "/home",
  },
  {
    name: "Campaign",
    imgUrl: "Campaign",
    link: "/create-campaign",
  },
  {
    name: "Payment",
    imgUrl: "CreditCard",
    link: "/chatbot",
  },
  {
    name: "Withdraw",
    imgUrl: "LocalAtm",
    link: "/donated-campaigns",
  },
  {
    name: "Blogs",
    imgUrl: "Article",
    link: "/blogs",
  },
  {
    name: "Bookmarks",
    imgUrl: "Bookmark",
    link: "/bookmarks",
  },
  {
    name: "Profile",
    imgUrl: "AccountCircle",
    link: "/profile",
  },
  {
    name: "Donate",
    imgUrl: "VolunteerActivism",
    link: "/donate",
  },
];
