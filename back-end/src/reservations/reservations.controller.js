/**
 * List handler for reservation resources
 */
const {today} = require("../utils/date-time")
const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function list(req, res) {
  if (req.query.date) {
    const data = await service.list(req.query.date);
    res.json({ data: data });
  } else if (req.query.mobile_number) {
    const data = await service.search(req.query.mobile_number);
    res.json({ data: data });
  } else {
    const data = await service.list(today());
    res.json({ data: data });
  }
}

async function create(req, res) {
  const newReservation = await service.create(req.body.data)
  res.status(201).json({data: newReservation[0]})
}

async function hasData(req, res, next) {
  if (req.body.data) {
    return next()
  }
  next({status: 400, message: "Body must have data"})
}

function hasProperty(property) {
  return function (req, res, next) {
    const {data = {}} = req.body
    if (data[property]) {
      return next()
    }
    next({status:400, message:`Must have a ${property} property`})
  };
}

function statusIsBooked(req, res, next) {
  const {status} = req.body.data
  if (status && status !== "booked") {
    next({status:400, message:`A new reservation cannot have a status of ${status}`})
  } else {
    next()
  }
}

function notOnTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const dateString = reservation_date.split("-");
  const numDate = new Date(
    Number(dateString[0]),
    Number(dateString[1]) - 1,
    Number(dateString[2]),
    0,
    0,
    1
  );
  if (numDate.getDay() === 2) {
    next({ status: 400, message: "Restaurant is closed on Tuesdays" });
  } else {
    next();
  }
}

function eligibleHours(req, res, next) {
  const {reservation_time} = req.body.data
  if (reservation_time >= "10:30" && reservation_time <= "21:30") {
    return next()
  } else {
    next({status:400, message:"reservation_time must be between business hours"})
  }
}

function notInPast(req, res, next) {
  const {reservation_date, reservation_time} = req.body.data
  const time = reservation_time.split(":")
  const hour = time[0]
  const minute = time[1]
  const date = reservation_date.split("-")
  const year = date[0]
  const month = date[1] - 1
  const day = date[2]
  const reservation = new Date(year, month, day, hour, minute, 59, 59).getTime()
  const today = new Date().getTime()
  if (reservation > today) {
    return next()
  } else {
    next({status:400, message:"reservation_date and reservation_time has already passed. Please select a time in the future."})
  }
}

function mobileNumberIsNumber(req, res, next) {
  const {mobile_number} = req.body.data
  const check = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
  if (!check.test(mobile_number)) {
    next({status:400, message:"Please enter phone number in valid format; ex. 000-000-0000"})
  } else {
    next()
  }
}

function peopleIsNumber(req, res, next) {
  const {people} = req.body.data
  if (!Number.isInteger(people)) {
    next({status:400, message:"people must be a number"})
  } else {
    next()
  }
}

function atLeastOnePerson(req, res, next) {
  const {people} = req.body.data
  if (people >= 1) {
    next()
  } else {
    next({status:400, message:"Must have at least 1 person for reservation"})
  }
}

async function read(req, res, next) {
  const data = res.locals.reservation
  res.json({data})
}

async function reservationExists(req, res, next) {
  const reservation_id = req.params.reservation_id
  const data = await service.read(reservation_id)
  if (data) {
    res.locals.reservation = data
    next()
  } else {
    next({status:404, message:`Reservation ${reservation_id} does not exist`})
  }
}

async function update(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id
  }
  const data = await service.update(updatedReservation)
  res.json({data})
}

function isFinished(req, res, next) {
  const {status} = res.locals.reservation
  if (status && status === "finished") {
    next({status:400, message:"A finished reservation cannot be updated"})
  } else {
    next()
  }
}

async function updateStatus(req, res, next) {
  const {reservation, status} = res.locals
  const updatedReservation = {
    ...reservation,
    status: status
  }
  const data = await service.update(updatedReservation)
  res.json({data})
}

function hasValidStatus(req, res, next) {
  const VALID_STATUSES = ["booked", "seated", "finished", "cancelled"]
  const {status} = req.body.data
  if (status && !VALID_STATUSES.includes(status)) {
    next({status:400, message:`${status} is an invalid status. A status must be booked, seated, finished, or cancelled`})
  } else {
    res.locals.status = status
    next()
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasData,
           statusIsBooked,
           hasProperty("first_name"),
           hasProperty("last_name"),
           hasProperty("mobile_number"),
           mobileNumberIsNumber,
           hasProperty("reservation_date"),
           notOnTuesday,
           hasProperty("reservation_time"),
           eligibleHours,
           notInPast,
           hasProperty("people"),
           peopleIsNumber,
           atLeastOnePerson,
           asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists),
         read],
  update: [asyncErrorBoundary(reservationExists),
           hasData,
           hasProperty("first_name"),
           hasProperty("last_name"),
           hasProperty("mobile_number"),
           hasProperty("reservation_date"),
           notOnTuesday,
           hasProperty("reservation_time"),
           eligibleHours,
           notInPast,
           hasProperty("people"),
           atLeastOnePerson,
           peopleIsNumber,
           statusIsBooked,
           asyncErrorBoundary(update)],
  updateStatus: [hasData,
                 hasProperty("status"),
                 asyncErrorBoundary(reservationExists),
                 isFinished,
                 hasValidStatus,
                 asyncErrorBoundary(updateStatus)]
};
