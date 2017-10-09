import React, {Component, }        from 'react';
import d3           from 'd3';


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
        var percent =0;


        var scale = d3.scale.linear()
                            .domain([0, 100])
                            .range([1/4*Math.PI, 7/4*Math.PI])

        var color = ['#ec1561','#2a3a46','#202b33'];

        //This is the background arc
        var arc=d3.svg.arc()
                .innerRadius(this.state.innerRadius)
                .outerRadius(this.state.outerRadius)
                .startAngle(function(d){return scale(0)})
                .endAngle(function(d){return scale(100)});

        //The circle is following this
        var arcDummy=d3.svg.arc()
                .innerRadius((this.state.outerRadius-this.state.innerRadius)/2+this.state.innerRadius)
                .outerRadius((this.state.outerRadius-this.state.innerRadius)/2+this.state.innerRadius)
                .startAngle(function(d){return scale(0)})
                .endAngle(function(d){return scale(100)});



        var arcLine=d3.svg.arc()
                .innerRadius(this.state.innerRadius)
                .outerRadius(this.state.outerRadius)
                .startAngle(function(d){return scale(0)})

            var svg = d3.select("#chart")
                .append("svg")
                .attr({
                    width:this.state.width,
                    height:this.state.height,
                    class:'shadow'
                }).append('g')
                .attr({
                    transform:'translate('+this.state.width/2+','+this.state.height/2+')rotate(180)'
                });

                //background
        var path=svg.append('path')
                .attr({
                    d:arc
                })
                .style({
                    fill:color[1]
                });


        var pathForeground=svg.append('path')
                .datum({endAngle:(7/4)*Math.PI})
                .attr({
                    d:arcLine
                })
                .style({
                    fill:color[0]
                });

        //Dummy Arc for Circle
        var pathDummy=svg.append('path')
                .datum({endAngle:(7/4)*Math.PI})
                .attr({
                    d:arcDummy
                }).style({
                    fill:color[0]
                });


        var middleTextCount=svg.append('text')
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
                .style({
                    fill:'#ec1561',
                    'font-size':'40px'

                });


        var arcTweenOld=function(transition, percent,oldValue) {
            transition.attrTween("d", function (d) {

                var newAngle=scale(percent);

                var interpolate = d3.interpolate(d.endAngle, newAngle);

                var interpolateCount = d3.interpolate(oldValue, percent);
                return function (t) {
                    d.endAngle = interpolate(t);
                    var pathForegroundCircle = arcLine(d);

                    middleTextCount.text(Math.floor(interpolateCount(t))+'%')
                    .attr({transform: 'rotate(180)'});

                    var pathDummyCircle = arcDummy(d);
                    var coordinate = pathDummyCircle.split("L")[1].split("A")[0];

                    return pathForegroundCircle;
                    };
                });
            };

        var oldValue=100;

        var animate=function(){
            pathForeground.transition()
                    .duration(750)
                    .ease('cubic')
                    .call(arcTweenOld,percent,oldValue);

            oldValue=percent;
            percent=(Math.random() * 60) + 20;
            setTimeout(animate,3000);
        };

        setTimeout(animate,0);


}

    render() {

        return (
            <div id="chart" class="chart-container">
            </div>
    )
    }
}

export default GaugeJSX;
