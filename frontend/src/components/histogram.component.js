import React, {Component} from 'react';
import '../styles/histogram.css';
import * as d3 from 'd3';
import * as d3tip from 'd3-tip';

function getChartSize(el) {
    var margin = {top: 40, right: 40, bottom: 40, left: 40};
    let width = parseInt(d3.select(el).style('width')) - margin.left - margin.right;
    let height = parseInt(d3.select(el).style('height')) - margin.top - margin.bottom;
    return  ({
        width: width,
        height: height
    });
};

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

class Histogram extends Component {
    // valuesArray is an array of JS objects defined as {title: 'title', keys: ['key1','key2','key3',...], values: [value1,value2,value3,...]}
    // each object in valuesArray is stack of N columns labelled with Object.title
    valuesArray = [{
        title: 'Taux de valorisation global',
        keys: ['VEOLIA','GLOBAL','REGIONAL'],
        values: [78,82,73]
    },{
        title: 'Fer et acier',
        keys: ['VEOLIA','GLOBAL','REGIONAL'],
        values: [54,65,43]
    },{
        title: 'Carton',
        keys: ['VEOLIA','GLOBAL','REGIONAL'],
        values: [90,95,86]
    },{
        title: "Aluminium",
        keys: ['VEOLIA','GLOBAL','REGIONAL'],
        values: [10,65,90]
    }];

    toNullArray(valuesArray){
        return valuesArray.map(bundle => {
            let nullBundle = clone(bundle);
            nullBundle.values = [0,0,0];
            return nullBundle;
        })
    }
    __initHistogram(data) {
        const histogramTitle = this.props.title;
        const nullData = this.toNullArray(data);
        // We also save the previous state for dynamic transitions

        const width = getChartSize("#"+this.props.id).width;
        const height = getChartSize("#"+this.props.id).height;
        const margin = {top: 40, right: 40, bottom: 40, left: 40};

        /*
        Here we select the div which id is chart and add to it a <svg>
        We also choose it's attributes
        */
        let svgDoc = d3.select("#"+this.props.id)
            .attr("align","center")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        /*
        Then we append a <g> element and translate it to the middle of the <svg>
        */
        let g = svgDoc.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //We are adding the tips shown on :hover
        var tip = d3tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Taux de valorisation</strong> <span style='color:red'>" + d.value + "%</span>";
        });
        svgDoc.call(tip);

        /*
        Building axis
        */

        let x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

        let x1 = d3.scaleBand()
        .padding(0.05);

        let y = d3.scaleLinear()
        .rangeRound([height, 0]);

        let z = d3.scaleOrdinal()
        .range(["#69FFFA", "#54E8B9", "#5CFF9E", "#54C6E8", "#5CAEFF", "#43E8B0", "#49FF8E"]);

        let bundleLabels = data.map(bundle => {
            return bundle.title;
        });

        const keys = data[0].keys;

        x0.domain(data.map(d => {
            return d.title;
        }));

        x1.domain(keys).rangeRound([0, x0.bandwidth()]);

        y.domain([0,100]).nice();

        //Creating empty collumn bundles
        g.append('g')
        .selectAll('g')
        .data(nullData)
        .enter()
            .append('g')
            .attr("transform", d => { return "translate(" + x0(d.title) + ",0)"; })
        .selectAll('rect') //Creating each individual column
        .data(d => {
            return keys.map((key,index) => {
                return ({
                    key: key,
                    value: d.values[index]
                });
            })
        })
        .enter()
            .append('rect')
            .attr("x", function(d) { return x1(d.key); })
            .attr("y", function(d) { return y(d.value); })
            .attr("width", x1.bandwidth())
            .attr("height", function(d) { return height - y(d.value); })
            .attr("fill", function(d) { return z(d.key); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        //Transition to make column appear from bottom with their real values
        g.select("g").selectAll("g")
            .data(data)
            .selectAll('rect')
            .data(d => {
                return keys.map((key,index) => {
                    return ({
                        key: key,
                        value: d.values[index]
                    });
                })
            })
            .transition().duration(1500)
            .attr("y", d => { console.log(d); return y(d.value); })
            .attr("height", d => { return (height - y(d.value)); });

        //Adding legend to the graph
        let legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
          .selectAll("g")
          .data(keys)
          .enter().append("g")
            .attr("transform", (d, i) => { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32vw")
            .text(function(d) { return d; });

        //Adding x-axis to graph
        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x0));

        //Adding y-axis to graph
        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
                .attr("x", 2)
                .attr("y", y(y.ticks().pop()) + 0.5)
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr("text-anchor", "start")
                .text("Taux de valorisation (%)");
    };

    redrawHistogram() {
        d3.select("#"+this.props.id).select("svg").remove("svg")
        this.drawHistogram(this.valuesArray);
    };

    componentDidMount() {
        this.__initHistogram(this.valuesArray);
    };

    componentDidUpdate() {
        this.redrawHistogram(this.valuesArray);
    };

    render() {
        return (
        <div id="histogram-container">
            <div id={this.props.id} className="chart-container"></div>
        </div>
        );
    };
}

export default Histogram;
