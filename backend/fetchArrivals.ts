import { default as axios } from "axios";
import type { Arrival } from "../src/interfaces/Arrival";

export async function fetchArrivals(stopId: string) {
    const url = `https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals?app_key=${import.meta.env.VITE_TFL_API_KEY}`;
    try {
        const response = await axios.get(url);
        const arrivals: Arrival[] = response.data.map((arrivalObject: any) => ({
            id: arrivalObject.id,
            lineName: arrivalObject.lineName,
            towards: arrivalObject.towards,
            destinationName: arrivalObject.destinationName,
        }));
        return arrivals;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
