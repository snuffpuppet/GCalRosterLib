//
// CONSTRUCTOR object
//
// Split a shift running between startTime and endTime into pay bands
// In this case they are 12:00am -> 7:00am, 7:00am -> 19:00pm, 19:00pm->12:00am
// shifts may span these bands arbitrarily so the algorithm must split appropriately
//

function PayrollSplit() {
  this.periods = [
    {start: 0, end: 7, shift: 0},   // 00:00 to 07:00
    {start: 7, end: 19, shift: 0},  // 07:00 to 19:00
    {start: 19, end: 24, shift: 0}  // 19:00 to 24:00
  ];
}

PayrollSplit.prototype.addShift = function(startTime, endTime) {
  var shiftStart = startTime.getHours() + startTime.getMinutes() / 60;
  var shiftEnd = endTime.getHours() + endTime.getMinutes() / 60;
  
  for (var i=0; i< this.periods.length; i++) {
    if (shiftStart >= this.periods[i].start && shiftStart <= this.periods[i].end) {
      // start time is within this band
      if (shiftEnd <= this.periods[i].end) {
        // the whole shift is in this band
        this.periods[i].shift += shiftEnd - shiftStart;
      }
      else {
        // endTime is larger than the end of this split, calculate part of shift
        this.periods[i].shift += this.periods[i].end - shiftStart;
      }
    }
    else if (shiftStart < this.periods[i].start && shiftEnd > this.periods[i].start) {
      // start time is before this band and end time is after the start of this band
      if (shiftEnd > this.periods[i].end) {
        // shift spans entire length of band
        this.periods[i].shift += this.periods[i].end - this.periods[i].start;
      }
      else {
        // start time is before this band and end time is within the band
        this.periods[i].shift += shiftEnd - this.periods[i].start;
      }
    }
    else {
      // shift is not in this band
    }
  }
}

