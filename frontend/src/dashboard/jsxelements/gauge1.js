import React, {Component, }        from 'react';
import * as d3 from 'd3';
import * as d3ColorChrom from 'd3-scale-chromatic';

/*
    This file is going to be fully commented for understanding purposes.
*/

class GaugeJSX extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: props.width,
            height: props.height,
            outerRadius: (props.width/2)-10,
            innerRadius:(props.width/2)-22,
            value: props.value,
        }
    }
    componentDidMount() {

        var percent =[50, 100];


        var svgDoc = d3.select("#chart")
            .append("svg")
            .attr("width", this.state.width)
            .attr("height", this.state.height)
            .attr("class", "shadow")

        var g = svgDoc.append("g")
            .attr("transform", "translate("+this.state.width/2+","+this.state.height/2+")rotate(180)"
             );

        //This FUNCTION permits to scale 0 to 100% onto a domain that represent the jauge.
        //Without it, the jauge goes from 0 to 100 in a full circle.
        var scale = d3.scaleLinear()
                            .domain([0, 100])
                            .range([1/5*Math.PI, 9/5*Math.PI])

        var color = d3.scaleLinear()
            .domain([0, 33, 66, 100])
            .range(["red", "#CC5500", "#ED7F10", "green"]);
//

//
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
                .startAngle(scale(0))
                .endAngle(scale(100))
                .innerRadius((this.state.width/2) -22)
                .outerRadius((this.state.width/2)-10)


        g.selectAll("path")
            .data(percent)
            .enter().append("path")
            .attr("d", arc)


        middleTextCount
          .transition()
            .duration(2500)
            .on("start", function () {
              d3.active(this)
                  .tween("text", function() {
                    var that = d3.select(this),
                        i = d3.interpolateNumber(that.text().replace(/,/g, ""), percent[1]);
                    return function(t) { that.text(format(i(t))); };
                  })
                  .styleTween("fill", function() {
                      return function(t) {
                          return color(t*percent[1])
                      }
                    })


            });


}

    render() {

        return (
            <div id="chart" class="chart-container">
            </div>
    )
    }
}

export default GaugeJSX;
