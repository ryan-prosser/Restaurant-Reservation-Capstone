import React from "react"

function Form({reservationInfo, submitHandler, cancelHandler, changeHandler}) {

return (
    <div className="col-6">
        <form onSubmit={submitHandler} className="form-group">

            <p className="font-weight-bold">First name:</p>
            <input name="first_name" 
            id="first_name" 
            type="text"
            required={true}
            placeholder="First name" 
            value={reservationInfo.first_name}
            onChange={changeHandler}
            className="form-control shadow border-info">
            </input>

            <p className="font-weight-bold mt-3">Last name:</p>
            <input name="last_name" 
            id="last_name" 
            type="text"
            required={true} 
            placeholder="Last name"
            value={reservationInfo.last_name}
            onChange={changeHandler}
            className="form-control shadow border-info">
            </input>

            <p className="font-weight-bold mt-3">Mobile number:</p>
            <input name="mobile_number" 
            id="mobile_number" 
            type="text"
            required={true} 
            placeholder="XXX-XXX-XXXX"
            value={reservationInfo.mobile_number}
            onChange={changeHandler}
            className="form-control shadow border-info">
            </input>

            <p className="font-weight-bold mt-3">Date of reservation:</p>
            <input name="reservation_date" 
            id="reservation_date" 
            type="date"
            required={true}
            value={reservationInfo.reservation_date}
            onChange={changeHandler}
            className="form-control shadow border-info">
            </input>

            <p className="font-weight-bold mt-3">Time of reservation:</p>
            <input name="reservation_time" 
            id="reservation_time" 
            type="time"
            required={true}
            value={reservationInfo.reservation_time}
            onChange={changeHandler}
            className="form-control shadow border-info">
            </input>

            <p className="font-weight-bold mt-3">Number of people in party:</p>
            <input name="people" 
            id="people" 
            type="number" 
            min={1}
            required={true}
            value={reservationInfo.people}
            onChange={changeHandler}
            className="form-control shadow border-info">
            </input>

            <div className="my-4">
            <button type="submit" onClick={submitHandler} className="btn btn-info mr-4">Submit</button>
            <button type="button" onClick={cancelHandler} className="btn btn-danger">Cancel</button>
            </div>
            
        </form>
    </div>
)

}

export default Form