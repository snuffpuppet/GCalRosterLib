// Constructor for parser object containing all the info (or warnings) we need to process the event
// Inputs:
//   event - Google Calendar event
//   (optional) timeSplit - 
// Properties:
//   isValid: boolean - is it a valid event, if not, only this and 'warning' can be relied upon
//   warning : explanation if event is found to be unsound of mind
//   
function ShiftEventParser(event)
{
  this.warning = "";
  this.isValid = true;
  this.employee = "";
  this.shiftBreak = 0;
  this.startTime = null;
  this.endTime = null;
  this.shiftDuration = 0;
  //this.payrollSplit = new PayrollSplit();
  
  var eventTitle = event.getTitle();
    
  if (event.isAllDayEvent()) {
    this.warning = "WARNING: found all day event '" + eventTitle + "' - ignoring";
    this.isValid = false;
    return;
  }
    
  this.startTime = event.getStartTime();
  this.endTime = event.getEndTime();
  var eventStartDate = this.startTime.getDate() + "/" + this.startTime.getMonth();
  var eventEndDate = this.endTime.getDate() + "/" + this.endTime.getMonth();
  if (eventStartDate != eventEndDate) {
    this.warning = "WARNING: '" + eventTitle + "' on " + eventStartDate + " has different start and end dates - ignoring";
    this.isValid = false;
    return;
  }
    
  var employeeNameRegex = /^\s*([^ (]*).*/
  var breakRegex = /^\s*[^ (]*\s*\((\d*)\).*/
    
  var nameDetails = employeeNameRegex.exec(eventTitle);
  if (nameDetails == null) {
    this.warning = "WARNING: '" + eventTitle + "' on " + eventStartDate + " has unusable format - ignoring";
    this.isValid = false;
    return;
  }
  
  this.employee = nameDetails[1];
  var breakDetails = breakRegex.exec(eventTitle);
  this.shiftBreak = 0;
  if (breakDetails != null) {
    this.shiftBreak = parseInt(breakDetails[1]) / 60; // in hours
  }
 
  this.shiftDuration = (this.endTime - this.startTime) / 60 / 60 / 1000;
  //this.payrollSplit.addShift(this.startTime, this.endTime);
}