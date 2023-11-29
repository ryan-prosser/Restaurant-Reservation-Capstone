import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ListReservations from "../reservations/ListReservations";
import ListTables from "../tables/ListTables";
import DateButtons from "./DateButtons";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([])
  const [tablesError, setTablesError] = useState(null)

  useEffect(loadBoth, [date]);

  function loadReservations() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
  
  //used to check if reservations are coming through after loading
  console.log(reservations)

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  //used to check if tables are coming through after loading
  console.log(tables)

  function loadBoth() {
    const abortController = new AbortController()
    loadReservations()
    loadTables()
    return () => abortController.abort()
  }

  let month = date.slice(5,7)
  let day = date.slice(8,10)
  let year = date.slice(0,4)


  return (
    <main>
      <div className="bg-dark">
      <h1 className="text-center pt-4 text-white">Dashboard</h1>
      <div className="mb-3">
      <h2 className="text-center text-white">Reservations for {month}/{day}/{year}</h2>
      </div>
      <DateButtons currentDate={date} />
      </div>
      <div className="m-4"> 
      <h2 className="my-4 border-info border-bottom">Reservations</h2>
        <ErrorAlert error={reservationsError} />
        <ListReservations reservations={reservations} loadBoth={loadBoth} setReservationsError={setReservationsError} />
      </div>
      <div className="m-4">
        <h2 className="my-4 border-info border-bottom">Tables</h2>
        <ErrorAlert error={tablesError} />
        <ListTables tables={tables} loadBoth={loadBoth} />
      </div>
    </main>
  );
}

export default Dashboard;
