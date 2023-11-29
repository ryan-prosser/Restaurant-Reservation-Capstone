import React, {useState} from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createTable } from "../utils/api";


function NewTable() {

    const history = useHistory()

    const initialState = {table_name:"", capacity:0}
    const [table, setTable] = useState(initialState)
    const [error, setError] = useState(null)

    const changeHandler = ({target}) => {
        setTable({
            ...table,
            [target.name]: target.value
        })
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        await createTable(table, AbortController.signal)
        .then((newTable) => history.push("/dashboard"))
        .catch((error) => setError(error))
    }

    const cancelHandler = async (event) => {
        history.goBack()
    }

    return (
        <main>
        <div>
            <div className="bg-dark p-4">
            <h1 className="text-center text-white">Create New Table</h1>
            </div>
            <ErrorAlert error={error} setError={setError} />
        </div>
        <div className="col-6 mt-4">
            <form onSubmit={submitHandler} className="form-group">

                <p className="font-weight-bold">Table name:</p>
                <input name="table_name"
                id="table_name"
                type="text"
                required={true}
                placeholder="Table name"
                minLength={2}
                value={table.table_name}
                onChange={changeHandler}
                className="form-control shadow border-info">
                </input>

                <p className="font-weight-bold mt-3">Capacity:</p>
                <input name="capacity" 
                 id="capacity" 
                 type="number" 
                 min={1}
                 required={true}
                 value={table.capacity}
                 onChange={changeHandler}
                 className="form-control shadow border-info">
                </input>  
                              
            </form>
            <button type="submit" onClick={submitHandler} className="btn btn-info mr-4">
                Submit
            </button>
            <button type="button" onClick={cancelHandler} className="btn btn-danger">
                Cancel
            </button>
        </div>
        </main>
    )

}

export default NewTable