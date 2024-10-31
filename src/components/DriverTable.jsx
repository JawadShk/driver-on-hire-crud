import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const DriverTable = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await axios.get('https://driversonhire.com/api/enquiry/drivers/');
                setDrivers(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDrivers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container>
            <h1 className="mt-4">Drivers List</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Driver ID</th>
                        <th>Name</th>
                        <th>Number</th>
                        <th>Photo</th>
                        <th>Car Type</th>
                    </tr>
                </thead>
                <tbody>
                    {drivers.map(driver => (
                        <tr key={driver.DriverID}>
                            <td>{driver.DriverID}</td>
                            <td>{driver.Name}</td>
                            <td>{driver.Number}</td>
                            <td>
                                <img
                                    src={driver.Photo}
                                    alt={driver.Name}
                                    style={{ width: '50px', height: '50px' }}
                                />
                            </td>
                            <td>{driver.cartype}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default DriverTable;
