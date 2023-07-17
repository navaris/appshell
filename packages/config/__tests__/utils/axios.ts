import AxiosMockAdapter from 'axios-mock-adapter';
import axios from '../../src/axios';

export default new AxiosMockAdapter(axios);
