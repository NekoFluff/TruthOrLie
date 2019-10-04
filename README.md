# TruthOrLie"

First install the packages using:
`npm i` or `npm install`

Then run the following to start up the local server:
`npm run dev`

Connect to the localhost server by opening up `localhost:3000` in a web browser

Here are a list of the scripts in the package.json:
npm run
"test": Runs the mocha test tool
"compile": Runs the js program at `/ethereum/compile` which compiles contracts in the contracts folder and puts them in build folder
"deploy": Runs the js program at `./ethereum/deploy` which deploys a contract to the Rinkeby network
"dev": Starts up a local node server
"build": next build
"start": next star

## Technologies Utilized

- Next.js (server-side rendering)
- Next-routes (routing for next)
- React
- Semantic-ui (for react components and css)
- solc (compile solidity code into bytecode and abi)
- web3 (connect to different providers and abi's)
- hd-wallet (connect to user's wallet)
