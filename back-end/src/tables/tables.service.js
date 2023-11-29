const knex = require("../db/connection")

function create(newTable) {
    return knex("tables").insert(newTable).returning("*")
}

function list() {
    return knex("tables").select("*").orderBy("table_name")
} 

function read(table_id) {
    return knex("tables").where({"table_id": table_id}).first()
}

function readReservation(reservation_id) {
    return knex("reservations").where({reservation_id}).first();
}

function update(table_id, reservation_id) {
    return knex("tables").where({table_id}).update({"reservation_id": reservation_id, "status": "occupied"}).returning("*")
}

function updateReservation(reservation_id, status) {
    return knex("reservations").where({reservation_id}).update({"status": status}).returning("*")
}

function finishTable(table) {
    return knex("tables").where({"table_id": table.table_id}).update({"reservation_id": null, "status": "free"}).returning("*")
}

module.exports = {
    create,
    list,
    read,
    readReservation,
    update,
    updateReservation,
    finishTable,
}