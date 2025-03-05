import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { myEventsSelector } from "../../store/selectors";
// import * as medicalActions from '../../store/interactions';
import config from "../../config.json";
import "./alert.css";

const Alert = () => {
  const dispatch = useDispatch();
  const alertRef = useRef(null);
  const overlayRef = useRef(null);
  const event = useSelector(myEventsSelector);
  const isPending = useSelector((state) => state.medical.transaction.isPending);
  const isError = useSelector((state) => state.medical.transaction.isError);
  const chainId = useSelector((state) => state.provider.chainId);

  // Remove alert box when clicked
  const removeHandler = () => {
    if (alertRef.current) alertRef.current.className = "alertBox--remove";
    if (overlayRef.current) overlayRef.current.className = "overlay--remove";
  };

  // Update UI when transactions complete
  useEffect(() => {
    if (isPending) {
      alertRef.current.className = "alertBox";
      overlayRef.current.className = "overlay";
    } else if (event.length > 0) {
      dispatch(fetchMedicalRecords()); // Refresh records after a transaction
    }
  }, [isPending, event, dispatch]);

  return (
    <div>
      {isPending ? (
        <div className="alert" onClick={removeHandler}>
          <div className="overlay" ref={overlayRef}></div>
          <div className="alertBox" ref={alertRef}>
            <h2>Action Pending...</h2>
          </div>
        </div>
      ) : isError ? (
        <div className="alert" onClick={removeHandler}>
          <div className="overlay" ref={overlayRef}></div>
          <div className="alertBox" ref={alertRef}>
            <h2>Transaction Failed</h2>
          </div>
        </div>
      ) : event.length > 0 ? (
        <div className="alert" onClick={removeHandler}>
          <div className="overlay" ref={overlayRef}></div>
          <div className="alertBox" ref={alertRef}>
            <h2>Transaction Successful</h2>
            <div className="transactionHashOut">
              <a
                className="transactionHash"
                href={
                  config[chainId]
                    ? `${config[chainId].explorerURL}tx/${event[0].transactionHash}`
                    : `#`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {event[0].transactionHash.slice(0, 6) +
                  "..." +
                  event[0].transactionHash.slice(60, 66)}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Alert;
