
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CustomerForm = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [formData, setFormData] = useState({
    identity: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
    is_active: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (params.id) {
        // Edit
        await axios.put(
          `http://127.0.0.1:8000/master/customers/${params.id}/`,
          formData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      } else {
        // Add
        await axios.post(
          "http://127.0.0.1:8000/master/customers/",
          formData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      }

      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCustomer = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://127.0.0.1:8000/master/customers/${params.id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setFormData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchCustomer();
    }
  }, [params.id]);

  const handleOnchange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h2>{params.id ? "Edit Customer" : "Add Customer"}</h2>

      <button type="button" onClick={() => navigate(-1)}>
        Back
      </button>

      <form onSubmit={handleSubmit}>
        <label>Customer</label>
        <input
          type="text"
          name="identity"
          value={formData.identity}
          onChange={handleOnchange}
        />

        <br />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleOnchange}
        />

        <br />

        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleOnchange}
        />

        <br />

        <label>Street</label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleOnchange}
        />

        <br />

        <label>City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleOnchange}
        />

        <br />

        <label>Pincode</label>
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleOnchange}
        />

        <br />

        <label>Active</label>
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={(e) =>
            setFormData({
              ...formData,
              is_active: e.target.checked,
            })
          }
        />

        <br />

        <button type="submit">
          {params.id ? "Update" : "Save"}
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
