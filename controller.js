const fs = require('fs');
const path = require('path');

const { 
    getTxResultService,
    deployContractService
} = require('./service');

async function deploySampleToken(req, res, next) {
    //validation
    const { name, symbol, decimals, initialSupply } = req.body;
    if(!name || !symbol || !decimals || !initialSupply) {
        res.status(404).json({
            message: "Should provide name, symbol, decimals, and initialSupply"
        })
        return;
    }
    try {
        const contractContentTemp = fs
            .readFileSync(path.resolve(__dirname, './assets/sample_token.zip'))
            .toString('hex');
        const contractContent = '0x' + contractContentTemp;

        const paramsObj = {
            '_name': req.body.name,
            '_symbol': req.body.symbol,
            '_decimals': req.body.decimals,
            '_initialSupply': req.body.initialSupply,
        };

        const txHash = await deployContractService(contractContent, paramsObj);
        const txResult = await getTxResultService(txHash, 1);

        console.log(`Deploy Sample Score TxHash: ${txHash}`);
        
        if(txResult && txHash && txResult.status !== 1) {
            console.error('Error deploying score, check txHash ' + txHash);
            next(`Error deploying contract, check txHash ${txHash}`);
            return;
        }
        res.status(201).json({
            txHash,
            scoreAddress: txResult.scoreAddress,
        });
        
    } catch (err) {
        res.status(500).json({
            message: JSON.stringify(err)
        })
        console.error(JSON.stringify(err));
    }
}

module.exports = {
    deploySampleToken
};