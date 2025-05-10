import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import type {
  CreateEventArgs,
  InstructionCreateEventArgs,
} from "@/types/predictory";
import { Program } from "@coral-xyz/anchor";
import { type Predictory } from "../idl/predictory";
import BN from "bn.js";
import { bufferFromString, uuidToBn } from "../utils";
import { Buffer } from "buffer";

export class ActionMethods {
  constructor(private program: Program<Predictory>) {}

  /**
   * Create Event
   * @param {PublicKey} authority
   * @param {string} eventId
   * @param {number} stake
   * @param {CreateEventArgs} args
   * @returns {Promise<Transaction>}
   */
  async createEvent(
    authority: PublicKey,
    eventId: string,
    stake: number,
    args: CreateEventArgs,
  ): Promise<Transaction> {
    try {
      const eventIdBN = uuidToBn(eventId);

      const instructionArgs: InstructionCreateEventArgs = {
        isPrivate: args.isPrivate,
        name: Array.from(bufferFromString(args.name, 32)),
        description: Array.from(bufferFromString(args.description, 256)),
        startDate: new BN(args.startDate),
        endDate: new BN(args.endDate),
        participationDeadline: args.participationDeadline
          ? new BN(args.participationDeadline)
          : null,
      };

      const stakeBN = new BN(stake).mul(new BN(LAMPORTS_PER_SOL));

      const instruction = await this.program.methods
        .createEvent(eventIdBN, stakeBN, instructionArgs)
        .accounts({
          authority,
        })
        .instruction();

      const transferInstruction = SystemProgram.transfer({
        fromPubkey: authority,
        toPubkey: this.program.programId,
        lamports: stake * LAMPORTS_PER_SOL,
      });

      return new Transaction({
        feePayer: authority,
      }).add(instruction, transferInstruction);
    } catch (error) {
      console.error("CREATE EVENT error \n\n", error);
      throw error;
    }
  }

  /**
   * Create Event Option (max 20)
   * @param {PublicKey} authority
   * @param {string} eventId
   * @param {{optionCount: number, description: string}[]} options
   * @returns {Promise<Transaction>}
   */
  async createEventOption(
    authority: PublicKey,
    eventId: string,
    options: {
      optionCount: number;
      description: string;
    }[],
  ): Promise<Transaction> {
    try {
      const eventIdBN = uuidToBn(eventId);

      const instructions = await Promise.all(
        options.map(async ({ optionCount, description }) => {
          const option = PublicKey.findProgramAddressSync(
            [
              Buffer.from("option"),
              Buffer.from(eventId.toString()),
              Buffer.from([optionCount]),
            ],
            this.program.programId,
          )[0];

          const instructionDescription = Array.from(
            bufferFromString(description, 256),
          );

          const instruction = await this.program.methods
            .createEventOption(eventIdBN, optionCount, instructionDescription)
            .accounts({
              authority,
              option,
            })
            .instruction();

          return instruction;
        }),
      );

      return new Transaction({
        feePayer: authority,
      }).add(...instructions);
    } catch (error) {
      console.error("CREATE EVENT OPTION error \n\n", error);
      throw error;
    }
  }

  /**
   * Complete Event
   * @param {PublicKey} authority
   * @param {string} eventId
   * @param {number} optionIndex
   * @returns {Promise<Transaction>}
   */
  async completeEvent(
    authority: PublicKey,
    eventId: string,
    optionIndex: number,
  ): Promise<Transaction> {
    try {
      const eventIdBN = uuidToBn(eventId);

      const instruction = await this.program.methods
        .completeEvent(eventIdBN, optionIndex)
        .accounts({
          authority,
        })
        .instruction();
      return new Transaction({
        feePayer: authority,
      }).add(instruction);
    } catch (error) {
      console.error("COMPLETE EVENT error \n\n", error);
      throw error;
    }
  }

