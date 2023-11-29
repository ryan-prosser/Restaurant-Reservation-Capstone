import React, {useState, useEffect} from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { readReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Form from "./Form";

function EditReservation() {

const history = useHistory()

const {reservation_id} = useParams()
const [reservation, setReservation] = useState([])
const [error, setError] = useState(null)

const loadReservation = () => {
    const abortController = new AbortController()
    readReservation(reservation_id, abortController.signal)
    .then((reservation) => setReservation(reservation))
    .catch((error) => setError(error))
}

useEffect(loadReservation, [reservation_id])

const changeHandler = ({target}) => {
    if (target.name === "people") {
        setReservation({
            ...reservation,
            [target.name]: Number(target.value)
        })
    } else {
    setReservation({
        ...reservation,
        [target.name]: target.value,
    })
    }
    }

    const cancelHandler = (event) => {
        history.goBack()
    }

const submitHandler = (event) => {
    event.preventDefault();
    updateReservation(reservation_id, reservation)
    .then(() => history.push(`/dashboard?date=${reservation.reservation_date}`))
    .catch((error) => setError(error))
}

return (
    <div>
        <div className="bg-dark p-4">
        <h1 className="text-center text-white">Edit Reservation {reservation_id}</h1>
        </div>
        <ErrorAlert error={error} setError={setError} />
        <div className="mt-4">
        <Form reservationInfo={reservation} submitHandler={submitHandler} cancelHandler={cancelHandler} changeHandler={changeHandler}/>
        </div>
    </div>
)

}

export default EditReservation