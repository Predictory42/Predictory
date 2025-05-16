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

import { bufferFromString, uuidToBn } from "../tests/util/setup";
import { findEventAddress, findEventOptionAddress } from "../tests/util/entity";

dotenv.config();

const provider = AnchorProvider.env();
setProvider(provider);

const DESCRIPTION = "Duze duze sylno lubit";

async function main() {
  const [EVENT_ID] = process.argv.slice(2);
  const programId = process.env.PROGRAM_ID;

  if (!EVENT_ID) {
    throw new Error(`Usage: npm run create-option <EVENT_ID>`);
  }
  if (!programId) {
    throw new Error("PROGRAM_ID is not set");
  }

  const program = workspace.Predictory as Program<Predictory>;
  const id = uuidToBn(EVENT_ID);

  const [eventAddress] = await findEventAddress(id);
  const fetchedEventAccount = await program.account.event.fetch(eventAddress);

  const [optionAddress] = await findEventOptionAddress(
    id,
    fetchedEventAccount.optionCount
  );

  logVar(`Creating option to event with id`, EVENT_ID);
  logVar(`Index`, fetchedEventAccount.optionCount.toString());
  logVar(`Option pda`, optionAddress.toString());

  const description = Array.from(bufferFromString(DESCRIPTION, 256));

  return await program.methods
    .createEventOption(id, fetchedEventAccount.optionCount, description)
    .accounts({
      authority: provider.publicKey,
      option: optionAddress,
    })
    .rpc();
}

main().then(successHandler).catch(errorHandler);

// 243465279536260756368578916309991718712 - test
// 8d5627e5-e183-4a7f-9d7f-2fc5a5b57e56 - ilusho love sosat
// e988dda1-01c6-4d7a-baab-2b11ae1d4a65 - ser is gay
// b95c9472-b47f-4487-a257-21f47bdded92 - pu pu pu
