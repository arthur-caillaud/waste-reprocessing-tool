import React, { Component, } from 'react';
import '../styles/gauge.css';
import * as d3 from 'd3';
import { connect } from "react-redux"
import * as actions from '../actions'



function getChartSize(el) {
    var margin = {top: 40, right: 20, bottom: 40, left: 20};
    let width = parseInt(d3.select(el).style('width')) - margin.left - margin.right;
    let height = parseInt(d3.select(el).style('height')) - margin.top - margin.bottom;
    return  [width,height];
    }

var valueAnteG = 0;
var valueBeforeAnteG = 0;


class LeftGauged3 extends Component {

    drawJauge() {
        /*
        This is the place we initialize the value of this year's Liste Verte
        and last Year
        */


        var leftvalue = this.props.leftvalue;
        var leftvalueBefore = this.props.leftvalueBefore;
        var leftvalueAnte = this.props.leftvalueAnte;
        var leftvalueBeforeAnte = this.props.leftvalueBeforeAnte;
        var margin = {top: 20, right: 20, bottom: 40, left: 20};
        var width = getChartSize("#"+this.props.id)[0];
        var height = getChartSize("#"+this.props.id)[1];
        /*
        Here we just save previous state
        */
        valueAnteG = this.props.leftvalue
        valueBeforeAnteG = this.props.leftvalueBefore



        /*
        Here we select the div which id is chart and add to it a <svg>
        We also choose it's attributes
        */
        var svgDoc = d3.select("#"+this.props.id)
            .attr("align","center")
            .append("svg")
            .attr("width", width+ margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

        /*
        Then we append a <g> element and translate it to the middle of the <svg>
        */

        var g = svgDoc.append("g")
            .attr("transform", "translate(" + (width+ margin.left + margin.right)/2 + "," + (height + margin.top + margin.bottom)/2 + ")rotate(180)"
             );

        //This FUNCTION permits to scale 0 to 100% onto a domain that represent the gauge.
        //Without it, the gauge goes from 0 to 100 in a full circle.
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
                innerRadius: (width/2) - margin.top - 15,
                outerRadius: (width/2)- margin.top,
                startAngle: scale(0),
                endAngle: scale(leftvalue),
                valueAnte: scale(leftvalueAnte)
            },
            {
                innerRadius: (width/2) -margin.top-10 - margin.bottom/2,
                outerRadius: (width/2)-margin.top - margin.bottom/2,
                startAngle: scale(0),
                endAngle: scale(leftvalueBefore),
                valueAnte: scale(leftvalueBeforeAnte)
            }
        ]

        var middleTextCount=g.append('text')
                .style("fill",function (d) { return color(d); })
                .style('font-size', '6vmin')
                .datum(0)
                .attr("class",'middleText')
                .attr("text-anchor", 'middle')
                .attr("dy", 12)
                .attr("dx",0)
                .attr("transform", 'rotate(180)');

        var format = d3.format("d");
        var arc = d3.arc()

        var percentage = g.append('text')
                .style("fill", function (d) { return color(d); })
                .style('font-size', '1.5vmin')
                .attr('text-anchor', 'middle')
                .attr('dx', -28)
                .attr('dy', -3)
        /*
        Important part.
        g.selectAll will select all the arcs created
        Noticed no arcs were actually created before, because d3.arc() above just says that the variable arc
        is of type D3.arc
        Since we have two objects in data, the .data(data).enter().append("path") will automatically add a path object
        for each object in data, so here, two paths.
        These paths follow the class arc defined earlier.
        We define their inner and outer radius, but not starting and ending angle. If we did, we would have, on page opening,
        the two gauges already created, and then they would move, which is not what we want.

        The transition() part sets the movement.
        .attrTween means it's custom. "d" is the attribute we modify, it is "d" for draw. it means that we put the pen on the paper.
        second attribute must return a function of time (t). t ranges from 0 to 1, 0 being the beginning of transition, 1 the end.
        here we precise that we start with {startAngle: scale(0), endAngle: scale(0)} and want to end with d, which
        takes it's value in data, following the start variable's model
        d3.interpolate does exactly what it says, it continuously interpolate start and end. arc(interpolate) makes the path follow arc.
        */


        function doTransition() {
            g.selectAll("path.arc")
                .data(data)
                .enter().append("path")
                    .attr("innerRadius", function(d) {return d.innerRadius})
                    .attr("outerRadius", function(d) {return d.outerRadius})
                    .attr("startAngle", scale(0))
                    .attr("endAngle", scale(0))

                    .attr("class", arc)
                    .transition().duration(2500)
                    .attrTween("d", function(d) {

                        var start = {startAngle: scale(0), endAngle: d.valueAnte};

                        var interpolate = d3.interpolate(start, d)
                        return function (t) {
                            return arc(interpolate(t));
                        };
                    })
                    .styleTween("fill", function() {
                        var interpolate = d3.interpolateRgb(color(leftvalueAnte), color(leftvalue))
                        return function(t) {
                            return interpolate(t)
                        }
                      })

            middleTextCount
              .transition()
                .duration(2500)
                .on("start", function () {
                  d3.active(this)
                      .tween("text", function() {
                        var that = d3.select(this),
                            i = d3.interpolateNumber(leftvalueAnte, leftvalue);
                        return function(t) { that.text(format(i(t))); };
                      })
                      .styleTween("fill", function() {
                          var interpolate = d3.interpolateRgb(color(leftvalueAnte), color(leftvalue))
                          return function(t) {
                              return interpolate(t)
                          }
                        })
                });
            percentage
              .transition()
                  .duration(2500)
                  .on("start", function() {
                      d3.active(this)
                        .tween("text", function(){
                            var that = d3.select(this);
                            return function(t) {that.text('%')}
                        })
                        .styleTween("fill", function() {
                            var interpolate = d3.interpolateRgb(color(leftvalueAnte), color(leftvalue))
                            return function(t) {
                                return interpolate(t)
                            }
                          })
                    })
            }

        doTransition()
    }

    redrawJauge() {

        d3.select("#"+this.props.id).select("svg").remove("svg")
        this.drawJauge();
    };

    componentDidMount() {

        this.drawJauge()


    };


    componentDidUpdate() {
        this.redrawJauge();

    };


    render() {

        return (
            <div className="gauge-container">
                <h2 className="gauge-title">Valorisation Liste Verte</h2>
            <div id={this.props.id} className="chart-container"></div>

          </div>
      )

  };
}

function mapStateToProps(state) {
    return {
        leftvalue: state.updateGauge.leftvalue,
        leftvalueBefore: state.updateGauge.leftvalueBefore,
        leftvalueAnte: state.updateGauge.leftvalueAnte,
        leftvalueBeforeAnte: state.updateGauge.leftvalueBeforeAnte

    }
};

function mapDispatchToProps(dispatch) {
    return {showMoreInfos: () => dispatch(actions.displayLeftGaugeInfos())

    }
};

const LeftGauge = ({showMoreInfos, leftvalue, leftvalueBefore, leftvalueBeforeAnte, leftvalueAnte}) => {
    return(
        <div onClick={showMoreInfos}>
            <LeftGauged3 id="leftgauge" leftvalue={leftvalue} leftvalueBefore={leftvalueBefore} leftvalueAnte={leftvalueAnte} leftvalueBeforeAnte={leftvalueBeforeAnte}/>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftGauge);
