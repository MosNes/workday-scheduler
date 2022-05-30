//Time Block Reference HTML
/* <div class="time-block w-100 row d-flex flex-row">
        <div class="hour col-1 p-3">Test hour</div>
        <div class="description col-10 p-3">Test 1</div>
        <div class="save-container col-1">
          <button class="btn saveBtn w-100 h-100"><i class="fa-solid fa-floppy-disk"></i></button>
        </div> */

// ------GLOBAL VARIABLES------
const DateTime = luxon.DateTime;
var todaysDateEl = $('#currentDay');

var timeBlockContainerEl = $('#timeblock-container');

var todaysDate = DateTime.now();

var timeBlockEl = $("<div>").addClass("time-block w-100 row d-flex flex-row").html('<div class="hour col-1 p-3">Test hour</div><div class="description col-10 p-3">Test 1</div><div class="save-container col-1"><button class="btn saveBtn w-100 h-100"><i class="fa-solid fa-floppy-disk"></i></button>');

console.log(timeBlockEl);

// ------FUNCTIONS------

// ------INITIALIZATIONS------