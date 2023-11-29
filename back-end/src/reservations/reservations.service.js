const knex = require("../db/connection")

function create(newReservation) {
    return knex("reservations").insert(newReservation).returning("*")
}

function list(reservation_date) {
    return knex("reservations").where({"reservation_date":reservation_date}).andWhereNot({"status":"finished"}).orderBy("reservation_time")
}

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

  function read(reservation_id) {
    return knex("reservations").where({reservation_id}).first()
  }

function update(reservation) {
  const {reservation_id} = reservation
  return knex("reservations").select("*").where({reservation_id}).update(reservation, "*").then((updatedReservation) => updatedReservation[0])
}

module.exports = {
    create,
    list,
    search,
    read,
    update,
}