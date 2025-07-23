import { default as axios } from "axios";
import type { Postcode } from "../src/interfaces/Postcode";

export async function fetchPostcode(postcode: string) {
    const url = `https://api.postcodes.io/postcodes/${postcode}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 200) {
            const postcodeObject: Postcode = {
                postcode: postcode,
                longitude: response.data.result.longitude,
                latitude: response.data.result.latitude,
                region: response.data.result.region,
                country: response.data.result.country,
            };
            return postcodeObject;
        }
    } catch (error) {
        console.error(error);
    }
    return undefined;
}
