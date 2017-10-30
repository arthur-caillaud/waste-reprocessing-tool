import React, {Component} from 'react';
import '../styles/histogram.css';
import * as d3 from 'd3';
import * as d3tip from 'd3-tip';

import Loading from '../resources/Rolling.gif';

function getChartSize(el) {
    var margin = {top: 40, right: 40, bottom: 40, left: 40};
    let width = parseInt(d3.select(el).style('width'), 10) - margin.left - margin.right;
    let height = parseInt(d3.select(el).style('height'), 10) - margin.top - margin.bottom;
    return  ({
        width: width,
        height: height
    });
};

function clone(obj) {
    if (null == obj || "object" !== typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

export default class Histogram extends Component {
    // valuesArray is an array of JS objects defined as {title: 'title', keys: ['key1','key2','key3',...], values: [value1,value2,value3,...]}
    // each object in valuesArray is stack of N columns labelled with Object.title

    toNullArray(valuesArray){
        return valuesArray.map(bundle => {
            let nullBundle = clone(bundle);
            nullBundle.values = nullBundle.values.map(int => {return 0})
            return nullBundle;
        })
    }
    __initHistogram(data) {

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
            return ("<div><div><strong>"+
            d.key+
            "</strong></div>"+
            "<div>Taux de valorisation <span style='color:red'>" + d.value + "%</span></div>"+
            "<div>Volume traité <span style='color:red'>" + d.volume + "t</span></div></div>"
        )});
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
        .range(["first-rect", "second-rect", "third-rect","fourth-rect","fifth-rect","sixth-rect","seventh-rect","heigth-rect","ninth-rect"]);



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
                    value: d.values[index],
                    volume: d.volumes[index]
                });
            })
        })
        .enter()
            .append('rect')
            .classed('hist-bar',true)
            .attr("x", function(d) { return x1(d.key); })
            .attr("y", function(d) { return y(d.value); })
            .attr("width", x1.bandwidth())
            .attr("height", function(d) { return height - y(d.value); })
            .attr("class", function(d) { return z(d.key); })
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
                        value: d.values[index],
                        volume: d.volumes[index]
                    });
                })
            })
            .transition().duration(1500)
            .attr("y", d => { return y(d.value); })
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
            .attr("x", width)
            .attr("y", -40)
            .attr("width", 19)
            .attr("height", 19)
            .attr("class", z);

        legend.append("text")
            .attr("x", width - 10)
            .attr("y", -30)
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
                .attr("y", y(y.ticks().pop()) - 7)
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr("text-anchor", "start")
                .text("Taux de valorisation (%)");
    };

    doTransition(newValues){
        let svgDoc = d3.select('svg')
        let g = svgDoc.select('g');
        const keys = newValues[0].keys;
        const height = getChartSize("#histogram-container").height;
        let y = d3.scaleLinear()
        .rangeRound([height, 0]);


        g.select("g").selectAll("g")
            .data(newValues)
            .selectAll('rect')
            .data(d => {
                return keys.map((key,index) => {
                    return ({
                        key: key,
                        value: d.values[index],
                        volume: d.volumes[index]
                    });
                })
            })
            .transition().duration(1500)
            .attr("y", d => {  return y(d.value); })
            .attr("height", d => { return (height - y(d.value)); });

    }

    redrawAndEraseHistogram(values) {
        d3.select("#"+this.props.id).select("svg").remove("svg")
        if(values.length > 0){
            this.__initHistogram(values);
        }
    };

    componentWillUpdate(nextProps, nextState){
        this.redrawAndEraseHistogram(nextProps.values);
    }


    render() {

        const isLoading = this.props.isLoading;
        const graphTitle = (this.props.title.length < 35) ? this.props.title : this.props.title.slice(0,35) + '...';

        if(isLoading){
            return (
                <div id="histogram-container">
                    <img className="loading-gif" src={Loading} alt=""/>
                    <div id={this.props.id} className="chart-container"></div>
                </div>
            );
        }
        else{
            return (
                <div id="histogram-container">
                    <h3 className="chart-title">Valorisation <b>{graphTitle}</b></h3>
                    <div id={this.props.id} className="chart-container"></div>
                </div>
            );
        }
    };
}
