import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import passport from "passport";
import { apiConfig, setupApiConfig } from "./config";
import { setupDbConnection } from "./db";
import { Logger } from "./helpers/logger";
// import { LocalStrategy } from "passport-local";
import bodyParser from 'body-parser';
import session from "express-session";
import { createTrip, deleteTrip, getAllTrips, getTrip, updateTrip } from "./api/trips";
import { createUser, login } from "./api/users";
import { createSeat, deleteSeat, getAllSeats, getAllSeatsAvailable, getAllSeatsByTripId, getSeat, updateSeat } from "./api/seats";
import { cancelReservation, createReservation, deleteReservation, getAllReservations, getReservation, getReservationsByUserId, updateReservation } from "./api/reservations/indes";


async function setupApi() {
  const app = express();

  dotenv.config();

  setupApiConfig(process.env);
  setupDbConnection(apiConfig);

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // app.use(bodyParser.json());

  app.use(session({
    secret: apiConfig.sessionSecret,
    resave: false,
    saveUninitialized: true
  }))
  app.use(passport.initialize());
  // app.use(passport.session());

  
  // USERS
  app.post("/api/user", createUser);
  app.post("/api/auth/login", passport.authenticate("local"), login);

  //TRIPS
  app.get("/api/trips", getAllTrips);
  app.get("/api/trips/:id", getTrip)
  app.post("/api/trips", createTrip);
  app.put("/api/trips/:id", updateTrip);
  app.delete("/api/trips/:id", deleteTrip);
  app.get("/api/trip/:id/seats", getAllSeatsByTripId);


  //SEATS
  app.get("/api/seats", getAllSeats);
  app.get("/api/seats/:id", getSeat);
  app.post("/api/seats", createSeat);
  app.get("/api/seats/available/:id", getAllSeatsAvailable);
  app.put("/api/seats/:id", updateSeat);
  app.delete("/api/seats/:id", deleteSeat);

  //RESERVATIONS
  app.get("/api/reservations", getAllReservations);
  app.get("/api/reservations/:id", getReservation);
  app.post("/api/reservations/user/:id", getReservationsByUserId);
  app.post("/api/reservations", createReservation);
  app.put("/api/reservations/:id", updateReservation);
  app.put("/api/reservations/cancel/:id", cancelReservation);
  app.delete("/api/reservations/:id", deleteReservation);

  const httpServer = http.createServer(app);

  if (apiConfig.environment === "prod") {
    httpServer.listen(apiConfig.port, apiConfig.host, () => {
      Logger.info(
        `[INFO] api started in ${apiConfig.environment} mode. \nUrl: http://${apiConfig.host}:${apiConfig.port}`
      )
    })
  } else {
    httpServer.listen(apiConfig.port, () => {
      Logger.info(`[INFO dev-env] train booking api started ${apiConfig.port}`)
    })
  }
}

setupApi().catch((error) => Logger.error(error))