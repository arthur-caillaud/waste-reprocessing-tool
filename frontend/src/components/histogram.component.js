import React, {Component} from 'react';
import '../styles/histogram.css';
import * as d3 from 'd3';

function getChartSize(el) {
    var margin = {top: 40, right: 20, bottom: 40, left: 20};
    let width = parseInt(d3.select(el).style('width')) - margin.left - margin.right;
    let height = parseInt(d3.select(el).style('height')) - margin.top - margin.bottom;
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
        }];
        // We also save the previous state for dynamic transitions
        var old_valuesArray = valuesArray;
        var width = getChartSize("#"+this.props.id).width;
        var height = getChartSize("#"+this.props.id).height;
        var margin = {top: 20, right: 20, bottom: 40, left: 20};

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
        var g = svgDoc.append("g")
        .attr("transform", "translate(" + (width+ margin.left + margin.right)/2 + "," + (height + margin.top + margin.bottom)/2 + ")");

        var color = d3.scaleLinear()
            .domain([0, 33, 66, 100])
            .range(["red", "#CC5500", "#ED7F10", "green"]);

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
            .attr("fill", function(d) { return color(d.value); });
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
        <div>
            <h2 className="histogram-title">{this.props.title}</h2>
            <div className="histogram-container">
                <div id={this.props.id} className="chart-container"></div>
            </div>
        </div>
        );
    };
}

export default Histogram;
