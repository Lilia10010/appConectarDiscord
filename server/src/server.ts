import express, { response } from "express";
import cors from "cors";

import { PrismaClient } from "@prisma/client";
import { ConvertHourStringToMinutes } from "./utils/convert-hour-string-to-minutes";
import { ConvertMinutesStringToHours } from "./utils/convert-minutes-to-hours-sting";

const app = express();

app.use(express.json());

//qlqr front consegue usar
app.use(cors());

/* app.use(cors({
  origin: 'http://meudominio.dev'
}))
 */
const prisma = new PrismaClient({
  log: ["query"],
});

app.get("/games", async (request, response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        },
      },
    },
  });
  return response.json(games);
});

app.post("/games/:gameId/ads", async (request, response) => {
  const gameId = request.params.gameId;
  const body = request.body;

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(","),
      hourStart: ConvertHourStringToMinutes(body.hourStart),
      hourEnd: ConvertHourStringToMinutes(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel,
    },
  });

  return response.status(201).json(ad);
});

//p1 buscar requisição p2 devolver uma responsta
app.get("/games/:id/ads", async (request, response) => {
  /* return response.send("aceessou eu "); */
  const gameIdd = request.params.id;
  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: {
      gameId: gameIdd,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  /*   return response.json([
    { id: 1, name: "json" },
    { id: 2, name: "json 1" },
    { id: 3, name: "json 2" },
    { id: 4, name: "json 3" },
  ]); */

  return response.json(
    ads.map((ad) => {
      return {
        ...ad,
        weekDays: ad.weekDays.split(","),
        hourStart: ConvertMinutesStringToHours(ad.hourStart),
        hourEnd: ConvertMinutesStringToHours(ad.hourEnd),
      };
    })
  );
});

app.get("/ads/:id/discord", async (request, response) => {
  const adId = request.params.id;
  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    },
  });
  return response.json({
    discord: ad.discord,
  });
});

app.listen(3333);
