const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function list(req, res) {
  const data = await service.list()
  res.json({data})
}

async function create(req, res) {
    const newTable = await service.create(req.body.data)
    res.status(201).json({data: newTable[0]})
  }

function hasData(req, res, next) {
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

function capacityIsNumber(req, res, next) {
    const {capacity} = req.body.data
    if (!Number.isInteger(capacity)) {
      next({status:400, message:"capacity must be a number"})
    } else {
      next()
    }
  }

function capacityOverOne(req, res, next) {
    const {capacity} = req.body.data
    if (capacity >= 1) {
        return next()
    } else {
        next({status:400, message:"Table capcity must be at least 1"})
    }
  }

function tableNameLength(req, res, next) {
    const {table_name} = req.body.data
    if (table_name.length < 2) {
      next({status:400, message:"table_name must be at least 2 characters long"})
    } else {
      next()
    }
  }

  async function seatReservation(req, res, next) {
    const table = res.locals.table
    const reservation = res.locals.reservation
    await service.updateReservation(reservation.reservation_id, "seated")
    await service.update(table.table_id, reservation.reservation_id)
    res.json({})
  }

async function tableExists(req, res, next) {
    const table_id = req.params.table_id
    const table = await service.read(table_id)
    if (table) {
        res.locals.table = table
        return next()
    } else {
        next({status:404, message:`Table ${table_id} does not exist`})
    }
}

async function reservationExists(req, res, next) {
    const {reservation_id} = req.body.data
    const reservation = await service.readReservation(reservation_id)
    if (reservation) {
      res.locals.reservation = reservation
      next()
    } else {
      next({status:404, message:`Reservation ${reservation_id} does not exist`})
    }
  }

function alreadySeated(req, res, next) {
    const {status} = res.locals.reservation
    if (status === "seated") {
      next({status:400, message:"Reservation is already seated"})
    } else {
      next()
    }
  }

function checkIfOccupied(req, res, next) {
    const table = res.locals.table
    if (table.reservation_id) {
      next({status:400, message:"This table is occupied"})
    } else {
      next()
    }
  }

function checkCapacity(req, res, next) {
    const table = res.locals.table
    const reservation = res.locals.reservation
        if (reservation.people > table.capacity) {
            return next({status:400, message:"Table does not have proper capacity for that reservation"})
        } else {
            next()
        }
  }

async function finish(req, res, next) {
    const {table} = res.locals
    const {reservation_id} = table
    await service.finishTable(table)
    await service.updateReservation(reservation_id, "finished")
    res.json({})
  }

function notOccupied(req, res, next) {
    const table = res.locals.table
    if (!table.reservation_id) {
      next({status:400, message:"Table is not occupied"})
    } else {
      next()
    }
  }


module.exports = {
    list: asyncErrorBoundary(list),
    create: [hasData,
             hasProperty("table_name"),
             hasProperty("capacity"),
             capacityIsNumber,
             capacityOverOne,
             tableNameLength,
             asyncErrorBoundary(create)],
    update: [hasData,
             hasProperty("reservation_id"),
             asyncErrorBoundary(reservationExists),
             asyncErrorBoundary(tableExists),
             alreadySeated,
             checkIfOccupied,
             checkCapacity,
             asyncErrorBoundary(seatReservation)
            ],
    destroy: [asyncErrorBoundary(tableExists),
              notOccupied,
              asyncErrorBoundary(finish)]
}