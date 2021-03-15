## Demonstration of Sample Token Creation using REST API

```zsh
$ npm install
$ npm start
```
 ### NOTE:
 * Create `.env` file, taking reference from `.env.sample` file.
 * Call `/deploy` endpoint to deploy sample_token score inside `assets` folder.
   * Sample Req
   ```properties
   {
    "name": "sample_token",
    "symbol": "ST",
    "decimals": "0x12",
    "initialSupply": "0xD3C21BCECCEDA1000000"
   }
   ```
   * Sample Res
   ```properties
   {
    "txHash": "0x413bf9b6c41b7385b2602820e0d516136e0cf49b20c2fe4828e8a4830f398ed9",
    "scoreAddress": "cx1934b79f9804e8f24135c587a50818fde3ac1fa0"
    }
   ```