import * as React from "react";
import { useState } from "react";
import type { Arrival } from "./interfaces/Arrival";
import { fetchArrivals } from "../backend/fetchArrivals";
import { Alert, Box, Button, Container, Tab, Tabs, TextField, Typography } from "@mui/material";
import ArrivalsDataGrid from "./components/ArrivalsDataGrid";
import TabPanel from "./components/TabPanel";

function App() {
    const [arrivals, setArrivals] = useState<Arrival[] | undefined>([]);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [stopIdLabel, setStopIdLabel] = useState<string>("");
    const [stopId, setStopId] = useState<string>("");
    const [arrivalsError, setArrivalsError] = useState<string | null>(null);

    async function handleSubmitStopId(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!stopIdLabel) {
            setArrivalsError(`Please provide a Stop ID.`);
            return;
        }

        const arrivals = await fetchArrivals(stopIdLabel);
        if (!arrivals) {
            setArrivalsError(`Stop with ID "${stopIdLabel}" was not found.`);
            setStopIdLabel("");
            return;
        }

        setStopId(stopIdLabel);
        setStopIdLabel("");
        setArrivals(arrivals);
        setArrivalsError(null);
    }

    return (
        <Container>
            <Box component="section" py={4} sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                    variant="h1"
                    align="center"
                    gutterBottom
                    style={{ fontSize: "4rem", fontWeight: "bold", color: "#0092b8" }}
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
                    <Tab label="Bus Times" id="tab-1" />
                    <Tab label="Bus Stops" id="tab-2" />
                </Tabs>
                <TabPanel value={selectedTab} index={0}>
                    <Typography
                        variant="h2"
                        gutterBottom
                        style={{ fontSize: "2rem", fontWeight: "bold", color: "#0092b8" }}
                    >
                        Fetch Arrivals
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmitStopId}
                        sx={{ display: "flex", flexDirection: "row", gap: "10px" }}
                    >
                        <TextField
                            label="Stop ID"
                            name="stopId"
                            value={stopIdLabel}
                            onChange={(e) => setStopIdLabel(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                width: "200px",
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
                            >{`Stop ID: ${stopId}`}</Typography>
                            <ArrivalsDataGrid arrivals={arrivals} />
                        </Box>
                    )}
                </TabPanel>
            </Box>
        </Container>
    );
}

export default App;
