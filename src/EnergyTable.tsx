import Table from "react-bootstrap/Table";
import React from "react";

const months: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

type TableRowProps = {
    month: string;
    currValue: number;
    prevValue: number;
};

function TableRow({month, prevValue, currValue}: TableRowProps) {
    return (
        <tr>
            <th align={'right'} scope="row">{month}</th>
            <td align={'right'}>{prevValue.toFixed(1)} kWh</td>
            <td align={'right'}>{currValue.toFixed(1)} kWh</td>
            <td align={'right'}>{(currValue - prevValue).toFixed(1)} kWh</td>
            <td align={'right'}>{((currValue - prevValue) / prevValue * 100).toFixed(1)} %</td>
            <td align={'right'}>{(currValue * 0.1007 * 1.60 - prevValue * 0.1007).toFixed(2)} €</td>
        </tr>
    );
}

type TableProps = {
    currValues: number[];
    prevValues: number[];
};

export default function EnergyTable({currValues, prevValues}: TableProps) {

    const rows = months.map(month =>
        <TableRow key={(month + 1).toFixed(0)} month={(month + 1).toFixed(0)} prevValue={prevValues[month]} currValue={currValues[month]}/>
    );

    rows.push(<TableRow key={'gesamt'} month={'gesamt'} prevValue={prevValues.reduce((pv, cv) => pv + cv, 0)}
                        currValue={currValues.reduce((pv, cv) => pv + cv, 0)}/>);
    return (
        <Table bordered>
            <thead>
            <tr>
                <th align={'center'}>
                    Monat
                </th>
                <th align={'center'}>
                    2021
                </th>
                <th align={'center'}>
                    2022
                </th>
                <th align={'center'} colSpan={3}>
                    Differenz
                </th>
            </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
        </Table>
    );
}
