import React, {Component} from 'react';
import '../styles/histogram.css';
import * as d3 from 'd3';

function getChartSize(el) {
    var margin = {top: 40, right: 40, bottom: 40, left: 40};
    let width = parseInt(d3.select(el).style('width')) - margin.left - margin.right;
    console.log("width",width);
    let height = parseInt(d3.select(el).style('height')) - margin.top - margin.bottom;
    console.log("height",height);
    return  ({
        width: width,
        height: height
    });
};

class Histogram extends Component {

    drawHistogram() {
        var histogramTitle = this.props.title;
        // valuesArray is an array of JS objects defined as {title: 'title', keys: ['key1','key2','key3',...], values: [value1,value2,value3,...]}
        // each object in valuesArray is stack of N columns labelled with Object.title
        var valuesArray = [{
            title: 'Taux de valorisation',
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
            values: [10,65,66]
        }];
        // We also save the previous state for dynamic transitions
        var old_valuesArray = valuesArray;
        var width = getChartSize("#"+this.props.id).width;
        var height = getChartSize("#"+this.props.id).height;
        var margin = {top: 40, right: 40, bottom: 40, left: 40};

        /*
        Here we select the div which id is chart and add to it a <svg>
        We also choose it's attributes
        */
        var svgDoc = d3.select("#"+this.props.id)
            .attr("align","center")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        /*
        Then we append a <g> element and translate it to the middle of the <svg>
        */
        var g = svgDoc.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        /*
        Building axis
        */

        var x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

        var x1 = d3.scaleBand()
        .padding(0.05);

        var y = d3.scaleLinear()
        .rangeRound([height, 0]);

        var z = d3.scaleOrdinal()
        .range(["#3E87B2", "#FFFB19", "#ff8c00", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var bundleLabels = valuesArray.map(bundle => {
            return bundle.title;
        });

        var keys = valuesArray[0].keys;

        x0.domain(valuesArray.map(d => {
            return d.title;
        }));

        x1.domain(keys).rangeRound([0, x0.bandwidth()]);

        y.domain([0,100]).nice();

        //Creating collumn bundles
        g.append('g')
        .selectAll('g')
        .data(valuesArray)
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
            .attr("fill", function(d) { return z(d.key); });

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x0));

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

        var legend = g.append("g")
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
    };

    redrawHistogram() {
        d3.select("#"+this.props.id).select("svg").remove("svg")
        this.drawHistogram();
    };

    componentDidMount() {
        this.drawHistogram()
    };

    componentDidUpdate() {
        this.redrawHistogram();
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