  /**
   * Update Event Description
   * @param {PublicKey} authority
   * @param {string} eventId
   * @param {string} description
   * @returns {Promise<Transaction>}
   */
  async updateEventDescription(
    authority: PublicKey,
    eventId: string,
    description: string,
  ): Promise<Transaction> {
    try {
      const eventIdBN = uuidToBn(eventId);

      const instructionDescription = Array.from(
        bufferFromString(description, 256),
      );

      const instruction = await this.program.methods
        .updateEventDescription(eventIdBN, instructionDescription)
        .accounts({
          authority,
        })
        .instruction();

      return new Transaction({
        feePayer: authority,
      }).add(instruction);
    } catch (error) {
      console.error("UPDATE EVENT DESCRIPTION error \n\n", error);
      throw error;
    }
  }

  /**
   * Update Event End Date
   * @param {PublicKey} authority
   * @param {string} eventId
   * @param {number} endDate
   * @returns {Promise<Transaction>}
   */
  async updateEventEndDate(
    authority: PublicKey,
    eventId: string,
    endDate: number,
  ): Promise<Transaction> {
    try {
      const eventIdBN = uuidToBn(eventId);
      const endDateBN = new BN(endDate);
      const instruction = await this.program.methods
        .updateEventEndDate(eventIdBN, endDateBN)
        .accounts({
          authority,
        })
        .instruction();

      return new Transaction({
        feePayer: authority,
      }).add(instruction);
    } catch (error) {
      console.error("UPDATE EVENT END DATE error \n\n", error);
      throw error;
    }
  }

  /**
   * Update Event Name
   * @param {PublicKey} authority
   * @param {string} eventId
   * @param {string} name
   * @returns {Promise<Transaction>}
   */
  async updateEventName(
    authority: PublicKey,
    eventId: string,
    name: string,
  ): Promise<Transaction> {
    try {
      const eventIdBN = uuidToBn(eventId);
      const instructionName = Array.from(bufferFromString(name, 32));

      const instruction = await this.program.methods
        .updateEventName(eventIdBN, instructionName)
        .accounts({
          authority,
        })
        .instruction();

      return new Transaction({
        feePayer: authority,
      }).add(instruction);
    } catch (error) {
      console.error("UPDATE EVENT NAME error \n\n", error);
      throw error;
    }
  }

  /**
   * Update Event Option
   * @param {PublicKey} authority
   * @param {string} eventId
   * @param {{optionIndex: number, description: string}[]} options
   * @returns {Promise<Transaction>}
   */
  async updateEventOption(
    authority: PublicKey,
    eventId: string,
    options: {
      optionIndex: number;
      description: string;
    }[],
  ): Promise<Transaction> {
    try {
      const eventIdBN = uuidToBn(eventId);

      const instructions = await Promise.all(
        options.map(async ({ optionIndex, description }) => {
          const instructionDescription = Array.from(
            bufferFromString(description, 256),
          );

          const option = PublicKey.findProgramAddressSync(
            [
              Buffer.from("option"),
              Buffer.from(eventId.toString()),
              Buffer.from([optionIndex]),
            ],
            this.program.programId,
          )[0];

          const instruction = await this.program.methods
            .updateEventOption(eventIdBN, optionIndex, instructionDescription)
            .accounts({
              authority,
              option,
            })
            .instruction();

          return instruction;
        }),
      );

      return new Transaction({
        feePayer: authority,
      }).add(...instructions);
    } catch (error) {
      console.error("UPDATE EVENT OPTION error \n\n", error);
      throw error;
    }
  }

  /**
   * Update Event Participation Deadline
   * @param {PublicKey} authority
   * @param {string} eventId
   * @param {number} participationDeadline
   * @returns {Promise<Transaction>}
   */
  async updateEventParticipationDeadline(
    authority: PublicKey,
    eventId: string,
    participationDeadline: number,
  ): Promise<Transaction> {
    try {
      const eventIdBN = uuidToBn(eventId);
      const participationDeadlineBN = new BN(participationDeadline);

      const instruction = await this.program.methods
        .updateEventParticipationDeadline(eventIdBN, participationDeadlineBN)
        .accounts({
          authority,
        })
        .instruction();

      return new Transaction({
        feePayer: authority,
      }).add(instruction);
    } catch (error) {
      console.error("UPDATE EVENT PARTICIPATION DEADLINE error \n\n", error);
      throw error;
    }
  }

