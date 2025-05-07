import { PublicKey } from "@solana/web3.js";
import { bufferFromString, TEST_PROGRAM_ID } from "./setup";
import BN from "bn.js";

export function findProgramDataAddress() {
  return PublicKey.findProgramAddressSync(
    [TEST_PROGRAM_ID.toBytes()],
    new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111")
  );
}

export function findContractStateAddress(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [bufferFromString("state")],
    TEST_PROGRAM_ID
  );
}

export function findEventAddress(eventId: BN): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [bufferFromString("event"), eventId.toBuffer("le", 16)],
    TEST_PROGRAM_ID
  );
}

export function findEventMetaAddress(eventId: BN): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [bufferFromString("event_meta"), eventId.toBuffer("le", 16)],
    TEST_PROGRAM_ID
  );
}

export function findEventOptionAddress(
  eventId: BN,
  index: number
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      bufferFromString("option"),
      eventId.toBuffer("le", 16),
      Buffer.from([index]),
    ],
    TEST_PROGRAM_ID
  );
}

export function findParticipantAddress(
  eventId: BN,
  sender: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      bufferFromString("participant"),
      eventId.toBuffer("le", 16),
      sender.toBytes(),
    ],
    TEST_PROGRAM_ID
  );
}
