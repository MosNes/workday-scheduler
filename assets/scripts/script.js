//Time Block Reference HTML
/* <div class="time-block w-100 row d-flex flex-nowrap flex-row justify-content-between">
        <div class="hour col-2 col-lg-1 p-3">Test hour</div>
        <div class="description col-5 col-sm-10 p-3">Test 1</div>
        <div class="save-container col-2 col-sm-2 col-md-1 col-lg-1">
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

//sets the starting hour for the workday in 24hr format, can be edited to change the number of timeblocks on the scheduler page
const startHour = "07:00";

//sets the ending hour for the workday in 24hr format, can be edited to change the number of timeblocks on the scheduler page
const endHour = "18:00";

//JQuery template for a blank timeBlock element
var timeBlockEl = $("<div>").addClass("time-block w-100 row d-flex flex-nowrap flex-row justify-content-between").html('<div class="hour col-2 col-lg-1 p-3">Test hour</div><div class="description col-5 col-sm-10 p-3"><p>Test 1</p></div><div class="save-container col-2 col-sm-2 col-md-1 col-lg-1"><button class="btn saveBtn w-100 h-100"><i class="fa-solid fa-floppy-disk"></i></button>');

//placeholder for the array of timeBlock objects to be saved to localStorage
var savedTimeBlocks = [];

// ------FUNCTIONS------

//updates the currentDay element on the page to display the current date and time
var showCurrentDate = function () {
    //updates current when called
    todaysDate = DateTime.now();
    //displays current time in the currentDay element
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
    newTimeBlockEl.children(".description").children("p").text(timeBlockObj.description);

    //sets the background color based on whether the timeslot comes before, during, or after the current time
    var comparedTime = DateTime.fromISO(timeBlockObj.timeSlot);
    if (comparedTime.startOf('hour') < todaysDate.startOf('hour')) {
        newTimeBlockEl.addClass('past');
    }
    else if (comparedTime.startOf('hour') > todaysDate.startOf('hour')) {
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
    //adds timeslot text to the div element with hour class
    newTimeBlockEl.children(".hour").text(displayTime);
    //appends the new timeBlock element to the timeBlockContainer element
    timeBlockContainerEl.append(newTimeBlockEl);
};

//saves the savedTimeBlocks array to local storage
var saveTimeBlocks = function () {
    var localArray = JSON.stringify(savedTimeBlocks);
    localStorage.setItem('savedTimeBlocks', localArray);
    console.log("Saved changes to Local Storage");
};

//loads the savedTimeblocks array from local storage
//if no array exists in local storage, returns false
var loadTimeBlocks = function () {
    var localArray = JSON.parse(localStorage.getItem('savedTimeBlocks'));
    if (localArray) {
        console.log("Loaded timeBlock array from Local Storage");
        savedTimeBlocks = localArray;
        return true;
    }
    else {
        console.log("No timeBlock array found in Local Storage")
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
        });
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
var createTimeChart = function (savedTimeBlocks) {
    for (i = 0; i < savedTimeBlocks.length; i++) {
        var timeBlockObj = savedTimeBlocks[i];
        createTimeBlock(timeBlockObj);
    }
};

//initializes the array of timeBlocks that will be created and eventually added to the page
var timeChartInit = function (savedTimeBlocks) {

    //if savedTimeBlocks is empty, create array of placeholder objects 
    if (savedTimeBlocks.length === 0) {
        createNewArray();
        saveTimeBlocks();
    }
    //create elements from array and append them to the page
    createTimeChart(savedTimeBlocks);
};

//handler for editing descriptions
var editHandler = function () {

    //get text from description if present
    var text = $(this).children("p").text();

    //creates input field and adds text from description
    inputField = $('<textarea>')
        .attr("type", "text")
        .val(text)
        .addClass("form-control h-100 bg-transparent text-left");

    //replaces the description field with an input field
    $(this).children("p").replaceWith(inputField);
};

// searches the savedTimeBlocks array for the an object with the inputted Id and returns the index of that object
var searchTimeBlocks = function (inputId) {
    var index = savedTimeBlocks.findIndex(block => block.id === inputId);
    return index;
};

//handler for saving edits
var saveHandler = function () {
    //gets the ID of the parent container
    var parentId = $(this)
        .closest("div .time-block")
        .attr("id");

    console.log(parentId);

    //get the text input from the input field and trim whitespace
    var text = $("#" + parentId)
        .children(".description")
        .children("textarea")
        .val()
        .trim();

    //get index of the object in the savedTimeBlocks array that matches the parent Id
    var index = searchTimeBlocks(parentId);

    //update the description property of that object and save the updated array to local storage
    savedTimeBlocks[index].description = text;
    saveTimeBlocks();

    //create a new element with the description text
    var newDescriptionEl = $("<div>").addClass("description col-5 col-sm-10 p-3");

    var newPEl = $("<p>").text(text);

    newDescriptionEl.append(newPEl);

    //replace the input element with the new description element
    $("#" + parentId)
        .children(".description")
        .replaceWith(newDescriptionEl);
};

// ------INITIALIZATIONS------
showCurrentDate();
loadTimeBlocks();
timeChartInit(savedTimeBlocks);

//event listener for description clicks
timeBlockContainerEl.on("click", "div .description", editHandler);

//event listener for save button clicks
timeBlockContainerEl.on("click", "div .saveBtn", saveHandler);

//updates the date and time at the top of the page every minute
intervalId = setInterval(showCurrentDate, 60000);


//unused search function to find an object with the matching ID value in the savedTimeBlocks array
//function obtained from https://stackoverflow.com/questions/8517089/js-search-in-object-values from user epascarello
// var searchTimeBlocks = function (arr, searchKey) {
//     return arr.filter(function(obj) {
//         return Object.keys(obj).some(function(key) {
//           return obj[key].includes(searchKey);
//         })
//       });
// }