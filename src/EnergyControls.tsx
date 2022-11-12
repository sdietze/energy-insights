// @ts-ignore
import Form from "react-bootstrap/Form";
import React from "react";

type EnergyControlsProps = {
    bereinigt: boolean;
    setBereinigt: (bereinigt: boolean) => void;
    monthly: boolean;
    setMonthly: (monthly: boolean) => void;
}

export default function EnergyControls({bereinigt, setBereinigt, monthly, setMonthly}: EnergyControlsProps) {
    return (
        <Form>
            <Form.Check
                type="switch"
                id="wetter-bereinigt"
                label="Wetter-bereinigt"
                onChange={e => setBereinigt(e.target.checked)}
                defaultChecked={bereinigt}
            />
            <Form.Check
                type="switch"
                id="monatlich"
                label={monthly ? 'Monatlich' : 'Jährlich'}
                onChange={e => setMonthly(e.target.checked)}
                defaultChecked={monthly}
            />
        </Form>
    );
}
