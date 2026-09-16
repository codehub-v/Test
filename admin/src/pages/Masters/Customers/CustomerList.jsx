
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerList = () => {
  const [data, setData] = useState([]);
  const [params, setParams] = useState({});
  const navigate = useNavigate();

  const fetchCustomer = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://127.0.0.1:8000/master/customers/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
        {params},
      );

      console.log(response.data.results);
      setData(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);
  const handleEdit=(id)=>{
    navigate(`/customers/add/${id}`)
  }

  return (
    <div>
      CustomerList

      <button onClick={() => navigate("/customers/add/")}>
        + Add Customer
      </button>

      <table>
        <thead>
          <tr>
            <th>S No</th>
            <th>Customer Name</th>
            <th>Phone</th>
            <th>City</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((customer, index) => (
            <tr key={customer.uuid}>
              <td>{index + 1}</td>
              <td>{customer.identity}</td>
              <td>{customer.phone}</td>
              <td>{customer.city}</td>
              <td>
                {customer.is_active ? "Active" : "Inactive"}
              </td>

              <td>
                <div>
                  <button onClick={()=>handleEdit(customer.id)}>Edit</button>
                  <button>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;

