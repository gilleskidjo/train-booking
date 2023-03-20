// import { ResponseCode, writeError } from "./express-utils";
// import { Logger } from "./logger";

// export async function init(): Promise<void> {
//   try {
//     const initTrips = [
//       {
//         label: "New York-Washington",
//         departureStation: "New York Penn Station, États-Unis",
//         arrivalStation: "Washington Union Station, États-Unis",
//         departureTime: "10h45",
//         arrivalTime: "14h15",
//         price: 10
//       },
//       {
//         label: "Paris-Londres",
//         departureStation: " Paris Gare du Nord, France",
//         arrivalStation: "Londres St Pancras, Royaume-Uni",
//         departureTime: "8h00",
//         arrivalTime: "11h30",
//         price: 12
//       },
//       {
//         label: "Tokyo-Kyoto",
//         departureStation: "Tokyo Station, Japon",
//         arrivalStation: "Kyoto Station, Japon",
//         departureTime: "9h30",
//         arrivalTime: "12h45",
//         price: 10
//       },
//       {
//         label: "Moscou-Saint-Pétersbourg",
//         departureStation: "Moscou Kazanskiy Station, Russie",
//         arrivalStation: "Saint-Pétersbourg Moskovsky Station, Russie",
//         departureTime: "15h00",
//         arrivalTime: "23h00",
//         price: 15
//       },
//       {
//         label: "Sydney-Melbourne",
//         departureStation: "Sydney Central Station, Australie",
//         arrivalStation: "Melbourne Southern Cross Station, Australie",
//         departureTime: "7h30",
//         arrivalTime: "12h00",
//         price: 13
//       },
//     ]


//   } catch (error) {
//     Logger.error(`Init error ==> error.toString()`);
//     // writeError(res, ResponseCode.exception48);
//   }
// }