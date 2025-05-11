import { PublicKey } from "@solana/web3.js";
import { bufferFromString } from "./index";
import BN from "bn.js";

export class Entity {
  constructor(private programId: PublicKey) {}

  public findProgramDataAddress() {
    return PublicKey.findProgramAddressSync(
      [this.programId.toBytes()],
      this.programId,
    );
  }

  public findContractStateAddress() {
    return PublicKey.findProgramAddressSync(
      [bufferFromString("state")],
      this.programId,
    );
  }

  public findUserAddress(sender: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [bufferFromString("user"), sender.toBytes()],
      this.programId,
    );
  }

  public findEventAddress(eventId: BN) {
    return PublicKey.findProgramAddressSync(
      [bufferFromString("event"), eventId.toBuffer("le", 16)],
      this.programId,
    );
  }

  public findEventMetaAddress(eventId: BN) {
    return PublicKey.findProgramAddressSync(
      [bufferFromString("event_meta"), eventId.toBuffer("le", 16)],
      this.programId,
    );
  }

  public findEventOptionAddress(eventId: BN, index: number) {
    return PublicKey.findProgramAddressSync(
      [
        bufferFromString("option"),
        eventId.toBuffer("le", 16),
        Buffer.from([index]),
      ],
      this.programId,
    );
  }

  public findParticipantAddress(eventId: BN, sender: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [
        bufferFromString("participant"),
        eventId.toBuffer("le", 16),
        sender.toBytes(),
      ],
      this.programId,
    );
  }
}
