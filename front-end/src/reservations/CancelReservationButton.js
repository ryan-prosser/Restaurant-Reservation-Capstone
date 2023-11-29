import React from "react"
import { cancelReservation } from "../utils/api"

function CancelReservationButton({reservation_id, setReservationsError, loadBoth}) {

    const cancelHandler = (event) => {
        event.preventDefault()
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            cancelReservation(reservation_id, "cancelled")
            .then(() => loadBoth())
            .catch(setReservationsError)
        }
}

return (
    <button type="button" data-reservation-id-cancel={reservation_id} onClick={cancelHandler} className="btn btn-danger m-2">
        Cancel
    </button>
)


}

export default CancelReservationButton