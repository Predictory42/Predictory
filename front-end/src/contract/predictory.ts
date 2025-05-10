import { Connection } from "@solana/web3.js";

import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { type Predictory } from "./idl/predictory";
import idl from "./idl/predictory.json";
import type NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { ViewMethods } from "./methods/view";
import { ActionMethods } from "./methods/action";

export class PredictoryService {
  protected program: Program<Predictory>;
  public action: ActionMethods;
  public view: ViewMethods;

  constructor(connection: Connection, wallet: NodeWallet) {
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    this.program = new Program(idl, provider);
    this.action = new ActionMethods(this.program);
    this.view = new ViewMethods(this.program);
  }
}
