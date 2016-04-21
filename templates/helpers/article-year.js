'use strict';

var currentYear;

module.exports = function(date) {
  var year = date.getFullYear();
  if(year !== currentYear) {
    currentYear = year;
    return '<h3 class="year"><span>' + year + '</span></h3>';
  }
};