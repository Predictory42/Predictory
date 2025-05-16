import {
  AnchorProvider,
  setProvider,
  Program,
  workspace,
  BN,
} from "@coral-xyz/anchor";
import * as dotenv from "dotenv";

import { errorHandler, logVar, successHandler } from "./util";
import { Predictory } from "../target/types/predictory";

import { ONE_SOL } from "../tests/util/setup";
import { PublicKey } from "@solana/web3.js";
import {
  findContractStateAddress,
  findProgramDataAddress,
  findUserAddress,
} from "../tests/util/entity";

dotenv.config();

const provider = AnchorProvider.env();
setProvider(provider);

async function main() {
  const programId = process.env.PROGRAM_ID;

  if (!programId) {
    throw new Error("PROGRAM_ID is not set");
  }

  let authoruty = provider.publicKey;
  let multiplier = new BN(1000);
  let eventPrice = ONE_SOL.muln(0.33);
  let platformFee = ONE_SOL.muln(0.03);
  let orgReward = new BN(0);

  const program = workspace.Predictory as Program<Predictory>;
  const [programData] = findProgramDataAddress();

  logVar(`Creating state for`, programId);

  let [state] = findContractStateAddress();
  let data = await program.account.state.fetch(state);

  return data.eventPrice.toString();

  //   return await program.methods
  //     .initializeContractState(
  //       authoruty,
  //       multiplier,
  //       eventPrice,
  //       platformFee,
  //       orgReward
  //     )
  //     .accounts({
  //       authority: provider.publicKey,
  //       programData,
  //     })
  //     .rpc();
}

main().then(successHandler).catch(errorHandler);
