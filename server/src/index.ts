import app from "./app";
import { config } from "dotenv";
import prisma from "./middlewares/prisma";

config();
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running in port "${PORT}"`));

process.on("SIGINT", () => {
  prisma.$disconnect();
  console.log("Prisma Disconnected.");
  process.exit(0);
});
