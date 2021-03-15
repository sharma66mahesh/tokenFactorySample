const IconService = require('icon-sdk-js');
const { HttpProvider } = IconService;

const CONTRACT_DEPLOY_ADDRESS = 'cx0000000000000000000000000000000000000000';
const CONTRACT_STATUS_ADDRESS = 'cx0000000000000000000000000000000000000001';

const NID = '0x3'; //only for testnet
const NODE_DEBUG_URL = 'https://bicon.net.solidwallet.io/api/debug/v3';
const NODE_URL = 'https://bicon.net.solidwallet.io/api/v3';

const provider = new HttpProvider(NODE_URL);
const iconService = new IconService(provider);

module.exports = {
    CONTRACT_DEPLOY_ADDRESS,
    CONTRACT_STATUS_ADDRESS,
    NID,
    iconService,
    NODE_URL,
    NODE_DEBUG_URL
};