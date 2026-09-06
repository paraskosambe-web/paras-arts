require("dotenv").config();

const connectDB = require("../config/db");
const Service = require("../models/Service");

const services = [
  {
    title: "Custom Portrait",
    description:
      "A detailed hand-drawn portrait created from your favourite photograph.",
    priceFrom: 1000,
    icon: "Brush",
    delivery: "3–5 weeks",
  },

  {
    title: "Couple Portrait",
    description:
      "Turn a special moment between two people into a beautiful custom artwork.",
    priceFrom: 3000,
    icon: "Heart",
    delivery: "4–6 weeks",
  },

  {
    title: "Family Portrait",
    description:
      "A timeless hand-drawn artwork bringing your family memories together.",
    priceFrom: 5000,
    icon: "Users",
    delivery: "5–8 weeks",
  },

  {
    title: "Pet Portrait",
    description:
      "A detailed portrait of your beloved pet, capturing their personality and character.",
    priceFrom: 2000,
    icon: "PawPrint",
    delivery: "3–5 weeks",
  },

  {
    title: "Car / Motorsports Sketch",
    description:
      "A detailed automotive artwork created for car lovers and motorsport enthusiasts.",
    priceFrom: 4000,
    icon: "Car",
    delivery: "4–6 weeks",
  },
];

async function seedServices() {
  try {
    await connectDB();

    console.log("Connected to MongoDB.");

    for (const service of services) {
      const existing = await Service.findOne({
        title: service.title,
      });

      if (existing) {
        console.log(
          `Already exists: ${service.title}`
        );
        continue;
      }

      await Service.create(service);

      console.log(
        `Created: ${service.title}`
      );
    }

    console.log(
      "Service seeding completed successfully."
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Service seeding failed:",
      error
    );

    process.exit(1);
  }
}

seedServices();