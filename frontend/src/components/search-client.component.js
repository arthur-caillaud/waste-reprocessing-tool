import SearchBar from '../utilities/search.component';

class ClientSearchBar extends SearchBar {
  constructor() {
    super();
    this.state = {
      placeholder: "Rechercher par prestataire",
    }
  }
  render() {
    return super.render();
  }
}

export default ClientSearchBar;
