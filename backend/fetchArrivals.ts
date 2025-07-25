import { default as axios } from "axios";
import type { Arrival } from "../src/interfaces/Arrival";
import type { StopPoint } from "../src/interfaces/StopPoint.ts";

export async function fetchArrivals(stopId: string) {
    const url = `https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals?app_key=${import.meta.env.VITE_TFL_API_KEY}`;
    try {
        const response = await axios.get(url);
        const arrivals: Arrival[] = response.data
            .map((arrivalObject: any) => ({
                id: arrivalObject.vehicleId,
                lineName: arrivalObject.lineName,
                stationName: arrivalObject.stationName,
                towards: arrivalObject.towards,
                destinationName: arrivalObject.destinationName,
                timeToStation: Math.round(arrivalObject.timeToStation / 60),
            }))
            .sort((a: Arrival, b: Arrival) => a.timeToStation - b.timeToStation);
        return arrivals;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export async function fetchBusStops(latitude: number, longitude: number) {
    const url = `https://api.tfl.gov.uk/StopPoint/?lat=${latitude}&lon=${longitude}&stopTypes=NaptanPublicBusCoachTram&app_key=${import.meta.env.VITE_TFL_API_KEY}`;
    try {
        const response = await axios.get(url);
        const busStops: StopPoint[] = response.data.stopPoints
            .filter((stopPoint: any) => stopPoint.modes.includes("bus"))
            .sort((a: any, b: any) => a.distance - b.distance)
            .map((stopPoint: any) => ({
                id: stopPoint.id,
                modes: stopPoint.modes,
                name: stopPoint.commonName,
                distance: stopPoint.distance,
                latitude: stopPoint.lat,
                longitude: stopPoint.lon,
            }));
        return busStops;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
