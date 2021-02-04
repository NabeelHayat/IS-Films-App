/* eslint-disable import/no-extraneous-dependencies */
// requires
import _ from 'lodash';

// module variables
import config from './config.json';

const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

export default finalConfig;
