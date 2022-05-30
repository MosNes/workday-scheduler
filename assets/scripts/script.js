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

var saveTimeBlocks = function() {
    var localArray = JSON.stringify(savedTimeBlocks);
    console.log("Saved", localArray);
    localStorage.setItem('savedTimeBlocks',localArray);
};

var loadTimeBlocks = function () {
    var localArray = JSON.parse(localStorage.getItem('savedTimeBlocks'));
    console.log("Loaded", localArray);
    savedTimeBlocks = localArray;
}

//initializes the array of timeBlocks that will be created and eventually added to the DOM
var timeChartCreator = function(savedTimeBlocks) {

    //calculate the number of blocks to create based on the starting time
    //and the ending time specified in the global variables
    var end = DateTime.fromISO(endHour);
    var start = DateTime.fromISO(startHour);
    //uses luxon to get the difference in hours between the two datetime objects, then get the number of hours from obj.values.hours
    var numBlocks = (end.diff(start, 'hours')).values.hours;
    
    //if savedTimeBlocks is empty, create array of objects 
    if (savedTimeBlocks.length === 0) {
        console.log("Generating New Array");
        for (i=0;i<numBlocks+1;i++) {
            //initializes an empty object
            var newObj = {};

            //creates a new time value by parsing the start hour and adding i hours
            newTime = DateTime.fromISO(startHour).plus({hours: i});

            //creates the new timeSlot value by converting it to 00:00 24-hr format
            newTimeSlot = newTime.toLocaleString({
                hour: 'numeric',
                minute: 'numeric',
                hourCycle: 'h23'
            })
            //adds the timeslot value to the newObj
            newObj.timeSlot = newTimeSlot;

            //generates ID by formatting the new time value into a 00 AM/PM string, then removes the space
            // e.g. 07AM
            newId = newTime.toLocaleString({
                hour:'2-digit',
                hourCycle: 'h12'
            }).replace(" ","");

            //adds the new id to the newObj
            newObj.id = newId;

            //sets a blank description to the newObj
            newObj.description = "";

            //adds the newObj to the array of savedTimeBlocks
            savedTimeBlocks.push(newObj);
        }
    }

    console.log(savedTimeBlocks);
};

// ------INITIALIZATIONS------

createTimeBlock(testBlock);
createTimeBlock(testBlock2);
timeChartCreator(savedTimeBlocks);
saveTimeBlocks();
loadTimeBlocks();