import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

const prisma = new PrismaClient();

app.get("/", (req: Request, res: Response) => {
  res.send("deg");
});

// Test Code for Prisma
app.get("/user", async (req: Request, res: Response) => {
  const allUsers = await prisma.user.findMany();
  res.send(allUsers);
});

// Test Code for Prisma
app.get("/user/new", async (req: Request, res: Response) => {
  await prisma.user.create({
    data: {
      email: Math.random() + "@iecun.deg",
      name: "whatever",
    },
  });

  res.redirect("/user");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
