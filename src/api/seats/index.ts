import { Request, Response } from "express";
import { ResponseCode, writeError, writeJsonResponse } from "../../helpers/express-utils";
import { Logger } from "../../helpers/logger";
import { SeatCollection } from "../db-collections.types";
import { ISeat, Seat } from "./model";

export async function getSeat(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const seat: ISeat | null = await Seat.findById(id);

    if (!seat) {
      writeError(res, ResponseCode.exception48, "Sorry seat not found");
      return;
    }

    writeJsonResponse(res, {
      seat: {
        _id: seat._id,
        tripId: seat.tripId,
        seatnumber: seat.seatNumber,
        status: seat.status
      }
    })
  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}

export async function getSeatById(seatId: string): Promise<ISeat> {
  // console.log("getSeatById seatId ==> ", seatId);
  
  const seat: ISeat | null = await Seat.findById(seatId);

  if (!seat) throw new Error(`Unknown seat with id ${seatId}`);

  return seat;
}

export async function getAllSeatsByTripId(req: Request, res: Response): Promise<void> {
  try {
    const tripId = req.params.id;
    const seats = await Seat.find({
      "tripId": tripId
    });

    writeJsonResponse(res, seats);
  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}

export async function getAllSeatsAvailable(req: Request, res: Response): Promise<void> {
  try {
    const tripId = req.params.id;
    const allSeats = await Seat.find({
      "tripId": tripId,
      "status": "Available"
    });

    writeJsonResponse(res, allSeats);

  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}

export async function getAllSeats(req: Request, res: Response): Promise<void> {
  try {
    // const collection = db
    const seats = await Seat.find();

    writeJsonResponse(res, seats);

  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}

export async function createSeat(req: Request, res: Response): Promise<void> {
  try {
    const { tripId, seatNumber, status } = req.body;

    const newSeat = new Seat({
      tripId,
      seatNumber,
      status,
      createdAt: new Date().toLocaleDateString()
    });

    const saved = await newSeat.save();
    if (!saved) {
      writeError(res, ResponseCode.exception48, "Add seat failed");
      return;
    }

    const getSeat = await getSeatById(saved._id.toString()) as ISeat;

    writeJsonResponse(res, {
      data: {
        message: "Seat successfully created",
        seat: {
          tripId: getSeat.tripId,
          seatNumber: getSeat.seatNumber,
          status: getSeat.status,
          createdAt: getSeat.createdAt
        }
      }
    });
  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}

export async function updateSeat(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    const id = req.params.id;

    const updated = await Seat.findByIdAndUpdate(id, data, { new: true });
    writeJsonResponse(res, {
      message: "Seat successfully created",
      data: {
        seat: {
          _id: updated._id,
          tripId: updated.tripId,
          seatNumber: updated.seatNumber,
          status: updated.status,
          createdAt: updated.createdAt
        }
      }
    });
  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}

export async function updateISeat(payload: SeatCollection): Promise<ISeat> {
  try {
    const updated = await Seat.findByIdAndUpdate(payload._id, payload, { new: true });

    return updated;
  } catch (error) {
    Logger.error(error.toString());
  }
}

export async function deleteSeat(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const deleted = await Seat.findByIdAndDelete(id);

    writeJsonResponse(res, {
      message: "Seat successfully deleted"
    });
  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}
