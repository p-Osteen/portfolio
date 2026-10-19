/* Archive data. Rendered into #rows by main.js. */
window.CATEGORIES = {
  food: "Restaurant",
  transport: "Transport",
  health: "Healthcare",
  ecommerce: "Commerce",
  fintech: "FinTech",
  iot: "IoT",
  gaming: "Gaming",
  education: "Education",
  hr: "HR & Ops"
};

window.PROJECTS = [
  { name: "Norda Kitchen", cat: "food", meta: "2 apps", desc: "Cloud/ghost kitchen subscription platform with BLE device integration, Google Maps delivery and a health API.", tech: ["BLE", "Maps", "Firebase Auth", "Subscriptions"] },
  { name: "eFood", cat: "food", meta: "2 apps", desc: "Food delivery platform with a customer ordering app and a delivery driver app with real-time tracking.", tech: ["Firebase", "Maps", "Real-time"] },
  { name: "Roastery", cat: "food", desc: "Coffee roastery e-commerce and ordering app for specialty coffee businesses.", tech: ["E-commerce", "Ordering"] },
  { name: "Dine-In App", cat: "food", meta: "2 versions", desc: "In-restaurant ordering app. Migrated the backend from .NET v1 to v2, demonstrating codebase evolution.", tech: [".NET API", "Migration"] },
  { name: "Tea POS", cat: "food", desc: "SaaS-based POS system designed for tea and café businesses.", tech: ["SaaS", "POS"] },
  { name: "Foodyman", cat: "food", meta: "61 builds", desc: "Multi-vendor food delivery platform built on a Riverpod architecture. 61 production builds.", tech: ["Riverpod", "Multi-vendor"] },

  { name: "Safar Cab", cat: "transport", meta: "2 apps", desc: "Uber-style ride-hailing platform with rider and driver apps, real-time GPS tracking and trip management.", tech: ["Google Maps", "GPS tracking", "Firebase"] },
  { name: "Exodus", cat: "transport", meta: "3 apps", desc: "Three-app trucking and logistics ecosystem — customer booking, driver dispatch and fleet-owner management.", tech: ["Fleet mgmt", "Booking", "Dispatch"] },

  { name: "Hospivio", cat: "health", meta: "3 apps", desc: "Hospital management suite — manager, staff and front-desk apps. Handles room updates, leave requests and notifications.", tech: ["Healthcare", "Room mgmt", "Staff"] },

  { name: "CityMart", cat: "ecommerce", desc: "Full-featured e-commerce mobile app with internationalisation, a Postman API collection and a comprehensive product catalogue.", tech: ["i18n", "E-commerce", "REST APIs"] },
  { name: "Odoo Inventory", cat: "ecommerce", desc: "Odoo ERP inventory management mobile app for warehouse and stock-tracking operations.", tech: ["Odoo ERP", "Inventory"] },
  { name: "RentPro", cat: "ecommerce", desc: "Real-estate rental management platform for property listings, tenant management and rent tracking.", tech: ["Real estate", "Listings"] },
  { name: "Four Square", cat: "ecommerce", desc: "E-commerce and ordering application with a product catalogue and checkout flow.", tech: ["E-commerce", "Ordering"] },

  { name: "Star Discounts", cat: "fintech", desc: "Discount and deals platform with curated offers from local and international brands.", tech: ["Deals", "Offers"] },
  { name: "Winso", cat: "fintech", meta: "2 apps", desc: "Raffle and lottery platform with an integrated payment app for ticket purchases and prize claims.", tech: ["Raffle", "Payments"] },
  { name: "Star Pay", cat: "fintech", desc: "Payment collection and processing app for managing financial transactions.", tech: ["Payments", "Collection"] },

  { name: "Neurya", cat: "iot", meta: "App + SDK", desc: "Smartwatch health-tracking app plus a plug-and-play Flutter SDK for E900-series watches: BLE, health data sync and device management.", tech: ["BLE", "Health API", "SDK", "Charts"] },
  { name: "QC Band", cat: "iot", desc: "QCBand SDK integration app for wearable health-monitoring devices.", tech: ["Wearables", "SDK"] },

  { name: "GameOn", cat: "gaming", desc: "Gaming platform with multiple game types and user-engagement features.", tech: ["Gaming", "Animations"] },
  { name: "Ludo", cat: "gaming", meta: "10 builds", desc: "Classic Ludo board game built entirely in Flutter with smooth animations. 10 production builds.", tech: ["Board game", "CustomPaint"] },
  { name: "Snake & Ladder", cat: "gaming", desc: "Classic snakes-and-ladders board game with multiplayer support and animated gameplay.", tech: ["Board game", "Multiplayer"] },
  { name: "Color Prediction", cat: "gaming", desc: "Colour prediction game with engaging UI animation and a scoring system.", tech: ["Game logic", "Animations"] },

  { name: "ACA Chess Academy", cat: "education", desc: "Chess academy management: class schedules, tournaments, performance tracking, certificates, fee payments and push notifications.", tech: ["Calendar", "Firebase FCM", "PDF", "WebView"] },

  { name: "HRMS", cat: "hr", meta: "2 apps", desc: "HR management system with an admin panel and an employee app for leave, attendance and team coordination.", tech: ["Admin panel", "Employee app"] },
  { name: "Attendance Tracker", cat: "hr", desc: "Location-based punch in/out attendance tracking with GPS capture for workforce management.", tech: ["Geolocation", "Attendance"] }
];
