import axios from "axios";
import { currencyRates } from "../config/app.config.js";

/**
 * Convert currency amount
 * @param {Number} amount
 * @param {String} fromCurrency
 * @param {String} toCurrency
 * @returns {Number}
 */

export const convertAmount = async (
  amount,
  fromCurrency,
  toCurrency
) => {
  try {
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    if (!fromCurrency || !toCurrency) {
      throw new Error("Currency codes required");
    }

    // same currency no need convert
    if (fromCurrency === toCurrency) {
      return amount;
    }
     
    const fromRate = currencyRates[fromCurrency];
    const toRate = currencyRates[toCurrency];

    // Simple conversion using exchange rates
    const convertedAmount = (amount / fromRate) * toRate;

    return Number(convertedAmount.toFixed(2));
  } catch (error) {
    throw new Error(
      error.message || "Currency conversion error"
    );
  }
};