import React, { Component, } from 'react';
import '../styles/gauge.css';
import * as d3 from 'd3';
import * as d3ColorChrom from 'd3-scale-chromatic';


function getChartSize(el) {
        let width = parseInt(d3.select(el).style('width'));
        let height = parseInt(d3.select(el).style('height'));

        return  [width,height];
    }
class Gauge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 87,
            valueBefore: 90,
            width: 0,
            height: 0,
            id: props.id,
        }
    }

    handleResize() {
        var svgDoc = d3.select("svg")
            .attr("width", getChartSize("svg")[0])
            .attr("height", getChartSize("svg")[1])

    }

    drawJauge() {
        /*
        This is the place we initialize the value of this year's Liste Verte
        and last Year
        */
        var value = this.state.value;
        var valueBefore = this.state.valueBefore;
        var margin = {top: 20, right: 20, bottom: 50, left: 10},
            width = getChartSize("#"+this.props.id)[0] - margin.left - margin.right,
            height = getChartSize("#"+this.props.id)[1] - margin.top - margin.bottom;



        /*
        Here we select the div which id is chart and add to it a <svg>
        We also choose it's attributes
        */
        var svgDoc = d3.select("#"+this.props.id)
            .attr("align","center")
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        /*
        Then we append a <g> element and translate it to the middle of the <svg>
        */

        var g = svgDoc.append("g")
            .attr("transform", "translate(" + width/2 + "," + height/2 + ")rotate(180)"
             );

        //This FUNCTION permits to scale 0 to 100% onto a domain that represent the jauge.
        //Without it, the jauge goes from 0 to 100 in a full circle.
        var scale = d3.scaleLinear()
                            .domain([0, 100])
                            .range([1/5*Math.PI, 9/5*Math.PI])

        var color = d3.scaleLinear()
            .domain([0, 33, 66, 100])
            .range(["red", "#CC5500", "#ED7F10", "green"]);

        /*
        This is our data for both arcs.
        Inner and Outer radius are set manually, endAngle uses the value given
        and scale them in the domain selected
        */
        var data = [
            {
                innerRadius: (width/2) -22,
                outerRadius: (width/2) -10,
                startAngle: scale(0),
                endAngle: scale(value)
            },
            {
                innerRadius: (width/2) -30,
                outerRadius: (width/2)-24,
                startAngle: scale(0),
                endAngle: scale(valueBefore)
            }
        ]

        var middleTextCount=g.append('text')
                .style("fill",function (d) { return color(d); })
                .style('font-size', '40px')
                .datum(0)
                .attr("class",'middleText')
                .attr("text-anchor", 'middle')
                .attr("dy", 12)
                .attr("dx",0)
                .attr("transform", 'rotate(180)');

        var format = d3.format("d");
        var arc = d3.arc()

        /*
        Important part.
        g.selectAll will select all the arcs created
        Noticed no arcs were actually created before, because d3.arc() above just says that the variable arc
        is of type D3.arc
        Since we have two objects in data, the .data(data).enter().append("path") will automatically add a path object
        for each object in data, so here, two paths.
        These paths follow the class arc defined earlier.
        We define their inner and outer radius, but not starting and ending angle. If we did, we would have, on page opening,
        the two jauges already created, and then they would move, which is not what we want.

        The transition() part sets the movement.
        .attrTween means it's custom. "d" is the attribute we modify, it is "d" for draw. it means that we put the pen on the paper.
        second attribute must return a function of time (t). t ranges from 0 to 1, 0 being the beginning of transition, 1 the end.
        here we precise that we start with {startAngle: scale(0), endAngle: scale(0)} and want to end with d, which
        takes it's value in data, following the start variable's model
        d3.interpolate does exactly what it says, it continuously interpolate start and end. arc(interpolate) makes the path follow arc.
        */
        g.selectAll("path.arc")
            .data(data)
            .enter().append("path")
                .attr("innerRadius", function(d) {return d.innerRadius})
                .attr("outerRadius", function(d) {return d.outerRadius})

                .attr("class", arc)
                .transition().duration(2500)
                .attrTween("d", function(d) {
                    var start = {startAngle: scale(0), endAngle: scale(0)};
                    var interpolate = d3.interpolate(start, d)
                    return function (t) {
                        return arc(interpolate(t));
                    };
                })
                .styleTween("fill", function() {
                    return function(t) {
                        return color(t*value)
                    }
                  })



        middleTextCount
          .transition()
            .duration(2500)
            .on("start", function () {
              d3.active(this)
                  .tween("text", function() {
                    var that = d3.select(this),
                        i = d3.interpolateNumber(that.text().replace(/,/g, ""), value);
                    return function(t) { that.text(format(i(t))); };
                  })
                  .styleTween("fill", function() {
                      return function(t) {
                          return color(t*value)
                      }
                    })


            });
    }

    redrawJauge() {
        d3.select("#"+this.props.id).select("svg").remove("svg")
        this.drawJauge();
    };

    componentDidMount() {
        window.addEventListener('resize',this.handleResize)
        this.drawJauge()

    };

    componentDidUpdate() {

        this.handleResize();
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

      render() {
        return (
            <div className="jauge-container">
                <h2>{this.props.title}</h2>
            <div id={this.props.id} className="chart-container"></div>

          </div>
      )

      }
}

export default Gauge;
