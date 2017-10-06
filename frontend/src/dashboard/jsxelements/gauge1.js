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
        }
    }
    componentDidMount() {

        /*
            D3 functions cannot be called outside the React component cycle.
            Here we call these functions in componentDidMount() so that it loads
            on loading screen
        */
        var percent =0;

        /*
        This is the heart of D3.
        Here we select the div element from the render function (all the way down this file)
        And add to it a <svg> by doing .append. We select the size of it and then,
        we transform it.
        The translate moves the element from the left top corner to the center of the container
        The rotate returns the circle and put the starting point on the buttom
        */
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

        var color = ['#ec1561','#2a3a46','#202b33'];
        var colorSeq = d3.scaleSequential(d3ColorChrom.interpolateRdYlGn);

        //This is the background arc
        var arc=d3.arc()
                .innerRadius(this.state.innerRadius)
                .outerRadius(this.state.outerRadius)
                .startAngle(function(d){return scale(0)})
                .endAngle(function(d){return scale(100)});

        //The circle is following this
        var arcDummy=d3.arc()
                .innerRadius((this.state.outerRadius-this.state.innerRadius)/2+this.state.innerRadius)
                .outerRadius((this.state.outerRadius-this.state.innerRadius)/2+this.state.innerRadius)
                .startAngle(function(d){return scale(0)})
                .endAngle(function(d){return scale(100)});



        var arcLine=d3.arc()
                .innerRadius(this.state.innerRadius)
                .outerRadius(this.state.outerRadius)
                .startAngle(function(d){return scale(0)})



                //background

        /*
        On the path function, we create a line that will be drawn.
        Here, this line follows the arc defined above.
        d: means Draw.
        style is a function. It should scale the color with the % shown
        */
        var path = g.append('path')
                .style("fill", function(d) {return colorSeq(0.2)})
                .attr(
                    "d",arc
                )


        var pathForeground = g.append('path')
                .style("fill", function(d) {return colorSeq(0.2)})
                .datum("endAngle",(9/5)*Math.PI)
                .attr(
                    "d",arcLine
                )


        // // //Dummy Arc for Circle
        // var pathDummy=g.append('path')
        //         .style("fill", function(d) {return colorSeq(0.2)})
        //         .datum("endAngle",(9/5)*Math.PI)
        //         .attr(
        //             "d",arcDummy
        //         )


        var middleTextCount=g.append('text')
                .style("fill",'#ec1561')
                .style('font-size', '40px')
                .datum(0)
                .text(function(d){
                    return d+'%';
                })
                .attr({
                    class:'middleText',
                    'text-anchor':'middle',
                    dy:12,
                    dx:0
                })



        /*
        Here is the function that does the mecanics.
        */

        var arcTweenOld=function(transition, percent,oldValue) {

            transition.attrTween("d", function (d) {

                var newAngle=scale(percent);

                var interpolate = d3.interpolate(d.endAngle, newAngle);

                var interpolateCount = d3.interpolate(oldValue, percent);
                return function (t) {
                    d.endAngle = interpolate(t);
                    var pathForegroundCircle = arcLine(d);

                    middleTextCount.text(Math.floor(interpolateCount(t))+'%')
                    .attr("transform", 'rotate(180)');

                    // var pathDummyCircle = arcDummy(d);
                    // var coordinate = pathDummyCircle.split("L")[1].split("A")[0];


                    return pathForegroundCircle;
                    };
                });
            };

        var oldValue=0;

        var animate=function(){
            // pathForeground.transition()
            //         .duration(750)
            //         .ease('cubic')
            //         .call(arcTweenOld,percent,oldValue);
            oldValue=percent;
            percent=92;

        };

        setTimeout(animate,0);
        setTimeout(function() {
                    pathForeground.style({fill: color[0]});
                    animate();
                }, 760)


}

    render() {

        return (
            <div id="chart" class="chart-container">
            </div>
    )
    }
}

export default GaugeJSX;
