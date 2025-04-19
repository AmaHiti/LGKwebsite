import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Reservation.css";

const Reservations = ({ url }) => {
  const [reservations, setReservations] = useState([]);

  // Fetch reservations from API
  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${url}/api/reservation/list`);
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Error fetching reservations. Please try again.");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const updateReservationStatus = async (reservationId, newStatus) => {
    try {
      const response = await axios.put(`${url}/api/reservation/status`, {
        reservationId,
        status: newStatus,
      });
      if (response.status === 200) {
        toast.success("Reservation status updated");
        fetchReservations();
      } else {
        toast.error("Failed to update reservation status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating reservation status");
    }
  };

  const handleStatusChange = async (e, reservationId) => {
    const newStatus = e.target.value;
    await updateReservationStatus(reservationId, newStatus);
  };

  return (
    <div className="reservation add flex-col">
      <p>All Reservations</p>
      <div className="reservation-table">
        <div className="reservation-table-format title">
          <b>Reservation ID</b>
          <b>User ID</b>
          <b>Date</b>
          <b>Time</b>
          <b>People</b>
          <b>Waiter ID</b>
          <b>Status</b>
        </div>
        {reservations.map((reservation, index) => (
          <div key={index} className="reservation-table-format">
            <p>{reservation.ReservationID}</p>
            <p>{reservation.CustomerID}</p>
            <p>{reservation.Date}</p>
            <p>{reservation.Time}</p>
            <p>{reservation.NumberOfPeople}</p>
            <p>{reservation.WaiterID ? reservation.WaiterID : "Auto-assigned"}</p>
            <select
              value={reservation.Status}
              onChange={(e) => handleStatusChange(e, reservation.ReservationID)}
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservations;
