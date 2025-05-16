import {
  AnchorProvider,
  setProvider,
  Program,
  workspace,
  BN,
} from "@coral-xyz/anchor";
import * as dotenv from "dotenv";
import { PublicKey } from "@solana/web3.js";

import { errorHandler, logVar, successHandler } from "./util";
import { Predictory } from "../target/types/predictory";

import { bnToUuid, bufferFromString, uuidToBn } from "../tests/util/setup";
import { v4 as uuidv4 } from "uuid";
import { findEventAddress, findUserAddress } from "../tests/util/entity";

dotenv.config();

const provider = AnchorProvider.env();
setProvider(provider);

const now = new BN(Math.round(new Date().getTime()) / 1000);

const EVENT_NAME = "Ilusha lubit pisuny";
const EVENT_DESCRIPTION = "Ilusha lubit pisuny?";

const STAKE = new BN(1_000_000_000 / 1000); // 0.001 SOL
const START_DATE = now.addn(50000);
const PARTICIPATION_DEADLINE = now.addn(200000);
const END_DATE = now.addn(40000000);

const IS_PRIVATE = true;

async function main() {
  const programId = process.env.PROGRAM_ID;

  if (!programId) {
    throw new Error("PROGRAM_ID is not set");
  }

  const program = workspace.Predictory as Program<Predictory>;
  const id = uuidToBn(uuidv4());

  const eventAddress = await findEventAddress(id);

  logVar(`Creating event with id`, bnToUuid(id));
  logVar(`Pda`, eventAddress.toString());

  const serhiy = new PublicKey("5z2onJxgMFWVU1FXfqu9WKS5QqKsPaiw5AgfyiBCbJLM");

  let [userAcc] = findUserAddress(serhiy);
  let user = await program.account.user.fetch(userAcc);

  return user.stake.toString();
  // return await program.methods
  //   .mintTrustForSerhiy(serhiy)
  //   .accounts({
  //     sender: provider.publicKey,
  //   })
  //   .rpc();
}

main().then(successHandler).catch(errorHandler);

// 243465279536260756368578916309991718712
// 8d5627e5-e183-4a7f-9d7f-2fc5a5b57e56
// e988dda1-01c6-4d7a-baab-2b11ae1d4a65