  /**
   * Cancel Event
   * @param {PublicKey} sender
   * @param {string} eventId
   * @returns {Promise<Transaction>}
   */
  async cancelEvent(sender: PublicKey, eventId: string): Promise<Transaction> {
    try {
      const eventIdBN = uuidToBn(eventId);

      const instruction = await this.program.methods
        .cancelEvent(eventIdBN)
        .accounts({
          sender,
        })
        .instruction();

      return new Transaction({
        feePayer: sender,
      }).add(instruction);
    } catch (error) {
      console.error("CANCEL EVENT error \n\n", error);
      throw error;
    }
  }

  /**
   * Withdraw Stake
   * @param {PublicKey} authority
   * @param {string} eventId
   * @returns {Promise<Transaction>}
   */
  async withdrawStake(
    authority: PublicKey,
    eventId: string,
  ): Promise<Transaction> {
    try {
      const eventIdBN = uuidToBn(eventId);

      const instruction = await this.program.methods
        .withdrawStake(eventIdBN)
        .accounts({
          authority,
        })
        .instruction();

      return new Transaction({
        feePayer: authority,
      }).add(instruction);
    } catch (error) {
      console.error("WITHDRAW STAKE error \n\n", error);
      throw error;
    }
  }

  /**
   * Vote
   * @param {PublicKey} sender
   * @param {string} eventId
   * @param {number} optionIndex
   * @param {number} amount
   * @returns {Promise<Transaction>}
   */
  async vote(
    sender: PublicKey,
    eventId: string,
    optionIndex: number,
    amount: number,
  ): Promise<Transaction> {
    try {
      const eventIdBN = uuidToBn(eventId);
      const amountBN = new BN(amount);
      const option = PublicKey.findProgramAddressSync(
        [
          Buffer.from("option"),
          Buffer.from(eventId.toString()),
          Buffer.from([optionIndex]),
        ],
        this.program.programId,
      )[0];

      const instruction = await this.program.methods
        .vote(eventIdBN, optionIndex, amountBN)
        .accounts({
          sender,
          option,
        })
        .instruction();

      return new Transaction({
        feePayer: sender,
      }).add(instruction);
    } catch (error) {
      console.error("VOTE error \n\n", error);
      throw error;
    }
  }

  /**
   * Appeal
   * @param {PublicKey} sender
   * @param {string} eventId
   * @returns {Promise<Transaction>}
   */
  async appeal(sender: PublicKey, eventId: string): Promise<Transaction> {
    try {
      const eventIdBN = uuidToBn(eventId);

      const instruction = await this.program.methods
        .appeal(eventIdBN)
        .accounts({ sender })
        .instruction();

      return new Transaction({
        feePayer: sender,
      }).add(instruction);
    } catch (error) {
      console.error("APPEAL error \n\n", error);
      throw error;
    }
  }

  /**
   * Claim Event Reward
   * @param {PublicKey} sender
   * @param {string} eventId
   * @param {number} optionIndex
   * @returns {Promise<Transaction>}
   */
  async claimEventReward(
    sender: PublicKey,
    eventId: string,
    optionIndex: number,
  ): Promise<Transaction> {
    try {
      const eventIdBN = uuidToBn(eventId);

      const option = PublicKey.findProgramAddressSync(
        [
          Buffer.from("option"),
          Buffer.from(eventId.toString()),
          Buffer.from([optionIndex]),
        ],
        this.program.programId,
      )[0];

      const instruction = await this.program.methods
        .claimEventReward(eventIdBN)
        .accounts({ sender, option })
        .instruction();

      return new Transaction({
        feePayer: sender,
      }).add(instruction);
    } catch (error) {
      console.error("CLAIM EVENT REWARD error \n\n", error);
      throw error;
    }
  }

  /**
   * Create User
   * @param {PublicKey} sender
   * @returns {Promise<Transaction>}
   */
  async createUser(sender: PublicKey, name: string): Promise<Transaction> {
    try {
      const nameBuffer = Array.from(bufferFromString(name, 32));
      const instruction = await this.program.methods
        .createUser(nameBuffer)
        .accounts({ sender })
        .instruction();

      return new Transaction({
        feePayer: sender,
      }).add(instruction);
    } catch (error) {
      console.error("CREATE USER error \n\n", error);
      throw error;
    }
  }
}
