import React from "react";
import "./data.css";
import { dataBookSelector } from "../../store/selectors";
import { useDispatch, useSelector } from "react-redux";
import { deleteData } from "../../store/interactions";

const Data = () => {
  const orderData = useSelector(dataBookSelector);
  const account = useSelector((state) => state.provider.account);
  const provider = useSelector((state) => state.provider.connection);
  const medical = useSelector((state) => state.medical.contract);
  const dispatch = useDispatch();

  const deleteHandler = (e, data) => {
    if (window.confirm("Do you want to delete the record?")) {
      deleteData(medical, data.recordId, dispatch, provider);
    } else {
      console.log("Data not deleted");
    }
  };

  return (
    <div>
      {account ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Date and Time</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Blood Type</th>
                <th>Allergies</th>
                <th>Diagnosis</th>
                <th>Treatment</th>
                <th>Medical Image</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {orderData &&
                orderData.map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.formattedTimestamp}</td>
                      <td>{data.name}</td>
                      <td>{data.ageNew}</td>
                      <td>{data.gender}</td>
                      <td>{data.bloodType}</td>
                      <td>{data.allergies}</td>
                      <td>{data.diagnosis}</td>
                      <td>{data.treatment}</td>

                      {/* ✅ Display Uploaded Medical Image (If Available) */}
                      <td>
                        {data.imageUrl ? (
                          <a href={data.imageUrl} target="_blank" rel="noopener noreferrer">
                            <img
                              src={data.imageUrl}
                              alt="Medical Record"
                              width="80"
                              height="80"
                              style={{ borderRadius: "5px" }}
                            />
                          </a>
                        ) : (
                          <span>No Image</span>
                        )}
                      </td>

                      <td>
                        <button className="delete-button" onClick={(e) => deleteHandler(e, data)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <h1>Connect the account</h1>
      )}
    </div>
  );
};

export default Data;
