import { Request, Response } from "express";
import { ResponseCode, writeError, writeJsonResponse } from "../../helpers/express-utils";
import { Logger } from "../../helpers/logger";
import { Seat } from "../seats/model";
import { ITrip, Trip } from "./model";

export async function getTripById(tripId: string): Promise<ITrip> {
  const trip: ITrip | null = await Trip.findById(tripId);

  if (!trip) throw new Error(`Unknown trip with id ${tripId}`);

  return trip;
}

export async function getTrip(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    // console.log("id getTrip ====> ", id);

    const trip: ITrip | null = await Trip.findById(id);

    if (!trip) {
      writeError(res, ResponseCode.exception48, "Sorry trip not found");
      return;
    }

    writeJsonResponse(res, {
      trip: {
        _id: trip._id,
        label: trip.label,
        departureStation: trip.departureStation,
        arrivalStation: trip.arrivalStation,
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
        price: trip.price,
        createdAt: trip.createdAt
      }
    })

  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}

export async function createTrip(req: Request, res: Response): Promise<void> {
  try {
    const { label, departureStation, arrivalStation, departureTime, arrivalTime, price } = req.body;

    const newTrip = new Trip({
      label,
      departureStation,
      arrivalStation,
      departureTime,
      arrivalTime,
      price,
      createdAt: new Date().toLocaleDateString()
    })

    const saved = await newTrip.save();
    if (!saved) {
      writeError(res, ResponseCode.exception48, "Add trip failed");
      return;
    }

    const getTrip = await getTripById(saved._id.toString()) as ITrip;

    writeJsonResponse(res, {
      data: {
        message: "Trip successfully created",
        trip: {
          label: getTrip.label,
          departureStation: getTrip.departureStation,
          arrivalStation: getTrip.arrivalStation,
          departureTime: getTrip.departureTime,
          arrivalTime: getTrip.arrivalTime,
          price: getTrip.price,
          createdAt: getTrip.createdAt
        }
      }
    })

  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}

export async function getAllTrips(req: Request, res: Response): Promise<void> {
  try {
    const trips = await Trip.find();

    writeJsonResponse(res, trips);

  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}

/* export async function getAllSeatsByTripId(req: Request, res: Response): Promise<void> {
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
} */

export async function updateTrip(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    const id = req.params.id;

    const updated = await Trip.findByIdAndUpdate(id, data, { new: true });
    writeJsonResponse(res, {
      message: "Trip successfully updated",
      data: {
        trip: {
          _id: updated._id,
          label: updated.label,
          departureStation: updated.departureStation,
          arrivalStation: updated.arrivalStation,
          departureTime: updated.departureTime,
          arrivalTime: updated.arrivalTime,
          price: updated.price,
          createdAt: updated.createdAt
        }
      }
    });
  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}

export async function deleteTrip(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const deleted = await Trip.findByIdAndDelete(id);

    writeJsonResponse(res, {
      message: "Trip successfully deleted"
    });

  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48);
  }
}