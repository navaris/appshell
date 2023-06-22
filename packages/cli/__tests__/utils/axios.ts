import AxiosMockAdapter from 'axios-mock-adapter';
import axios from '../../src/axios';

const mockAxios = new AxiosMockAdapter(axios);

export default mockAxios;
