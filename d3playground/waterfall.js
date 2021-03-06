// get the data
// put the data into mongo
// create a route
// put this into a template
// subscribe and make it work

var theData = {
  "vertical_axis_text": "Model Score",
  "upper_threshold_value": 1.6,
  "lower_threshold_value": -1.9,
  // "lowest_value_for_algorithm": -3.1,
  // "highest_value_for_algorithm": 3,
  "patient_values": [
    { "patient_id": "1234", "patient_label": "thisOne", "value": 2.6 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": 2.5 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": 2.1 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": 2 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": 1.8 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": 1.7 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": 1.6 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": 0.1 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": -0.4 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": -1.9 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": -2 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": -2.1 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": -2.1 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": -2.2 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": -2.4 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": -2.4 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": -2.55 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": -2.8 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": -3 },
    { "patient_id": "1234", "patient_label": "thisOne", "value": -3.1 },
  ],
  "colors": {
    "lower_than_threshold": "blue",
    "higher_than_threshold": "red",
    "between_thresholds": "blue"
  }
};

setTimeout(function () { // make sure DOM is there
  console.log("This will show after 500 milliseconds");

  var HEIGHT = 50;
  var WIDTH = 400;
  var LEFT_AXIS_WIDTH = 50;
  var VERTICAL_MARGIN = 10;
  var HORIZONTAL_MARGIN = 5;

  // make sure the patient_values are sorted
  theData.patient_values = theData.patient_values.sort(function (a, b) {
    return b.value - a.value;
  })

  // assume data is sorted; use values from algorithm if available
  // also assume
  var lowestValue = theData.lowest_value_for_algorithm
          || theData.patient_values[theData.patient_values.length - 1].value;
  var highestValue = theData.highest_value_for_algorithm
          || theData.patient_values[0].value;

  var valuesToPixel = d3.scale.linear()
                        .domain([highestValue, lowestValue])
                        .range([VERTICAL_MARGIN, HEIGHT - VERTICAL_MARGIN]);

  var indexToPixel = d3.scale.linear()
                        .domain([0, theData.patient_values.length])
                        .range([
                          LEFT_AXIS_WIDTH + HORIZONTAL_MARGIN
                          , WIDTH - HORIZONTAL_MARGIN
                        ]);

  // numbers to be on the left side, also where the tick marks are
  var leftAxisNumbers = valuesToPixel.ticks(5); // mind blown

  var svg = d3.select("#the_chart_id")
              .append("svg")
              .attr("width", WIDTH)
              .attr("height", HEIGHT)
              .selectAll("d"); // I have to do this to get it to work

  // show left axis title (ex. "Model Score")
  // "Model Score" = default
  svg.data([theData.vertical_axis_text || "Model Score"])
      .enter()
      .append("text")
      .text(function (dataValue) { return dataValue; })
      .attr("class", "anchor-middle")
      .attr("x", -(HEIGHT / 2))
      .attr("y", 20)
      .attr("transform", "rotate(-90)")
      .attr("cursor", "vertical-text"); // changes cursor on mouseover

  // left axis numbers
  svg.data(leftAxisNumbers).enter()
      .append("text")
      .text(function (dataValue) { return dataValue })
      .attr("class", "anchor-middle")
      .attr("dominant-baseline", "central") // centered vertically around (x, y)
      .attr("x", LEFT_AXIS_WIDTH - 15)
      .attr("y", valuesToPixel);

  // left axis tick marks
  svg.data(leftAxisNumbers).enter()
      .append("line")
      .attr("class", "axis")
      .attr("x1", LEFT_AXIS_WIDTH - 5).attr("x2", LEFT_AXIS_WIDTH)
      .attr("y1", valuesToPixel).attr("y2", valuesToPixel);

  // line right of tick marks (left axis)
  svg.data([0]).enter() // is there a better way to do this...
      .append("line")
      .attr("class", "axis")
      .attr("x1", LEFT_AXIS_WIDTH).attr("x2", LEFT_AXIS_WIDTH)
      .attr("y1", valuesToPixel(lowestValue))
      .attr("y2", valuesToPixel(highestValue));

  // bars on the plot
  var barWidth = (indexToPixel(1) - indexToPixel(0)) * .9;
  svg.data(theData.patient_values)
      .enter()
      .append("rect")
      .attr("x", function (object, index) {
        return indexToPixel(index);
      })
      .attr("y", function (object, index) {
        if (object.value < 0) {
          return valuesToPixel(0);
        } else {
          return valuesToPixel(object.value);
        }
      })
      .attr("width", barWidth)
      .attr("height", function (object, index) {
        if (object.value < 0) {
          return valuesToPixel(object.value) - valuesToPixel(0);
        } else {
          return valuesToPixel(0) - valuesToPixel(object.value);
        }
      })
      .attr("fill", function (object, index) {
        if (object.value >= theData.upper_threshold_value) {
          return "steelblue";
        } else if (object.value <= theData.lower_threshold_value) {
          return "#B97D4B";
        }
        return "lightgrey";
      })
      .on("mouseover", function (object, indext) {
        d3.select(this).style({ opacity: '0.7' });
      })
      .on("mouseleave", function (object, indext) {
        d3.select(this).style({ opacity: '1' });
      })
      .on("click", function (object, index) {
        window.location.assign("www.googe.com");// = "www.google.com";
      })
      .attr("cursor", "pointer"); // cursor looks like a link

  // threshold lines
  svg.data([
        // rest of code assumes order of largest to smallest
        theData.upper_threshold_value,
        (theData.upper_threshold_value + theData.lower_threshold_value) / 2,
        theData.lower_threshold_value
      ])
      .enter()
      .append("line")
      .attr("x1", LEFT_AXIS_WIDTH + HORIZONTAL_MARGIN)
      .attr("x2", WIDTH - HORIZONTAL_MARGIN)
      .attr("y1", valuesToPixel)
      .attr("y2", valuesToPixel)
      .attr("stroke-dasharray", function (object, index) {
        if (index === 1) { return "5, 10" }
        return "5, 5";
      });

}, 500);
