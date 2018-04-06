// --------Parent Component--------
//

import React from 'react';
import { DropdownSelections } from './dropdown-selections';
import { HeroTitle } from './hero-title';
import './App.scss';

// -------- GLOBALS ---------

function xconverts(variable, rateFactor) {
	return(Math.round((variable*rateFactor)*100)/100).toString();
}

function tryToConvert(value, rate) {
	const variable = parseFloat(value);
  const rateFactor = parseFloat(rate);
  return Number.isNaN(variable) ? '' : (xconverts(variable, rateFactor));
}

export class Parent extends React.Component {
	constructor(props) {

 fetch('https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/b0d1722b04b0a737aade2ce6e055263625a0b435/Common-Currency.json')
  .then(data => data.json())
  .then(data => {
  	const currencyTypes = [];
    currencyTypes.push(data.base, ...Object.entries(data).map(data => data[0]));
    currencyTypes.sort();
    this.setState({currencyTypes});
    //console.log(currencyTypes);
  })
  .catch(error1 => console.log(error1));

  	super(props);
    this.state = {
    	currenciesAll: [],
      currencyBase: 'AUD',
      currencyEquiv: 'AUD',
      inputCurrency: '?',
      outputCurrency: '?',
      rate: 0,
      value: ''
    };
    // Method binding
    this.updateConversionRate = this.updateConversionRate.bind(this);
    this.updateCurrencyType = this.updateCurrencyType.bind(this);
    this.updateValue = this.updateValue.bind(this);
  }

  // Methods go here
  componentWillMount() {
  	// fetching daily exchange rates from fixer.io
  	fetch('https://api.fixer.io/latest')
    	.then(data => data.json())
      .then(data => {
      	const currencies = [];
        const nonworkingcur = ['BOB'];
        currencies.push(data.base, ...Object.entries(data.rates).map(rates => rates[0]));
        //console.log(currencies);
        const currenciesAll = currencies.concat(nonworkingcur);
        currenciesAll.sort(); // sorts all currencies
        //console.log(currenciesAll); // logs all currencies - non-working included
        this.setState({currenciesAll});
        //console.log(data.rates); // logs exchange rates
      })

      .catch(error2 => console.log(error2));
  }

  updateConversionRate(inputCurrency, value) {
  	const {currencyBase, currencyEquiv} = this.state;
    const outputCurrency = inputCurrency === currencyBase ? currencyEquiv : currencyBase;
    fetch(`https://api.fixer.io/latest?base=${inputCurrency}`)
    	.then(data => data.json())
      .then(data => {
      	this.setState({
        	inputCurrency,
          outputCurrency,
          rate: data.rates[outputCurrency] || 1,
          value
        });
      })
      .catch(error => document.getElementById("error-message").innerHTML = "*Sorry, this currency is unavaliable for conversion. Please select another currency!");
  }


  updateValue(value) {
  	this.setState({value});
  }

  updateCurrencyType(currency, position) {
  	this.setState({
    	value: '',
      rate: 0,
      inputCurrency: '',
      outputCurrency: ''
    });

    if(position === 1) {
    	this.setState({
      	currencyBase: currency
      });
    }

    if(position === 2) {
    	this.setState({
      	currencyEquiv: currency
      });
    }
  }

  render() {
  	const {currenciesAll, currencyBase, currencyEquiv, inputCurrency, rate, value} = this.state;
    const newValue = value;
    const firstValue = currencyBase === inputCurrency ? newValue : tryToConvert(value, rate);
   	const secondValue = currencyEquiv === inputCurrency ? newValue : tryToConvert(value, rate);
  	return(
    	<div>
        <HeroTitle />
        <section className="converter-container">
          <div className="converter-container-item">
            <h5 className="prompt">Select base currency:</h5>
            <DropdownSelections
              position={1}
              currenciesAll={currenciesAll}
              selected={currencyBase}
              value={firstValue}
              onInputSelect={this.updateConversionRate}
              onInputChange={this.updateValue}
              onCurrencyChange={this.updateCurrencyType}
            />
          </div>

          <span className="converter-arrow">&#8652;</span>

          <div className="converter-container-item">
             <h5 className="prompt">Select equivalent currency:</h5>
            <DropdownSelections
              position={2}
              currenciesAll={currenciesAll}
              selected={currencyEquiv}
              value={secondValue}
              onInputSelect={this.updateConversionRate}
              onInputChange={this.updateValue}
              onCurrencyChange={this.updateCurrencyType}
            />
          </div>

        </section>
        <section className="additional-info">
          <p id="error-message" className="error"></p>
          <h5>Rate: {rate}</h5>
        </section>
      </div>
    );
  }
}
