import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import EnergyChart from './EnergyChart';
import EnergyControls from "./EnergyControls";
import EnergyTable from "./EnergyTable";
import EnergyForm from "./EnergyForm";

const years = [2021, 2022]
const months: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

export type ConsumptionsForYear = {
    year: number;
    data: number[];
}

export type FactorsForYear = {
    year: number;
    data: number[];
}

async function getDistributed(year: number, kWh: number): Promise<FactorsForYear> {
    const url = `http://localhost:8080/distribute?kWh=${kWh.toFixed(0)}&a=${year.toFixed(0)}`;
    return fetch(url, {method: "get"})
        .then(response => response.json())
        .then(data => {
                return {year, data};
            }
        );
}

async function getFactors(year: number): Promise<FactorsForYear> {
    const url = `http://localhost:8080/factors/${year.toFixed(0)}`;
    return fetch(url, {method: "get"})
        .then(response => response.json())
        .then(data => {
                return {year, data};
            }
        );
}

function getDaysInMonth(month: number, year: number) {
    return month === 2 ? year & 3 || !(year % 25) && year & 15 ? 28 : 29 : 30 + (month + (month >> 3) & 1);
}

const dates: Date[] = years.flatMap(year =>
    months.map(month =>
        new Date(year, month, getDaysInMonth(month + 1, year))
    )
);

const consumptions: { date: Date; reading: number }[] = dates.map(date => {
    const reading = date.getFullYear() === 2021 ? 100 : 50;
    return {date, reading}
});

const langfristigesMonatsMittel = [2.1, 2.4, 4.9, 9.1, 13.0, 16.0, 18.3, 18.0, 14.4, 10.0, 5.7, 2.9];
const monatsMittel2020 = [1.7, 2.0, 5.3, 6.1, 10.7, 18.9, 19.3, 16.5, 15.4, 11.1, 6.9, 2.8];
const monatsMittel2021 = [1.7, 2.0, 5.3, 6.1, 10.7, 18.9, 19.3, 16.5, 15.4, 11.1, 6.9, 2.8];
const monatsMittel2022 = [4.9, 5.5, 5.3, 7.9, 13.4, 17.1, 18.1, 20.2, 13.7, 12.6, 5.7, 2.9];

const verbrauch2021OG2 = [939.7, 849.9, 642.4, 567.1, 221.1, 14.1, 3.5, 128.3, 178.6, 425.0, 537.8, 885.9];
const verbrauch2021OG1 = [1147.8, 1024.0, 1050.0, 934.0, 750.0, 34.0, 0.0, 148.0, 249.0, 668.0, 745.0, 913.4];

const verbrauch2022OG2 = [716.9, 463.4, 152.0, 120.0, 13.0, 9.0, 0.0, 0.0, 37.0, 94.0, 0.0, 0.0];//, 120.0, 463.4 * 24 / 31];
const verbrauch2022OG1 = [799.4, 601.5, 397.5, 399.2, 102.0, 0.0, 0.0, 0.0, 59.0, 157.0, 0.0, 0.0];//, 399.2, 601.5 * 28 / 31];

const verbrauch2021 = months.map(month => verbrauch2021OG1[month] + verbrauch2021OG2[month]);
const verbrauch2022 = months.map(month => verbrauch2022OG1[month] + verbrauch2022OG2[month]);


function bereinigterVerbrauch(verbrauch: number, year: number, month: number) {
    const ta = year === 2021 ? monatsMittel2021[month] : monatsMittel2022[month];
    const tm = langfristigesMonatsMittel[month];
    return verbrauch * (ta > 15 ? 1 : (20 - tm) / (20 - ta));
}

type Location = {
    lat: number;
    lon: number;
}

type EnergyEntriesProps = {
    userEntries: UserEntry[];
}

function EnergyEntries({userEntries}: EnergyEntriesProps) {
    const listItems = userEntries.map(userEntry => <li>{userEntry.year.toFixed(0)} {userEntry.consumption.toFixed(1)}</li>)
    return <ul>{listItems}</ul>;
}

type WeatherStation = {
    id: string;
    name: string;
}


type ChooseWeatherStationProps = {
    setStation: (station: WeatherStation) => void
}

