function WorkDay(date) {
  this.date = null;
  this.totalHours = 0;
  this.unpaid = 0;
  this.payrollSplit = new PayrollSplit();
  if (date !== undefined) {
    this.date = date.getDate() + "/" + date.getMonth()+1;
  }
}

WorkDay.prototype.addShift = function(shiftDetails) {
  this.unpaid += shiftDetails.shiftBreak;
  this.totalHours += shiftDetails.shiftDuration;
  this.payrollSplit.addShift(shiftDetails.startTime, shiftDetails.endTime);
}
  