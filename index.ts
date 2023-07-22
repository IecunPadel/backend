import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

const prisma = new PrismaClient();

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("deg");
});

app.post("/login", async (req: Request, res: Response) => {
  let body = req.body;

  let user: User | null = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Incorrect email or password",
      },
    });
  }

  if (!bcrypt.compareSync(body.password, user.password)) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Incorrect email or password",
      },
    });
  }

  let token = jwt.sign(
    {
      usuario: user.username,
    },
    // @ts-ignore
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.TOKEN_EXPIRE,
    }
  );

  res.json({
    ok: true,
    user: user.username,
    token,
  });
});

app.post("/register", async (req: Request, res: Response) => {
  let body = req.body;

  const user: User | null = await prisma.user.create({
    data: {
      email: body.email,
      username: body.username,
      password: bcrypt.hashSync(body.password, 10),
      displayName: body.username,
    },
  });

  if (!user) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Something went horribly wrong",
      },
    });
  }

  return res.json({
    ok: true,
    user: user.username,
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
