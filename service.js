const IconService = require('icon-sdk-js');
const { IconWallet, IconBuilder, IconConverter } = IconService;
const fetch = require('node-fetch');
const BigNumber = require('bignumber.js');

const { CONTRACT_DEPLOY_ADDRESS, NID, iconService, NODE_DEBUG_URL } = require('./constants');


//----------------------------------------------------------------------------------------
function timeout(instance) {
  const seconds = instance === 1 ? 2000 : 1000;
  return new Promise(resolve => setTimeout(resolve, seconds));
}


//---------------------------------------------------------------------------------------------
async function estimateStepForDeployment (from, content) {
  const timestampInDecimal = Date.now() * 1000;
  const timestamp = '0x' + timestampInDecimal.toString(16); //to hex string
  const txObj = {
    jsonrpc: "2.0",
    method: "debug_estimateStep",
    id: 1234,
    params: {
        version: '0x3',
        from,
        to: CONTRACT_DEPLOY_ADDRESS, 
        timestamp,
        nid: NID,
        nonce: "0x1",
        dataType: "deploy",
        data: {
            contentType: "application/zip",
            content, // compressed SCORE data
        }
    }
  }

  try {
    const responsePromise = await fetch (NODE_DEBUG_URL, 
      {
        method: 'POST',
        body: JSON.stringify(txObj),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    const responseJSON = await responsePromise.json();

    return responseJSON.result;

  } catch (err) {
    console.error("FETCH:", err);
    throw err;
  }
}

//---------------------------------------------------------------------------------------------
async function deployContractService (contractContent, params={}) {
  try {
    const privateKey = process.env.ADMIN_PRIVATE_KEY;
    const adminWallet = IconWallet.loadPrivateKey(privateKey);
    if (!adminWallet) throw 'Please provide admin\'s Private Key';

    const stepLimitInHex = await estimateStepForDeployment(adminWallet.getAddress(), contractContent);
    const stepLimit = new BigNumber(stepLimitInHex).toNumber();
    // console.log(stepLimit);

    const deployBuilder =  new IconBuilder.DeployTransactionBuilder();
    const txObj = deployBuilder
      .nid(NID)
      .from(adminWallet.getAddress())
      .to(CONTRACT_DEPLOY_ADDRESS)
      .stepLimit(new BigNumber(stepLimit).plus(1000000))
      .version(IconConverter.toBigNumber(3))
      .timestamp(Date.now() * 1000)
      .contentType('application/zip')
      .content(contractContent)
      .nonce(IconConverter.toBigNumber(1))
      .params(params)
      .build();
    // console.log("---txObj", txObj);
    const signedTx = new IconService.SignedTransaction(txObj, adminWallet);
    const txHash = await iconService.sendTransaction(signedTx).execute();
    // console.log(txHash);
    return txHash;

  } catch (err) {
    throw err;
  }
}

//---------------------------------------------------------------------------------------------
async function getTxResultService (txHash, instance) {
  try {
    await timeout(instance);
    return await iconService.getTransactionResult(txHash).execute();
  } catch (err) {
    // Attempt for 5 times before throwing error
    if (instance >= 5) {
      throw (err);
    }
    console.log("Retrying getting txResult..., Attempt ", instance);
    instance = instance + 1;
    return await getTxResultService(txHash, instance);
  }
}


module.exports = {
  deployContractService,
  getTxResultService
}