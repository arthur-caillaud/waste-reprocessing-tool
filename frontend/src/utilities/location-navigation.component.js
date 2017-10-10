import React, { Component } from 'react';

import { Nav, NavItem, Glyphicon } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import '../styles/location-selection.css'

import LocationSelector from './location-selector.component';
import LocationSearch from './location-search.component'

class LocationNavigation extends Component {

  constructor(props) {
    super(props);
    // will take values as entry props
    // currently just mock values
    var globalSites = ["DPEH"];
    var units1 = ["Unité de production Centre", "mock2", "mock3"];
    var units2 = ["GEH Limoge", "mock4", "mock5"];
    var sites = ["Groupement de Maulte-Taurio", "mock6", "mock7",
   "mock6", "mock7", "mock6", "mock7", "mock6", "mock7", "mock6", "mock7",
   "mock6", "mock7", "mock6", "mock7"];

    this.state = {
      currentValues: [0, 0, 0, 0],
      globalSites: globalSites,
      units1: units1,
      units2: units2,
      sites: sites,
      searchMode: false
    }
  }

  toggleSearchMode() {
      var searchMode = this.state.searchMode;
      this.setState({searchMode: !searchMode});
  }

  render() {

    // easier access to the state values that will be needed
    var globalSite = <LocationSelector locations={this.state.globalSites} selected={this.state.currentValues[0]} />;
    var unit1 = <LocationSelector locations={this.state.units1} selected={this.state.currentValues[1]} />;
    var unit2 = <LocationSelector locations={this.state.units2} selected={this.state.currentValues[2]} />;
    var site = <LocationSelector locations={this.state.sites} selected={this.state.currentValues[3]} />;
    var glyphiconSearch = (<Glyphicon glyph="search" className="searchGlass" onClick={()=>this.toggleSearchMode()} />);

    if(!this.state.searchMode){
        return (
          <div className="location-selection-zone">
            {globalSite}
            {unit1}
            {unit2}
            {site}
            {glyphiconSearch}
          </div>
        );
    }
    else{
        var searchBar = (<LocationSearch
            globalSites={this.state.globalSites}
            units1={this.state.units1}
            units2={this.state.units2}
            sites={this.state.sites}
        />);
        return(
          <div className="searchBar">
            {searchBar}
            {glyphiconSearch}
          </div>
        );
    }
  }
}

export default LocationNavigation;
