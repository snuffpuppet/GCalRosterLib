//
// a CONSTRUCTOR object that represents pay schedules for employees pulled from the
// calendar evenets passed in
//
// INPUTS: CalendarEvent[]
//
// PROPERTIES:
//   employees:
//     - .{employee}.total (# hours worked)
//     - .{employee}.

function ShiftSchedule(scheduleStart, scheduleEnd, calendarEvents) {
  this.employees = {};
  this.warnings = [];
  this.numEmployees = 0;
  if (calendarEvents != null) {
    this.addEvents(scheduleStart, scheduleEnd, calendarEvents);
  }
}

ShiftSchedule.prototype.addEvents = function(scheduleStart, scheduleEnd, calendarEvents) {
  var scheduleDays = (scheduleEnd - scheduleStart) / 24 / 60 / 60 / 1000;
  
  for (var eventIndex=0; eventIndex < calendarEvents.length; eventIndex++) {
    var event = calendarEvents[eventIndex];
    var eventDetails = new ShiftEventParser(event);
    if (eventDetails.isValid) {
      // consistency checking done, now we can treat the data as clean
      var shiftDuration = eventDetails.shiftDuration;
      var shiftEmployee = eventDetails.employee;
      var shiftUnpaid = eventDetails.shiftBreak; // unpaid in hours
      var shiftPaid = Math.round((shiftDuration - shiftUnpaid) *100)/100; // round to 2 decimals
      var shiftDay = Math.floor((eventDetails.startTime - scheduleStart) / 24 / 60 / 60 / 1000);
      
      if (this.employees[shiftEmployee] === undefined) {
        this.employees[shiftEmployee] = {};
        this.employees[shiftEmployee].totalHours = 0;
        this.employees[shiftEmployee].day = [];
        for (i=0; i<scheduleDays; i++) {
          var pday = new Date(scheduleStart.getTime() + i * 24 * 60 * 60 * 1000);
          this.employees[shiftEmployee].day[i] = new WorkDay(pday)
            //{date: pday.getDate() + "/" + pday.getMonth()+1, split: null, totalHours: 0, unpaid: 0};
        }
        this.numEmployees++;
      }
      this.employees[shiftEmployee].totalHours += shiftDuration;
      this.employees[shiftEmployee].day[shiftDay].addShift(eventDetails); // WorkDay.addShift()
    }
    else {
      this.warnings[this.warnings.length] = eventDetails.warning;
    }
  }
}

