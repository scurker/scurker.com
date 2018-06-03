var currentYear;

module.exports = function(date) {
  var year = date.getFullYear();
  if(year !== currentYear) {
    currentYear = year;
    return `<li class="year">${year}</li>`;
  }
};