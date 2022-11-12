import React, {useState} from 'react';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from 'react-bootstrap/Button';


type EnergyFormProps = {
    addYearAndConsumption: (year: number, consumption: number) => void;
}

function EnergyForm({addYearAndConsumption}: EnergyFormProps) {

    const [year, setYear] = useState('');
    const [consumption, setConsumption] = useState('');

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (year === '' && consumption === '') {
            return;
        }
        addYearAndConsumption(Number.parseInt(year), Number.parseFloat(consumption));

        setYear('');
        setConsumption('');
    }

    return (
        <Form onSubmit={e => handleSubmit(e)}>
            <Row>
                <Col sm={'3'}>
                    <FormControl
                        id={'year'}
                        about={'Jahr'}
                        type={'text'}
                        placeholder={'Jahr (yyyy)'}
                        value={year}
                        onChange={e => setYear(e.target.value)}
                        // isInvalid={true}
                    />
                </Col>
                <Col sm={'3'}>
                    <FormControl
                        id={'consumption'}
                        about={'Verbrauch'}
                        type={'text'}
                        value={consumption}
                        placeholder={'Verbrauch in kWh'}
                        onChange={e => setConsumption(e.target.value)}
                        // isValid={true}
                    />
                </Col>
                <Col sm={'3'}>
                    <Button variant="primary" type="submit">
                        Erfassen
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default EnergyForm;
