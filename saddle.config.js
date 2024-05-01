
module.exports = {
  // solc: "solc",                                         // Solc command to run
  // solc_args: [],                                        // Extra solc args
  build_dir: process.env['SADDLE_BUILD'] || ".build",      // Directory to place built contracts
  contracts: process.env['SADDLE_CONTRACTS'] || "contracts/*.sol contracts/**/*.sol tests/contracts/*.sol",  // Glob to match contract files
  tests: ['**/tests/*Test.js'],                         // Glob to match test files
  networks: {                                           // Define configuration for each network
    development: {
      providers: [                                      // How to load provider (processed in order)
        { env: "PROVIDER" },                              // Try to load Http provider from `PROVIDER` env variable (e.g. env PROVIDER=http://...)
        { http: "HTTP://127.0.0.1:7545" }                 // Fallback to localhost provider
      ],
      web3: {                                           // Web3 options for immediate confirmation in development mode
        gas: [
          { env: "GAS" },
          { default: "4600000" }
        ],
        gas_price: [
          { env: "GAS_PRICE" },
          { default: "12000000000" }
        ],
        options: {
          transactionConfirmationBlocks: 1,
          transactionBlockTimeout: 5
        }
      },
      accounts: [                                       // How to load default account for transactions
        { env: "ACCOUNT" },                               // Load from `ACCOUNT` env variable (e.g. env ACCOUNT=0x...)
        { unlocked: 0 }                                   // Else, try to grab first "unlocked" account from provider
      ]
    },
    test: {
      providers: [
        { env: "PROVIDER" },
        {
          ganache: {
            gasLimit: 80000000
          }
        },                                  // In test mode, connect to a new ganache provider. Any options will be passed to ganache
      ],
      web3: {
        gas: [
          { env: "GAS" },
          { default: "8000000" }
        ],
        gas_price: [
          { env: "GAS_PRICE" },
          { default: "12000000000" }
        ],
        options: {
          transactionConfirmationBlocks: 1,
          transactionBlockTimeout: 5
        }
      },
      accounts: [
        { env: "ACCOUNT" },
        { unlocked: 0 }
      ]
    },
    mainnet: {
      providers: [
        { env: "PROVIDER" },
        { file: "~/.ethereum/mainnet-url" },              // Load from given file with contents as the URL (e.g. https://infura.io/api-key)
        { http: "https://mainnet-eth.compound.finance" }
      ],
      web3: {
        gas: [
          { env: "GAS" },
          { default: "4600000" }
        ],
        gas_price: [
          { env: "GAS_PRICE" },
          { default: "6000000000" }
        ],
        options: {
          transactionConfirmationBlocks: 1,
          transactionBlockTimeout: 5
        }
      },
      accounts: [
        { env: "ACCOUNT" },
        { file: "~/.ethereum/mainnet" }                   // Load from given file with contents as the private key (e.g. 0x...)
      ]
    },
    sx_mainnet: {
      providers: [
        { env: "PROVIDER"},
        { http: "https://rpc.sx.technology"},
      ],
      web3: {
        gas: [
          { env: "GAS"},
          { default: "4000000"}
        ],
        gas_price: [ 
          {env: "GAS_PRICE"},
          { default: "500000"}, // Gas prices may need to be modified due to cheaper txn costs on sx mainnet
        ],
        accounts: [
          { env: "ACCOUNT" },
          { unlocked: 0 }  // Take the first account
        ]
      },
    },
    sx_testnet: {
      providers: [                                      // How to load provider (processed in order)
        { env: "PROVIDER" },                              // Try to load Http provider from `PROVIDER` env variable (e.g. env PROVIDER=http://...)
        { http: "https://rpc.toronto.sx.technology" }                 // Fallback to localhost provider
      ],
      web3: {                                           // Web3 options for immediate confirmation in development mode
        gas: [
          { env: "GAS" },
          { default: "4600000" }
        ],
        gas_price: [
          { env: "GAS_PRICE" },
          { default: "12000000000" }
        ],
        options: {
          transactionConfirmationBlocks: 1,
          transactionBlockTimeout: 5
        }
      },
      accounts: [                                       // How to load default account for transactions
        { env: "ACCOUNT" },                               // Load from `ACCOUNT` env variable (e.g. env ACCOUNT=0x...)
        { unlocked: 0 }                                   // Else, try to grab first "unlocked" account from provider
      ]
    }
  },
  get_network_file: (network) => {
    return null;
  },
  read_network_file: (network) => {
    const fs = require('fs');
    const path = require('path');
    const util = require('util');

    const networkFile = path.join(process.cwd(), 'compound-config', 'networks', `${network}.json`);
    return util.promisify(fs.readFile)(networkFile).then((json) => {
      const contracts = JSON.parse(json)['Contracts'] || {};

      return Object.fromEntries(Object.entries(contracts).map(([contract, address]) => {
        const mapper = {
          PriceFeed: 'UniswapAnchoredView',
          PriceData: 'OpenOraclePriceData'
        };

        return [mapper[contract] || contract, address];
      }));
    });
  }
};
