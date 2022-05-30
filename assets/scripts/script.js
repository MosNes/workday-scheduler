//Time Block Reference HTML
/* <div class="time-block w-100 row d-flex flex-row">
        <div class="hour col-1 p-3">Test hour</div>
        <div class="description col-10 p-3">Test 1</div>
        <div class="save-container col-1">
          <button class="btn saveBtn w-100 h-100"><i class="fa-solid fa-floppy-disk"></i></button>
        </div> */

// ------GLOBAL VARIABLES------

//sets DateTime to be used later instead of having to type luxon.DateTime each time
const DateTime = luxon.DateTime;

//selects the HTML element that will hold the current date once generated
var todaysDateEl = $('#currentDay');

//selects the parent container for all the timeBlock elements to be created
var timeBlockContainerEl = $('#timeblock-container');

//gets today's date as a luxon DateTime object
var todaysDate = DateTime.now();

//sets the starting hour for the workday in 24hr format
const startHour = "07:00";

//sets the ending hour for the workday in 24hr format
const endHour = "18:00";

//JQuery template for a blank timeBlock element
var timeBlockEl = $("<div>").addClass("time-block w-100 row d-flex flex-nowrap flex-row justify-content-between").html('<div class="hour col-2 col-lg-1 p-3">Test hour</div><div class="description col-5 col-sm-10 p-3">Test 1</div><div class="save-container col-2 col-sm-2 col-md-1 col-lg-1"><button class="btn saveBtn w-100 h-100"><i class="fa-solid fa-floppy-disk"></i></button>');

//placeholder for the array of timeBlock objects to be saved to localStorage
var savedTimeBlocks = [];

//example timeBlock object
var testBlock = {
    id: "7AM",
    timeSlot: "07:00",
    description: "This is a sample task."
};

var testBlock2 = {
    id: "8AM",
    timeSlot: "08:00",
    description: "This is a different sample task."
};

// ------FUNCTIONS------

//creates a single timeBlock element and adds it to the container on the page
var createTimeBlock = function(timeBlockObj) {
    //clones a new jQuery timeBlock object from the template
    var newTimeBlockEl = timeBlockEl.clone();
    //sets the ID, Description, and Hour based on the input object
    newTimeBlockEl.attr("id",timeBlockObj.id);
    newTimeBlockEl.children(".description").text(timeBlockObj.description);
    newTimeBlockEl.children(".hour").text(timeBlockObj.timeSlot);
    //appends the new timeBlock element to the timeBlockContainer element
    timeBlockContainerEl.append(newTimeBlockEl);
};

var timeChartCreator = function(savedTimeBlocks) {

};

// ------INITIALIZATIONS------

createTimeBlock(testBlock);
createTimeBlock(testBlock2);