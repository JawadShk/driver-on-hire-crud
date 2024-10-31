import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Container,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo.svg";
import "../App.css";

const DriverTable = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    address: "",
    car_type: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const carTypesOptions = ["MANUAL", "AUTOMATIC", "SEMI-AUTOMATIC"];

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(
          "https://driversonhire.com/api/enquiry/drivers/"
        );
        setDrivers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormData({
      first_name: "",
      last_name: "",
      mobile: "",
      address: "",
      car_type: [],
    });
    setImageFile(null);
    setShowModal(true);
    setFormErrors({});
  };

  const handleOpenEditModal = (driver) => {
    setIsEditing(true);
    setFormData({
      id: driver.id,
      first_name: driver.first_name,
      last_name: driver.last_name,
      mobile: driver.mobile,
      address: driver.address,
      car_type: driver.car_type,
    });
    setShowModal(true);
    setFormErrors({});
  };

  const handleClose = () => {
    setShowModal(false);
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this driver?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://driversonhire.com/api/enquiry/drivers/${id}`
        );
        setDrivers(drivers.filter((driver) => driver.id !== id));
      } catch (err) {
        alert("Failed to delete driver");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCarTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      car_type: checked
        ? [...prev.car_type, value]
        : prev.car_type.filter((type) => type !== value),
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const validateForm = () => {
    const errors = {};
    if (formData.first_name.length < 3 || formData.first_name.length > 10) {
      errors.first_name = "First name must be between 3 and 10 characters.";
    }
    if (formData.last_name.length < 3 || formData.last_name.length > 10) {
      errors.last_name = "Last name must be between 3 and 10 characters.";
    }
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      errors.mobile = "Mobile number must be exactly 10 digits.";
    }
    if (formData.car_type.length === 0) {
      errors.car_type = "At least one car type must be selected.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; 
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return; 

    const submitData = new FormData();
    submitData.append("first_name", formData.first_name);
    submitData.append("last_name", formData.last_name);
    submitData.append("mobile", formData.mobile);
    submitData.append("address", formData.address);
    formData.car_type.forEach((type) => submitData.append("car_type", type));
    if (imageFile) submitData.append("image_upload", imageFile);

    try {
      if (isEditing) {
        await axios.patch(
          `https://driversonhire.com/api/enquiry/drivers/${formData.id}/`,
          submitData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setDrivers(
          drivers.map((driver) =>
            driver.id === formData.id ? { ...driver, ...formData } : driver
          )
        );
      } else {
        const response = await axios.post(
          "https://driversonhire.com/api/enquiry/drivers/",
          submitData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setDrivers([...drivers, response.data]);
      }
      handleClose();
    } catch (err) {
      console.error("Submit Error:", err.response);
      alert(
        "Failed to submit driver details: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <section className="driver_table">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} className="text-center my-4">
            <img src={logo} alt="logo" className="img-fluid" />
          </Col>

          <Col md={10}>
            <Row className="align-items-center">
              <Col xs={6}>
                <h1>Drivers List</h1>
              </Col>
              <Col xs={6} className="text-end">
                <Button
                  variant="success"
                  onClick={handleOpenAddModal}
                  className="btn-warning mb-3"
                >
                  Add New Driver
                </Button>
              </Col>

              <Col xs={12} className="mt-4">
                <Table responsive="md">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Photo</th>
                      <th>Car Type</th>
                      <th>Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((driver) => (
                      <tr key={driver.id}>
                        <td>{driver.id}</td>
                        <td>{`${driver.first_name} ${driver.last_name}`}</td>
                        <td>{driver.mobile}</td>
                        <td>
                          <img
                            src={`https://driversonhire.com${driver.image_upload}`}
                            alt={`${driver.first_name} ${driver.last_name}`}
                            style={{ width: "50px", height: "50px" }}
                          />
                        </td>
                        <td>{driver.car_type.join(", ")}</td>
                        <td>{driver.address}</td>
                        <td>
                          <Button
                            className="btn-dark"
                            onClick={() => handleOpenEditModal(driver)}
                          >
                            View
                          </Button>{" "}
                          <Button
                            className="btn-outline-dark"
                            onClick={() => handleDelete(driver.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Modal show={showModal} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>
                      {isEditing ? "Edit Driver Details" : "Add New Driver"}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                      {isEditing && (
                        <Form.Group className="form_group" controlId="forDriverId">
                          <Form.Label>Driver Id</Form.Label>
                          <Form.Control
                            type="text"
                            name="driverID"
                            value={formData.id}
                            readOnly
                          />
                        </Form.Group>
                      )}
                      <Form.Group className="form_group" controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          required
                        />
                        {formErrors.first_name && (
                          <Form.Text className="text-danger">{formErrors.first_name}</Form.Text>
                        )}
                      </Form.Group>

                      <Form.Group className="form_group" controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          required
                        />
                        {formErrors.last_name && (
                          <Form.Text className="text-danger">{formErrors.last_name}</Form.Text>
                        )}
                      </Form.Group>

                      <Form.Group className="form_group" controlId="formMobile">
                        <Form.Label>Mobile</Form.Label>
                        <Form.Control
                          type="text"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          required
                        />
                        {formErrors.mobile && (
                          <Form.Text className="text-danger">{formErrors.mobile}</Form.Text>
                        )}
                      </Form.Group>

                      <Form.Group className="form_group" controlId="formAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="form_group" controlId="formCarType">
                        <Form.Label>Car Type</Form.Label>
                        {carTypesOptions.map((type) => (
                          <Form.Check
                            key={type}
                            type="checkbox"
                            label={type}
                            value={type}
                            checked={formData.car_type.includes(type)}
                            onChange={handleCarTypeChange}
                          />
                        ))}
                        {formErrors.car_type && (
                          <Form.Text className="text-danger">{formErrors.car_type}</Form.Text>
                        )}
                      </Form.Group>

                      <Form.Group className="form_group" controlId="formImageUpload">
                        <Form.Label>Image Upload</Form.Label>
                        <Form.Control type="file" onChange={handleImageChange} />
                      </Form.Group>

                      <Button className="btn-warning" type="submit">
                        {isEditing ? "Update Driver" : "Add Driver"}
                      </Button>
                    </Form>
                  </Modal.Body>
                </Modal>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default DriverTable;