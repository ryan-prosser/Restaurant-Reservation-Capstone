import React, {useState} from "react"
import ErrorAlert from "../layout/ErrorAlert"
import { finishTable } from "../utils/api"

function ListTables({tables, loadBoth}) {

    const [error, setError] = useState(null)

    const finishHandler = async (event) => {
        const abortController = new AbortController()
        if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
           await finishTable(event.target.value)
            .then(() => loadBoth())
            .catch((error) => setError(error))
        }
        return () => abortController.abort()
    }

if (tables.length > 0) {
    let list = tables.map((table) => {
        return (
        <div key={table.table_id} className="m-4 p-2">
            <h4 className="border-bottom border-dark pb-2">{table.table_name}</h4>
            <p>Capacity {table.capacity}</p>
            <p data-table-id-status={table.table_id}>Status: {table.reservation_id ? "occupied" : "free"}</p>
            {table.reservation_id ? 
            <button data-table-id-finish={table.table_id} type="button" value={table.table_id} onClick={finishHandler} className="btn btn-secondary mb-4">Finish</button> : null}
        </div>)
    })
    return (
        <div className="d-flex flex-wrap">
            <ErrorAlert error={error} setError={setError} />
            {list}
        </div>
    )

} else {
    return (
    <div>
        <h4>No tables found</h4>
    </div>
    )
}

}

export default ListTables