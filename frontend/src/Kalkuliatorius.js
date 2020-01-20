import React, { Component } from 'react';
import axios from 'axios';

const prefix = 'Indeksui ',
      statement = ' suskaiciuota verte ';

class Kalkuliatorius extends Component {
  state = {
      seenIndexes: [],
      valuesObj: {},
      index: ''
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    const fetchedValues = await axios.get('/express/values/current');
    this.setState( {valuesObj:fetchedValues.data} );
  };
  async fetchIndexes() {
    const fetchedIndexes = await axios.get('/express/values/all');
    this.setState( {seenIndexes:fetchedIndexes.data} );
  };
  renderSeenIndexes() {
    // {number is the destructuring, data is [{number:val}, ..]}
    return this.state.seenIndexes.map(({number})=>number).join(', ');
  };
  renderCalculatedValues() {
    /*
    let keys = this.state.valuesObj.keys;
    return keys.map(ix=><div key={ix}>`${prefix}${ix}${statement}${this.state.valuesObj[ix]}`</div>);
    */
   const entries = [];
   for (let key in this.state.valuesObj) {
     entries.push(<div key={key}>{prefix}{key}{statement}{this.state.valuesObj[key]}</div>);
     //entries.push(<div key={key}>prefix</div>);
   }
   return entries;
  };
  handleSubmit = async e => {
    e.preventDefault();
    await axios.post('/express/values', {
        index:this.state.index
    });
    this.setState({index:''});
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Iveskite indeksa:</label>
          <input value={this.state.index}
                     onChange={e=>this.setState({index:e.target.value})}/>
          <input type="submit" value="Patvirtinti"/>
        <h3>Matyti indeksai:</h3>
        {this.renderSeenIndexes()}
        <h3>Suskaiciuotos vertės:</h3>
        {this.renderCalculatedValues()}
      </form>
      </div>
    );
  }
}

export default Kalkuliatorius;