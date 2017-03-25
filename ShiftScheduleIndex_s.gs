//
// CONSTRUCTOR object
// Provide an ordered access point for the primary index (employee) for the schedule
//
function ShiftScheduleIndex(shiftSchedule) {
  this.employees = [];
  if (shiftSchedule !== undefined) {
    for (e in shiftSchedule.employees) {
      if (shiftSchedule.employees.hasOwnProperty(e)) {
        this.employees[this.employees.length] = e;
      }
    }
    this.employees.sort();
  }
}
