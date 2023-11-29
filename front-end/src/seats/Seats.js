import React, {useState, useEffect} from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"
import { listTables, readReservation, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Seat() {

    const {reservation_id} = useParams()
    const history = useHistory()

    const [error, setError] = useState(null)
    const [tables, setTables] = useState([])
    const [reservation, setReservation] = useState([])
    const [tableId, setTableId] = useState("")

    useEffect(() => {
        async function loadTables() {
            const data = await listTables()
            setTables(data)
        }
        loadTables()
    }, [])

    useEffect(() => {
        async function loadReservation() {
            const data = await readReservation(reservation_id)
            setReservation(data)
        }
        loadReservation()
        console.log(reservation)
    }, [reservation_id])

    const changeHandler = ({ target }) => {
        setTableId(target.value);
      }

    const submitHandler = async (event) => {
        event.preventDefault();
        const table = tables.find((table) => table.table_id === Number(tableId))
        if (table.capacity < reservation.people) {
            setError({message:`${table.table_name} cannot fit this size party. Please select bigger table.`})
        } else {
            updateTable(table.table_id, reservation.reservation_id)   
            .then(() => history.push("/dashboard"))
            .catch((error) => setError(error))            
        }
    }

    const cancelHandler = async (event) => {
        history.goBack()
    }


return (
    <div>
        <div className="bg-dark p-4">
        <h1 className="text-center text-white">Seating</h1>
        </div>
        <ErrorAlert error={error} setError={setError} />
        <div className="m-4">
        <div>
            <h2>Reservation {reservation_id}</h2>
            <h5>Please select a table for {reservation.first_name} {reservation.last_name}, party of {reservation.people}</h5>
        </div>
        <div className="mb-4">
            <select name="table_id" onChange={changeHandler} className="form-select mt-4 shadow border-info">
                <option value="">-- Please choose a table --</option>
                {tables.map((table) => (
                    <option name="table_id" value={table.table_id} key={table.table_name}>
                        {table.table_name} - {table.capacity}
                    </option>
                ))}
            </select>
        </div>
        <div>
            <button type="submit" onClick={submitHandler} className="btn btn-info mr-4">
                Submit
            </button>
            <button type="button" onClick={cancelHandler} className="btn btn-danger">
                Cancel
            </button>
        </div>
        </div>
    </div>
)


}

export default Seat