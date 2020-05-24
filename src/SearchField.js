import React, {Component} from 'react';
import './App.css';
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import SearchResults from './searchResults'

const searchGet = async (searchValue) => {
  console.log(searchValue)
  return await axios.post('http://localhost:6969/search/', {searchValue}).then(function(res){
     return res.data
   }).catch(function(err){
       console.log(err)
     });
}

class SearchField extends Component {
  constructor(props){
  super(props);
  this.state={
    search: []
  }
 }

 searchEvent(searchValue) {
   console.log(searchValue)
   searchGet(searchValue).then((data)=>{
     this.setState({search: data})
   })
 }

 render() {
  console.log(this.state.search)
  return (
      <div>
        <input type="text" onChange={(event) => this.searchEvent(event.target.value)}></input>
        {this.state.search !== 0 ? this.state.search.map(result => (
          <SearchResults result={result}/>
        )) : console.log("Map is 0")}
      </div>
  );
 }
}
export default withRouter(SearchField)
