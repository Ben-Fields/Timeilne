/*######  Date Manipulation  ######*/
var setDatePart = function(dateobj, date) {
	dateobj.setUTCFullYear(date.getFullYear());
	dateobj.setUTCDate(date.getDate());
	dateobj.setUTCMonth(date.getMonth());
}
var setTimePart = function(dateobj, time) {
	dateobj.setUTCHours(date.getHours());
	dateobj.setUTCMinutes(date.getMinutes());
	dateobj.setUTCSeconds(date.getSeconds());
	dateobj.setUTCMilliseconds(date.getMilliseconds());
}
