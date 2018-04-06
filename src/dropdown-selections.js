// --------DropdownSelections Component--------
//

import React from 'react';

export class DropdownSelections extends React.Component {
	constructor(props) {
  	super(props);
    // Method binding goes here later
    this.handleInputSelect = this.handleInputSelect.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
  }

  // Methods for event handling go here

  handleInputSelect(e) {
  	this.props.onInputSelect(this.props.selected, e.target.value);
  }

  handleInputChange(e) {
  	this.props.onInputChange(e.target.value);
  }

  handleCurrencyChange(e) {
  	this.props.onCurrencyChange(e.target.value, this.props.position);
  }

  render() {
  	const {currenciesAll, selected, value} = this.props;
  	return(
    	<div className="dropdown-menus" >

        <select className="dropdown-menus-select" onChange={this.handleCurrencyChange}>
          {
          	currenciesAll.map(currency => {
            if(currency === selected) {
            	return(
              	<option key={currency} value={currency} defaultValue={currency}>{currency}</option>
              );
            } else {
            	return(
              	<option key={currency} value={currency}>{currency}</option>
              );
            }
            })
          }
        </select>

        <input
          className="inputs"
          value={value}
          onChange={this.handleInputChange}
          onClick={this.handleInputSelect}
          //placeholder for currency symbol
          placeholder="0.00"
          type="number"
        />

    	</div>
    )
  }

}