function ChooseWeatherStation({setStation}: ChooseWeatherStationProps) {
    const [location, setLocation] = useState<Location | undefined>(undefined);
    const [stations, setStations] = useState([] as WeatherStation[]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const _loc = {
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };
            setLocation(
                _loc
            );
            fetch(`http://localhost:8080/stations?lat=${_loc.lat.toFixed(5)}&lon=${_loc.lon.toFixed(5)}`)
                .then(response => response.json())
                .then(
                    (data) => {
                        setStations(data);
                    },
                    (error) => {
                        alert(`Failed: ${error}`);
                    }
                );
        });
    }, []);

    const stationList = stations.map(station =>
        <li key={station.id} onClick={() => setStation(station)}>
            {station.name}
        </li>
    );

    return (
        <>
            Location: <br/>
            lat: {location && location.lat.toFixed(5)}<br/>
            lng: {location && location.lon.toFixed(5)}<br/>
            stations: <ol>{stationList}</ol>
        </>
    );
}

type WeatherStationComponentProps = {
    station: WeatherStation | undefined;
    setStation: (station: WeatherStation) => void
}

function WeatherStationComponent({station, setStation}: WeatherStationComponentProps) {

    return (
        <>
            {
                station ? (
                    station.name
                ) : (
                    <ChooseWeatherStation setStation={setStation}/>
                )
            }
        </>
    );
}

type UserEntry = {
    year: number;
    consumption: number;
}

function App() {
    const [error, setError] = useState(null);
    const [consumptions, setConsumptions] = useState([] as ConsumptionsForYear[]);
    const [factors, setFactors] = useState([] as FactorsForYear[]);
    const [bereinigt, setBereinigt] = useState(false);
    const [monthly, setMonthly] = useState(false);

    const [station, setStation] = useState<WeatherStation | undefined>(undefined);

    const [userEntries, setUserEntries] = useState([] as UserEntry[])

    const verbrauch2022bereinigt: number[] = bereinigt ? verbrauch2022.map((verbrauch, month) => bereinigterVerbrauch(verbrauch, 2022, month)) : verbrauch2022;
    const verbrauch2021bereinigt: number[] = bereinigt ? verbrauch2021.map((verbrauch, month) => bereinigterVerbrauch(verbrauch, 2021, month)) : verbrauch2021;

    useEffect(() => {

        // 2013, 11361.6
        // 2014, 10098.8
        // 2015, 13404.5
        // 2016, 14488.9
        // 2017, 13591.7
        // 2018, 12203.6
        // 2019, 11286.3
        // 2020, 11186.2
        // 2021, 13056.6
        // 2022,  4120.9

        const consumptions2021: ConsumptionsForYear = {year: 2021, data: verbrauch2021};
        const consumptions2022: ConsumptionsForYear = {year: 2022, data: verbrauch2022};

        const factors2021 = () => getFactors(2021);
        const factors2022 = () => getFactors(2022);

        Promise
            .all([
                factors2021(),
                factors2022()
            ])
            .then((factorsForYears) => {
                    setFactors(factorsForYears);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setError(error);
                }
            );

        Promise
            .all([])
            .then((consumptionsForYears) => {
                    setConsumptions([...consumptionsForYears, consumptions2021, consumptions2022]);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setError(error);
                }
            );
    }, []);


    function normalize(consumptions: ConsumptionsForYear[]): ConsumptionsForYear[] {
        return consumptions.map(consumptionForYear => {
                const year = consumptionForYear.year;
                const factorsForYear: number[] | undefined =
                    factors.find(factor => factor.year === year)?.data;
                const data = consumptionForYear.data.map((value, index) => value * (factorsForYear?.[index] ?? 1.0));
                return {year, data};
            }
        );
    }


    function addYearAndConsumption1(year: number, consumption: number) {
        setUserEntries([...userEntries, {year, consumption}])
        alert(`You submitted: year='${year}', consumption='${consumption}'`);
        getFactors(year)
            .then((factorsForYears) => {
                    setFactors([...factors, factorsForYears].sort((l, r) => l.year - r.year));
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setError(error);
                }
            );

        getDistributed(year, consumption)
            .then((consumptionsForYears) => {
                    setConsumptions([...consumptions, consumptionsForYears].sort((l, r) => l.year - r.year));
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setError(error);
                }
            );

    }

    return (
        <Container className="p-3">
            <Alert key='s' variant={'info'}>
                hhhh
            </Alert>
            <WeatherStationComponent station={station} setStation={setStation}/>
            <EnergyEntries userEntries={userEntries}/>
            <EnergyForm
                addYearAndConsumption={addYearAndConsumption1}
            />
            <EnergyControls
                bereinigt={bereinigt}
                setBereinigt={setBereinigt}
                monthly={monthly}
                setMonthly={setMonthly}
            />
            <EnergyChart consumptions={bereinigt ? normalize(consumptions) : consumptions} monthly={monthly}/>
            <EnergyTable currValues={verbrauch2022bereinigt} prevValues={verbrauch2021bereinigt}/>
        </Container>
    );
}

export default App;
