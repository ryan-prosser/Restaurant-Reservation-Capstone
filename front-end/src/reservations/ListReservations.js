import React from "react"
import CancelReservationButton from "./CancelReservationButton"

function ListReservations({reservations, loadBoth, setReservationsError}) {
    
if (reservations.length > 0) {
    let list = reservations.map(({reservation_id,
                                  first_name,
                                  last_name,
                                  mobile_number,
                                  reservation_date,
                                  reservation_time,
                                  people,
                                  status,}) => {
        let resMonth = (reservation_date.slice(5,7))
        let resDay = (reservation_date.slice(8,10))
        let resYear = (reservation_date.slice(0,4))
        if (status !== "finished") {
        return (
        <div key={reservation_id} className="m-4 border border-dark p-2">
            <div className="text-center">
            <h4 className="border-bottom border-dark pb-2">{first_name} {last_name}</h4>
            <p>Party of {people}</p>
            <p>Reservation date: {resMonth}/{resDay}/{resYear}</p>
            <p>Reservation time: {reservation_time.slice(0,5)}</p>
            <p>Mobile number: {mobile_number}</p>
            <p data-reservation-id-status={reservation_id} className="card-text">Reservation status: {status}</p>
            </div>
            <div>
            {status === "booked" ? 
            <a href={`/reservations/${reservation_id}/seat`}><button type="button" className="btn btn-info mr-2">Seat</button></a> : null}
            {status === "booked" ? 
            <a href={`/reservations/${reservation_id}/edit`}><button type="button" className="btn btn-secondary m-2">Edit</button></a> : null}
            {status === "booked" ? 
            <CancelReservationButton reservation_id={reservation_id} setReservationsError={setReservationsError} loadBoth={loadBoth} /> : null }
        </div> 
        </div>)}
    }) 
    return (
        <div className="d-flex flex-wrap">
            {list}
        </div>
    )

} else {
    return (
    <div>
        <h2 className="m-4">No reservations found</h2>
    </div>
    )
}

}

export default ListReservations