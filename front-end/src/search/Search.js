import React, {useState} from "react"
import { listReservations } from "../utils/api"
import ListReservations from "../reservations/ListReservations"
import ErrorAlert from "../layout/ErrorAlert"

function Search() {

    const [mobile_number, setMobileNumber] = useState("")
    const [reservations, setReservations] = useState([])
    const [reservationMessage, setReservationMessage] = useState("")
    const [error, setError] = useState(null)

    const changeHandler = ({target}) => {
        setMobileNumber(target.value)
    }

    const findHandler = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
         listReservations({mobile_number}, abortController.signal)
        .then((reservations) => setReservations(reservations))
        .then(setReservationMessage("No reservations found"))
        .catch((error) => setError(error))

        return () => abortController.abort()
    }

    return (
        <main>
          <div>
            <div className="bg-dark p-4">
            <h1 className="text-center text-white">Reservation Search</h1>
            </div>
            <ErrorAlert error={error} setError={setError} />
          </div>
          <div className="form-group d-flex mx-4 mt-4">
            <input 
              type="text" 
              name="mobile_number" 
              onChange={changeHandler}
              value={mobile_number}
              placeholder="Enter customer's phone number" 
              className="form-control mr-5 shadow border-info"
            />
            <button type="submit" onClick={findHandler} className="btn btn-info mr-5 px-4">
                Find
            </button>
          </div>
    
        <div>
          {reservations.length ? 
            <ListReservations reservations={reservations} />
            :
            <h3>{reservationMessage}</h3>
          }
        </div>
    
        </main>
      )
}

export default Search