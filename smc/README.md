# Predictory

This is an Predictory contract for Solana blockchain.

## Program

### Dependencies

To install everything you need to work with this project, you'll need to install dependencies as described in [Anchor](https://www.anchor-lang.com/docs/installation) documentation.

### Build contract

The source code of attestation program is in ./programs/predictory .
To build the **predictory ** program, you need to execute this command:

```sh

anchor build

```

You'll get the following output:

- program binaries at ./target/deploy/predictory .so
- IDL file at ./target/idl/predictory .json
- Typescript typings at ./target/types/predictory .ts

### Deploy

Before deploy:

1. Set cluster in [Anchor.toml](./Anchor.toml)
2. Update program id in declare_id in [contract](./programs/predictory /src/lib.rs)
3. Setup environment like in [example](.example.env)

To deploy the program, run this command:

```sh

anchor deploy \
    --provider.cluster $ANCHOR_PROVIDER_URL \
    --program-keypair $KEYPAIR \
    --program-name predictory  \
    --provider.wallet $ANCHOR_WALLET

```

Where:

- ANCHOR_PROVIDER_URL - url of the solana provider
- KEYPAIR - path where contract keys are stored
- ANCHOR_WALLET - path to the wallet keys

### Run tests

To test the **predictory ** program, you need to execute this command:

```sh

anchor test -- --features "testing"

```

This command starts a local validator, sets up the program on chain and runs a suite of Jest tests against it.

### Run scripts

Before start setup env file with corresponding variables:

- ANCHOR_PROVIDER_URL - url of solana rpc
- ANCHOR_WALLET - path to wallet to sign transactions
- PROGRAM_ID - public key of Greedy program

Available scripts:

1. To initialize contract state run:

```sh
npm run initialize-contract-state <CONTRACT_OWNER> 
```

2. To create event:

```sh
npm run create-event
```
All event settings update inside script

2. To create option:

```sh
npm run create-option
```
All option settings update inside script

3. To participate in event:

```sh
npm run participate <EVENT_ID>
```
