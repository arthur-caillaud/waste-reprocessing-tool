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
}

class Histogram extends Component {

    drawHistogram() {
        var histogramTitle = this.props.title;
        // valuesArray is an array of JS objects defined as {title: 'title', keys: ['key1','key2','key3',...], values: [value1,value2,value3,...]}
        // each object in valuesArray is stack of N columns labelled with Object.title
        var valuesArray = this.props.valuesArray;
        // We also save the previous state for dynamic transitions
        var old_valuesArray = this.props.valuesArray;
        var width = getChartSize("#"+this.props.id).width;
        var height = getChartSize("#"+this.props.id).height;

        /*
        Here we select the div which id is chart and add to it a <svg>
        We also choose it's attributes
        */
        var svgDoc = d3.select("#"+this.props.id)
            .attr("align","center")
            .append("svg")
            .attr("width", width+ margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        /*
        Then we append a <g> element and translate it to the middle of the <svg>
        */
        var g = svgDoc.append("g")
        .attr("transform", "translate(" + (width+ margin.left + margin.right)/2 + "," + (height + margin.top + margin.bottom)/2 + ")");

        var color = d3.scaleLinear()
            .domain([0, 33, 66, 100])
            .range(["red", "#CC5500", "#ED7F10", "green"]);
    }

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

    }
}
