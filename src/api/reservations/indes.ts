import { Request, Response } from "express";
import { ResponseCode, writeError, writeJsonResponse } from "../../helpers/express-utils";
import { Logger } from "../../helpers/logger";
import { getSeatById, updateISeat } from "../seats";
import { ISeat } from "../seats/model";
import { getTrip, getTripById } from "../trips";
import { ITrip } from "../trips/model";
import { getUserById } from "../users";
import { IUser } from "../users/model";
import { IReservation, Reservation } from "./model";
import { sendMail } from "../../helpers/send-mail"
import { checkSession } from "../../helpers/auth";


export async function getReservation(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const reservation: IReservation | null = await Reservation.findById(id);

    if (!reservation) {
      writeError(res, ResponseCode.exception48, "Sorry reservation not found");
      return;
    }

    writeJsonResponse(res, {
      reservation: {
        _id: reservation._id,
        tripId: reservation.tripId,
        userId: reservation.userId,
        seatId: reservation.seatId,
        status: reservation.status
      }
    })
  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}

async function getReservationById(reservId: string): Promise<IReservation> {
  const reserv: IReservation | null = await Reservation.findById(reservId);

  if (!reserv) throw new Error(`Unknown reservation with id ${reservId}`);

  return reserv;
}

export async function getReservationsByUserId(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.params.id;

    const reservations = await Reservation.find({
      "userId": userId
    });

    writeJsonResponse(res, reservations);

  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}

export async function getAllReservations(req: Request, res: Response): Promise<void> {
  try {
    const reservs = await Reservation.find();
    writeJsonResponse(res, reservs);
  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}

export async function createReservation(req: Request, res: Response): Promise<void> {
  try {
    const { tripId, userId, seatId } = req.body;
    // console.log("createReservation req.body ==> ", req.body);
    
    const newReserv = new Reservation({
      tripId,
      userId,
      seatId,
      createdAt: new Date().toLocaleDateString()
    });

    const getSeat = await getSeatById(seatId) as ISeat;
    if (!getSeat) {
      writeError(res, ResponseCode.exception48, "Seat not found");
      return;
    }

    const getrip = await getTripById(tripId) as ITrip;
    if (!getrip) {
      writeError(res, ResponseCode.exception48, "Trip not found");
      return;
    }

    const getUser = await getUserById(userId) as IUser;
    if (!getUser) {
      writeError(res, ResponseCode.exception48, "User not found");
      return;
    }
    checkSession(req);


    const saved = await newReserv.save();
    if (!saved) {
      writeError(res, ResponseCode.exception48, "Add reservation failed");
      return;
    }

    const getReservation = await getReservationById(saved._id.toString()) as IReservation;
    const updatedSeat = await updateISeat({
      _id: getSeat._id,
      tripId: getSeat.tripId,
      seatNumber: getSeat.seatNumber,
      status: "Reserved",
      createdAt: getSeat.createdAt
    });

    const message = `
      Votre billet a été bien enregistrer.
      Trajet: ${getrip.label}
    `;

    sendMail(getUser.email, message, "Réservation de billet");

    writeJsonResponse(res, {
      message: "Mail envoyé"
    })

  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}

export async function updateReservation(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;

    const reservation = await getReservationById(id);

    const updated = await Reservation.findByIdAndUpdate(id, reservation, { new: true });
    writeJsonResponse(res, {
      message: "Reservation updated"
    });
  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}

export async function cancelReservation(req: Request, res: Response): Promise<void> {
  try {
    // const { tripId, userId } = req.body;
    const id = req.params.id;

    const reservation = await getReservationById(id);

    const user = await checkSession(req);
    console.log("reservation ==> ", reservation);
    // console.log("user ==> ", user);
    

    if (user._id.toString() !== reservation.userId.toString()) {
      writeError(res, ResponseCode.insufficientRights19);
      return;
    }


    const trip = await getTripById(reservation.tripId);
    if (!trip) {
      writeError(res, ResponseCode.exception48, "Trip not found");
      return;
    }
    const message = `
    Votre billet a été annuler.
    Trajet: ${trip.label}
    `;

    const updated = await Reservation.findByIdAndUpdate(id, { "status": "Cancel" }, { new: true });

    if (updated.status !== "Cancel") {
      writeError(res, ResponseCode.exception48, "Cancelled reservation failed");
      return;
    }

    const seat = await getSeatById(reservation.seatId);
    if (!seat) {
      writeError(res, ResponseCode.exception48, "Seat not found");
      return;
    }

    const updatedSeat = await updateISeat({
      _id: seat._id,
      tripId: seat.tripId,
      seatNumber: seat.seatNumber,
      status: "Available",
      createdAt: seat.createdAt
    });

    sendMail(user.email, message, "Annulation de billet");

    writeJsonResponse(res, {
      message: "Billet cancel "
    });
  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}

export async function deleteReservation(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const deleted = await Reservation.findByIdAndDelete(id);

    writeJsonResponse(res, {
      message: "Reservation successfully deleted"
    });
  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}