import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {today, previous, next} from "../utils/date-time"

function DateButtons({currentDate}) {

    const history = useHistory();

    const previousHandler = (event) => {
      event.preventDefault();
      history.push(`/dashboard?date=${previous(currentDate)}`)
      currentDate = previous(currentDate);
    }
    
    const todayHandler = (event) => {
      event.preventDefault();
      history.push(`/dashboard?date=${today()}`)
      currentDate = today();
    }
  
    const nextHandler = (event) => {
      event.preventDefault();
      history.push(`/dashboard?date=${next(currentDate)}`)
      currentDate = next(currentDate);
    }
  
    return (
        <div className="d-flex justify-content-around pb-4">
            <button type="button" name="previous" onClick={previousHandler} className="btn btn-info">
                Previous
            </button>
            <button type="button" name="today" onClick={todayHandler} className="btn btn-info">
                Today
            </button>
            <button type="button" name="next" onClick={nextHandler} className="btn btn-info">
                Next
            </button>
        </div>
    )

}

export default DateButtons