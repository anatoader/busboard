import { default as axios } from "axios";
import type { Arrival } from "../src/interfaces/Arrival";

export async function fetchArrivals(stopId: string) {
    const url = `https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals?app_key=${import.meta.env.VITE_TFL_API_KEY}`;
    try {
        const response = await axios.get(url);
        const arrivals: Arrival[] = response.data
            .map((arrivalObject: any) => ({
                id: arrivalObject.vehicleId,
                lineName: arrivalObject.lineName,
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
