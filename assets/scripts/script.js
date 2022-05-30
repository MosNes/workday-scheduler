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

//updates the currentDay element on the page to display the current date and time
var showCurrentDate = function() {
    todaysDateEl.text(
        todaysDate.toLocaleString(DateTime.DATETIME_SHORT)
    );
}

//creates a single timeBlock element and adds it to the container on the page
var createTimeBlock = function (timeBlockObj) {
    //clones a new jQuery timeBlock object from the template
    var newTimeBlockEl = timeBlockEl.clone();
    //sets the ID, Description, and Hour based on the input object
    newTimeBlockEl.attr("id", timeBlockObj.id);
    newTimeBlockEl.children(".description").text(timeBlockObj.description);
    //sets the background color based on whether the timeslot comes before, during, or after the current time
    var comparedTime = DateTime.fromISO(timeBlockObj.timeSlot);
    if (comparedTime.startOf('hour') < todaysDate.startOf('hour')){
        newTimeBlockEl.addClass('past');
    }
    else if (comparedTime.startOf('hour') > todaysDate.startOf('hour')){
        newTimeBlockEl.addClass('future');
    }
    else {
        newTimeBlockEl.addClass('present');
    }
    //formats the timeslot text to a 00 AM/PM format
    var displayTime = comparedTime
        .toLocaleString({
            hour: '2-digit',
            hourCycle: 'h12'
        });
    newTimeBlockEl.children(".hour").text(displayTime);
    //appends the new timeBlock element to the timeBlockContainer element
    timeBlockContainerEl.append(newTimeBlockEl);
};

//saves the savedTimeBlocks array to local storage
var saveTimeBlocks = function() {
    var localArray = JSON.stringify(savedTimeBlocks);
    localStorage.setItem('savedTimeBlocks',localArray);
    console.log("Saved changes to Local Storage");
};

//loads the savedTimeblocks array from local storage
//if no array exists in local storage, returns false
var loadTimeBlocks = function () {
    var localArray = JSON.parse(localStorage.getItem('savedTimeBlocks'));
    if (localArray){
        console.log("Loaded timeBlock array from Local Storage");
        savedTimeBlocks = localArray;
        return true;
    }
    else {
        console.log("No timeblock array found in Local Storage")
        return false;
    }  
};

var createNewArray = function () {
    console.log("Generating New Array");

    //calculate the number of blocks to create based on the starting time
    //and the ending time specified in the global variables
    var end = DateTime.fromISO(endHour);
    var start = DateTime.fromISO(startHour);
    //uses luxon to get the difference in hours between the two datetime objects, then get the number of hours from obj.values.hours
    var numBlocks = (end.diff(start, 'hours')).values.hours;

    //creates 1 timeblock object for each timeslot and adds them to the savedTimeBlocks array
    for (i = 0; i < numBlocks + 1; i++) {
        //initializes an empty object
        var newObj = {};

        //creates a new time value by parsing the start hour and adding i hours
        newTime = DateTime.fromISO(startHour).plus({ hours: i });

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
            hour: '2-digit',
            hourCycle: 'h12'
        }).replace(" ", "");

        //adds the new id to the newObj
        newObj.id = newId;

        //sets a blank description to the newObj
        newObj.description = "";

        //adds the newObj to the array of savedTimeBlocks
        savedTimeBlocks.push(newObj);
    }
}

//creates a dom element for each item in the savedTimeBlocks array and adds it to the container
var createTimeChart = function(savedTimeBlocks) {
    for (i=0; i<savedTimeBlocks.length; i++){
        var timeBlockObj = savedTimeBlocks[i];
        createTimeBlock(timeBlockObj);
    }
};

//initializes the array of timeBlocks that will be created and eventually added to the DOM
var timeChartInit = function(savedTimeBlocks) {

    //if savedTimeBlocks is empty, create array of objects 
    if (savedTimeBlocks.length === 0) {
        createNewArray();
        saveTimeBlocks();
    }

    createTimeChart(savedTimeBlocks);
};

//handler for editing descriptions
var editHandler = function () {

    //creates input field
    inputField = $('<input>')
        .attr("type", "text")
        .addClass("form-control h-100 bg-transparent text-left");

    $(this).replaceWith(inputField);
};

var searchTimeBlocks = function () {

};

//handler for saving edits
var saveHandler = function () {
    //gets the ID of the parent container
    var parentId = $(this)
        .closest("div .time-block")
        .attr("id");

    var text = $("#"+parentId)
    .children("input")
    .val()
    .trim();

    var newDescription = $("<div>")
    .addClass("description col-5 col-sm-10 p-3")
    .text(text);
    
    parentContainer.children("input").replaceWith(newDescription);
};

// ------INITIALIZATIONS------
showCurrentDate();
loadTimeBlocks();
timeChartInit(savedTimeBlocks);

//ToDo: Add event listeners and handlers

timeBlockContainerEl.on("click", "div .description", editHandler);

timeBlockContainerEl.on("click", "div .saveBtn", saveHandler);

//search function to find an object with the matching ID value in the savedTimeBlocks array
//function obtained from https://stackoverflow.com/questions/8517089/js-search-in-object-values from user epascarello
// var searchTimeBlocks = function (arr, searchKey) {
//     return arr.filter(function(obj) {
//         return Object.keys(obj).some(function(key) {
//           return obj[key].includes(searchKey);
//         })
//       });
// }