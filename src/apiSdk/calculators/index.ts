import axios from 'axios';
import queryString from 'query-string';
import { CalculatorInterface, CalculatorGetQueryInterface } from 'interfaces/calculator';
import { GetQueryInterface } from '../../interfaces';

export const getCalculators = async (query?: CalculatorGetQueryInterface) => {
  const response = await axios.get(`/api/calculators${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCalculator = async (calculator: CalculatorInterface) => {
  const response = await axios.post('/api/calculators', calculator);
  return response.data;
};

export const updateCalculatorById = async (id: string, calculator: CalculatorInterface) => {
  const response = await axios.put(`/api/calculators/${id}`, calculator);
  return response.data;
};

export const getCalculatorById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/calculators/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCalculatorById = async (id: string) => {
  const response = await axios.delete(`/api/calculators/${id}`);
  return response.data;
};
