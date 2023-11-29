import React, {useState} from "react"
import {useHistory} from "react-router-dom"
import Form from "./Form"
import { createReservation } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"

function NewReservations({reservation}) {

    let initialState = reservation ? reservation : {first_name:"", last_name:"", mobile_number:"", reservation_date:"", reservation_time:"", people:0, status:"booked"}
    const [reservationInfo, setReservationInfo] = useState(initialState)

    const [error, setError] = useState(null)

    const history = useHistory()

    const submitHandler = async (event) => {
        event.preventDefault();
        await createReservation(reservationInfo, AbortController.signal)
        .then((NewReservations) => history.push(`/dashboard?date=${reservationInfo.reservation_date}`))
        .catch((error) => setError(error))
    }

    const cancelHandler = async (event) => {
        history.goBack()
    }

    const changeHandler = ({target}) => {
        if (target.name === "people") {
            setReservationInfo({
                ...reservationInfo,
                [target.name]: Number(target.value)
            })
        } else {
        setReservationInfo({
            ...reservationInfo,
            [target.name]: target.value,
        })
        }
        }

    return (
        <div>
            <div className="bg-dark p-4">
            <h1 className="text-center text-white">Create New Reservation</h1>
            </div>
            <ErrorAlert error={error} setError={setError} />
            <div className="mt-4">
            <Form reservationInfo={reservationInfo} submitHandler={submitHandler} cancelHandler={cancelHandler} changeHandler={changeHandler} />
            </div>
        </div>
    )
}

export default NewReservations