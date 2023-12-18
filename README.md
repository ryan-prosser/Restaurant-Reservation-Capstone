# Capstone: Restaurant Reservation System

This restaurant reservation system, named Period Tables, is my final capstone project for the Chegg Skills (Thinkful) Software Engineering Program. I created a full-stack application within a monorepo so that restaurants can create, view, edit, seat, search, or cancel reservations at their restaurant. I combined all of the JavaScript skills I had been honing throughout this course to showcase my abilities in this final project.

I implemented 8 different previously defined user stories. The instructions for those stories are included at the bottom of this file. Each user story passed a series of front-end and back-end testing, as well as error handling to ensure proper use of the application. Migrations and seedings were handled using Knex while in the development and testing phase.

You can view the final deployed application [here](https://restaurant-reservation-capstone-frontend-b34d.onrender.com)!

## Languages, Frameworks, and Technologies used

- JavaScript
- React
- Bootstrap
- Express
- Node.js
- Knex
- DBeaver
- Elephant SQL

## Project Features

### Dashboard

The dashboard is used at the home page for the application. This is where the user can view the current reservations for the selected day, the tables at the restaurant, as well as the menu bar to reach all other features of the application. If there are no reservations for the selected day, a message "No Reservations Found" will be displayed.

The reservations cards on the dashboard show all of the reservation information provided by customers as well as the current status. If the status is set to booked, the edit, seat, and cancel button are displayed on the reservation card.

The table cards on the dashboard show the table name, table capacity, and the current status of the table. The table is set to "free" by deafult but will show "occupied" and a finish button if a reservation is currently seated at the table.

### Create Reservation

The create reservation feature allows users to create a reservation with customer information attached to it. The input fields are first name, last name, mobile number, date of reservation, time of reservation, and party size. All fields are required and if one is left out or violates any entry validation then an error message appears at the top of the page showing the related error. Clicking cancel takes you back to the previous page and clicking submit sends a POST request and takes you back to the dashboard on the day of the reservation that was just created.

### Create Table

The create table feature allows users to create new tables to be added to the available tables in the restaurant. The input fields are table name, and capacity. Both fields are required and must meet validation requirements or an error message will appear at the top displaying the error. Clicking cancel takes you back to the previous page and clicking submit will send a POST request and take you back to the dashboard.

### Search

The search feature allows the user to search for reservations by phone number. The input accepts multiple phone number formats and will even show reservations if a partial phone number is provided. After clicking find, the page will display all reservations, including past reservations, that have a booked, seated, or cancelled reservation status. From there the user cna interact with the reservation just as they can from the dashboard. If no reservations match the phone number provided, a message will display saying "No Reservations Found".

### Edit Reservation

The edit reservation feature allows users to edit an existing reservation. This page is accessed by clicking the "edit" button on a reservation card and can only be accessed if the reservation status is set to "booked". The feature uses the same form as the create reservation feature but will show all existing information filled in already. Clicking the cancel button will bring the user back to the previous page and clicking submit will send a PUT request after going through the same validation process as when a new reservation is created and take you back to the dashboard.

### Seating Reservation

The seat reservation feature allows user to seat a reservation at an available table in the restaurant. The page displays important reservation information and a drop down selection with all table names and capacities. Clicking cancel will bring you back to the previous page. After selecting a table and clicking submit, the application will check to make sure the table has the capacity to fit the selected reservation and take you back to the dashboard page. Here you will see that the reservation status has been changed to "seated" and the table status has been changed to "occupied".

### Finish Seated Reservation

The finish reservation feature allows users to clear a reservation when the party has left. The table will display the "finish" button when it has a reservation seated at it and if clicked will display a confirmation message asking "Is this table ready to seat new guests? This cannot be undone.". If cancel is clicked on this message, nothing happens but if OK is clicked, the table status will be changed to "free" and the reservation status will be changed to finished" and not be displayed on the dashboard anymore.

### Cancel Reservation

The cancel reservation feature allows users to cancel an existing reservation if needed. When a reservation has the status of "booked" one of the three buttons shown will be cancel. If the cancel button is pressed a confirmation message will pop up asking "Do you want to cancel this reservation? This cannot be undone.". If cancel is  clicked, nothing happens but if OK is clicked the reservation status of the reservation will be changed to "cancelled" but will still be displayed on the dashboard. All buttons will also be removed from the reservation card.

## User Story Instructions/Criteria

### US-01 Create and list reservations

As a restaurant manager<br/>
I want to create a new reservation when a customer calls<br/>
so that I know how many customers will arrive at the restaurant on a given day.

#### Acceptance Criteria

1. The `/reservations/new` page will
   - have the following required and not-nullable fields:
     - First name: `<input name="first_name" />`
     - Last name: `<input name="last_name" />`
     - Mobile number: `<input name="mobile_number" />`
     - Date of reservation: `<input name="reservation_date" />`
     - Time of reservation: `<input name="reservation_time" />`
     - Number of people in the party, which must be at least 1 person. `<input name="people" />`
   - display a `Submit` button that, when clicked, saves the new reservation, then displays the `/dashboard` page for the date of the new reservation
   - display a `Cancel` button that, when clicked, returns the user to the previous page
   - display any error messages returned from the API
1. The `/dashboard` page will
   - list all reservations for one date only. (E.g. if the URL is `/dashboard?date=2035-12-30` then send a GET to `/reservations?date=2035-12-30` to list the reservations for that date). The date is defaulted to today, and the reservations are sorted by time.
   - display next, previous, and today buttons that allow the user to see reservations on other dates
   - display any error messages returned from the API
1. The `/reservations` API will have the same validations as above and will return 400, along with an informative error message, when a validation error happens.
   - seed the reservations table with the data contained in `./back-end/src/db/seeds/00-reservations.json`

### US-02 Create reservation on a future, working date

As a restaurant manager<br/>
I only want to allow reservations to be created on a day when we are open<br/>
so that users do not accidentally create a reservation for days when we are closed.<br/>

#### Acceptance criteria

1. The `/reservations/new` page will display an error message with `className="alert alert-danger"` if any of the following constraints are violated:
   - The reservation date is a Tuesday as the restaurant is closed on Tuesdays.
   - The reservation date is in the past. Only future reservations are allowed.
1. The `/reservations` API will have the same validations as above and will return 400, along with an informative error message, when a validation error happens.

### US-03 Create reservation within eligible timeframe

As a restaurant manager<br/>
I only want to allow reservations to be created during business hours, up to 60 minutes before closing<br/>
so that users do not accidentally create a reservation for a time we cannot accommodate.

#### Acceptance criteria

1. The `/reservations/new` page will display an error message with `className="alert alert-danger"`, if any of the following additional constraints are violated:
   - The reservation time is before 10:30 AM.
   - The reservation time is after 9:30 PM, because the restaurant closes at 10:30 PM and the customer needs to have time to enjoy their meal.
   - The reservation date and time combination is in the past. Only future reservations are allowed. E.g., if it is noon, only allow reservations starting _after_ noon today.
1. The `/reservations` API will have the same validations as above and will return 400, along with an informative error message, when a validation error happens.

### US-04 Seat reservation

As a restaurant manager, <br/>
When a customer with an existing reservation arrives at the restaurant<br/>
I want to seat (assign) their reservation to a specific table<br/>
so that I know which tables are occupied and free.

#### Acceptance Criteria

1. The `/tables/new` page will
   - have the following required and not-nullable fields:
     - Table name: `<input name="table_name" />`, which must be at least 2 characters long.
     - Capacity: `<input name="capacity" />`, this is the number of people that can be seated at the table, which must be at least 1 person.
   - display a `Submit` button that, when clicked, saves the new table then displays the `/dashboard` page
   - display a `Cancel` button that, when clicked, returns the user to the previous page
1. The `/dashboard` page will:

   - display a list of all reservations in one area.
   - each reservation in the list will:
     - Display a "Seat" button on each reservation.
     - The "Seat" button must be a link with an `href` attribute that equals `/reservations/${reservation_id}/seat`, so it can be found by the tests.
   - display a list of all tables, sorted by `table_name`, in another area of the dashboard
     - Each table will display "Free" or "Occupied" depending on whether a reservation is seated at the table.
     - The "Free" or "Occupied" text must have a `data-table-id-status=${table.table_id}` attribute, so it can be found by the tests.

1. The `/reservations/:reservation_id/seat` page will
   - have the following required and not-nullable fields:
     - Table number: `<select name="table_id" />`. The text of each option must be `{table.table_name} - {table.capacity}` so the tests can find the options.
   - do not seat a reservation with more people than the capacity of the table
   - display a `Submit` button that, when clicked, assigns the table to the reservation then displays the `/dashboard` page
   - PUT to `/tables/:table_id/seat/` in order to save the table assignment. The body of the request must be `{ data: { reservation_id: x } }` where X is the reservation_id of the reservation being seated. The tests do not check the body returned by this request.
   - display a `Cancel` button that, when clicked, returns the user to the previous page
1. The `tables` table must be seeded with the following data:
   - `Bar #1` & `Bar #2`, each with a capacity of 1.
   - `#1` & `#2`, each with a capacity of 6.
1. The `/tables` API will have the same validations as above and will return 400, along with an informative error message, when a validation error happens.

### US-05 Finish an occupied table

As a restaurant manager<br/>
I want to free up an occupied table when the guests leave<br/>
so that I can seat new guests at that table.<br/>

#### Acceptance Criteria

1. The `/dashboard` page will
   - Display a "Finish" button on each _occupied_ table.
   - the "Finish" button must have a `data-table-id-finish={table.table_id}` attribute, so it can be found by the tests.
   - Clicking the "Finish" button will display the following confirmation: "Is this table ready to seat new guests? This cannot be undone." If the user selects "Ok" the system will: - Send a `DELETE` request to `/tables/:table_id/seat` in order to remove the table assignment. The tests do not check the body returned by this request. - The server should return 400 if the table is not occupied. - Refresh the list of tables to show that the table is now available.
   - Clicking the "Cancel" makes no changes.

### US-06 Reservation Status

As a restaurant manager<br/>
I want a reservation to have a status of either booked, seated, or finished<br/>
so that I can see which reservation parties are seated, and finished reservations are hidden from the dashboard.

#### Acceptance Criteria

1. The `/dashboard` page will
   - display the status of the reservation. The default status is "booked"
     - the status text must have a `data-reservation-id-status={reservation.reservation_id}` attribute, so it can be found by the tests.
   - display the Seat button only when the reservation status is "booked".
   - clicking the Seat button changes the status to "seated" and hides the Seat button.
   - clicking the Finish button associated with the table changes the reservation status to "finished" and removes the reservation from the dashboard.
   - to set the status, PUT to `/reservations/:reservation_id/status` with a body of `{data: { status: "<new-status>" } }` where `<new-status>` is one of booked, seated, or finished. Please note that this is only tested in the back-end for now.

### US-07 Search for a reservation by phone number

As a restaurant manager<br/>
I want to search for a reservation by phone number (partial or complete)<br/>
so that I can quickly access a customer's reservation when they call about their reservation.<br/>

#### Acceptance Criteria

1. The `/search` page will
   - Display a search box `<input name="mobile_number" />` that displays the placeholder text: "Enter a customer's phone number"
   - Display a "Find" button next to the search box.
   - Clicking on the "Find" button will submit a request to the server (e.g. GET `/reservations?mobile_number=800-555-1212`).
     - then the system will look for the reservation(s) in the database and display all matched records on the `/search` page using the same reservations list component as the `/dashboard` page.
     - the search page will display all reservations matching the phone number, regardless of status.
   - display `No reservations found` if there are no records found after clicking the Find button.

### US-08 Change an existing reservation

As a restaurant manager<br/>
I want to be able to modify a reservation if a customer calls to change or cancel their reservation<br/>
so that reservations are accurate and current.

#### Acceptance Criteria

1. The `/dashboard` and the `/search` page will
   - Display an "Edit" button next to each reservation
     - Clicking the "Edit" button will navigate the user to the `/reservations/:reservation_id/edit` page
   - the "Edit" button must be a link with an `href` attribute that equals `/reservations/${reservation_id}/edit`, so it can be found by the tests.
   - Display a "Cancel" button next to each reservation
   - The Cancel button must have a `data-reservation-id-cancel={reservation.reservation_id}` attribute, so it can be found by the tests.
   - Clicking the "Cancel" button will display the following confirmation: "Do you want to cancel this reservation? This cannot be undone."
     - Clicking "Ok" on the confirmation dialog, sets the reservation status to `cancelled`, and the results on the page are refreshed.
       - set the status of the reservation to `cancelled` using a PUT to `/reservations/:reservation_id/status` with a body of `{data: { status: "cancelled" } }`.
     - Clicking "Cancel" on the confirmation dialog makes no changes.
1. The `/reservations/:reservation_id/edit` page will display the reservation form with the existing reservation data filled in
   - Only reservations with a status of "booked" can be edited.
   - Clicking the "Submit" button will save the reservation, then displays the previous page.
   - Clicking "Cancel" makes no changes, then display the previous page.
