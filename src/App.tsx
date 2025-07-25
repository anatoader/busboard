import * as React from "react";
import { useState } from "react";
import type { Arrival } from "./interfaces/Arrival";
import { fetchArrivals, fetchBusStops } from "../backend/fetchArrivals";
import { Alert, Box, Button, Container, Tab, Tabs, TextField, Typography } from "@mui/material";
import ArrivalsDataGrid from "./components/ArrivalsDataGrid";
import TabPanel from "./components/TabPanel";
import { fetchPostcode } from "../backend/fetchPostcode.ts";
import type { Postcode } from "./interfaces/Postcode.ts";

function App() {
    const [arrivals, setArrivals] = useState<Arrival[] | undefined>([]);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [stopIdLabel, setStopIdLabel] = useState<string>("");
    const [stopId, setStopId] = useState<string>("");
    const [arrivalsError, setArrivalsError] = useState<string | null>(null);
    const [postcodeLabel, setPostcodeLabel] = useState<string>("");
    const [postcode, setPostcode] = useState<Postcode | null>(null);
    const [postcodeError, setPostcodeError] = useState<string | null>(null);
    const [busStopsError, setBusStopsError] = useState<string | null>(null);
    const [postcodeArrivals, setPostcodeArrivals] = useState<Arrival[] | undefined>([]);

    async function handleSubmitStopId(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!stopIdLabel) {
            setArrivalsError(`Please provide a stop code.`);
            return;
        }

        const arrivals = await fetchArrivals(stopIdLabel);
        if (!arrivals) {
            setArrivalsError(`Stop with code "${stopIdLabel}" was not found.`);
            setStopIdLabel("");
            return;
        }

        setStopId(stopIdLabel);
        setStopIdLabel("");
        setArrivals(arrivals);
        setArrivalsError(null);
    }

    async function handleSubmitPostcode(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const postcodeId = postcodeLabel;
        setPostcodeLabel("");

        if (!postcodeId) {
            setPostcodeError(`Please provide a postcode.`);
            return;
        }

        const postcodeObject = await fetchPostcode(postcodeId);
        if (!postcodeObject) {
            setPostcodeError(`Invalid postcode "${postcodeId}".`);
            return;
        }

        const busStops = await fetchBusStops(postcodeObject.latitude, postcodeObject.longitude);
        if (!busStops) {
            setBusStopsError(
                `No bus stops found within a 200m radius of coordinates for postcode ${postcodeId}.`
            );
            return;
        }

        const busStopArrivals: Arrival[] | [] = (
            await Promise.all(
                Array.from(
                    busStops.slice(0, 2),
                    async (busStop) => (await fetchArrivals(busStop.id)) ?? []
                ).flat()
            )
        ).flat();

        setPostcode(postcodeObject);
        setPostcodeArrivals(busStopArrivals);
        setPostcodeError("");
        setBusStopsError("");
    }

    return (
        <Container>
            <Box component="section" py={4} sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                    variant="h1"
                    align="center"
                    gutterBottom
                    style={{ fontSize: "3.5rem", fontWeight: "bold", color: "#0092b8" }}
                >
                    BusBoard
                </Typography>
            </Box>
            <Box
                component="section"
                py={4}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "left",
                    alignItems: "left",
                }}
            >
                <Tabs value={selectedTab} onChange={(_event, value) => setSelectedTab(value)}>
                    <Tab label="Arrivals" id="tab-0" />
                    <Tab label="Bus Stops" id="tab-1" />
                </Tabs>
                <TabPanel value={selectedTab} index={0}>
                    <Typography
                        variant="h2"
                        py={2}
                        gutterBottom
                        style={{ fontSize: "2rem", fontWeight: "bold", color: "#0092b8" }}
                    >
                        Fetch arrivals
                    </Typography>
                    <Typography variant={"body1"} gutterBottom>
                        Enter the stop code of a bus station and see what buses are scheduled to
                        arrive there.
                    </Typography>

                    <Box
                        component="form"
                        py={2}
                        onSubmit={handleSubmitStopId}
                        sx={{ display: "flex", flexDirection: "row", gap: "10px" }}
                    >
                        <TextField
                            label="Stop Code"
                            name="stopId"
                            value={stopIdLabel}
                            onChange={(e) => setStopIdLabel(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                width: "150px",
                            }}
                        >
                            Show arrivals
                        </Button>
                        {arrivalsError && <Alert severity="error">{arrivalsError}</Alert>}
                    </Box>
                    {arrivals && arrivals.length > 0 && (
                        <Box py={2}>
                            <Typography
                                variant="h3"
                                style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0092b8" }}
                            >{`Stop Code: ${stopId}`}</Typography>
                            <ArrivalsDataGrid arrivals={arrivals} />
                        </Box>
                    )}
                </TabPanel>
                <TabPanel value={selectedTab} index={1}>
                    <Typography
                        variant="h2"
                        py={2}
                        gutterBottom
                        style={{ fontSize: "2rem", fontWeight: "bold", color: "#0092b8" }}
                    >
                        Fetch buses from nearest bus stops
                    </Typography>
                    <Typography variant={"body1"} gutterBottom>
                        Enter a postcode and see the next buses that are scheduled to arrive at the
                        two nearest bus stops.
                    </Typography>
                    <Box
                        component="form"
                        py={2}
                        onSubmit={handleSubmitPostcode}
                        sx={{ display: "flex", flexDirection: "row", gap: "10px" }}
                    >
                        <TextField
                            label="Postcode"
                            name="postcode"
                            value={postcodeLabel}
                            onChange={(e) => setPostcodeLabel(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                width: "150px",
                            }}
                        >
                            Show buses
                        </Button>
                        {postcodeError && <Alert severity="error">{postcodeError}</Alert>}
                    </Box>
                    {busStopsError && <Alert severity="error">{busStopsError}</Alert>}
                    {postcode && postcodeArrivals && postcodeArrivals.length > 0 && (
                        <Box py={2}>
                            <Typography
                                variant="h3"
                                sx={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0092b8" }}
                            >{`Postcode: ${postcode.postcode}`}</Typography>
                            <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                                {`Location: ${postcode.region}, ${postcode.country}`}
                            </Typography>
                            <ArrivalsDataGrid arrivals={postcodeArrivals} />
                        </Box>
                    )}
                </TabPanel>
            </Box>
        </Container>
    );
}

export default App;
