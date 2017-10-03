import SearchBar from '../utilities/search.component';

class TrashSearchBar extends SearchBar {
  constructor() {
    super();
    this.state = {
      placeholder: "Rechercher par déchet",
    }
  }
  render() {
    return super.render();
  }
}

export default TrashSearchBar;
