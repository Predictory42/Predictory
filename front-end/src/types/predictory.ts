import { PublicKey } from "@solana/web3.js";
import type BN from "bn.js";

export const PREDICTORY_PROGRAM_ID = new PublicKey(
  "CEYFY2CbDJ3TywKT3tzef6BcqE4NoviFTjhpURTK714U",
);

export interface Event {
  version: number;
  id: BN;
  authority: PublicKey;
  stake: BN;
  startDate: BN;
  endDate: BN;
  participationDeadline: BN | null;
  optionCount: number;
  canceled: boolean;
  result: number | null;
}

export interface EventMeta {
  version: number;
  eventId: BN;
  isPrivate: boolean;
  name: number[];
  description: number[];
}

export interface EventOption {
  version: number;
  eventId: BN;
  description: number[];
  votes: BN;
  vaultBalance: BN;
  index: number;
}

export interface CreateEventArgs {
  name: string;
  isPrivate: boolean;
  description: string;
  startDate: number;
  endDate: number;
  participationDeadline: number | null;
}

export interface InstructionCreateEventArgs {
  name: number[];
  isPrivate: boolean;
  description: number[];
  startDate: BN;
  endDate: BN;
  participationDeadline: BN | null;
}

export enum PredictoryError {
  AuthorityMismatch = 6000,
  InvalidProgramData = 6001,
  InvalidProgramAccount = 6002,
  IllegalOwner = 6003,
  EventAlreadyStarted = 6004,
  EventIsNotOver = 6005,
  InvalidUuid = 6006,
  InvalidEndDate = 6007,
  InvalidIndex = 6008,
  TooManyOptions = 6009,
  InactiveEvent = 6010,
  ActiveEvent = 6011,
  EarlyStakeWithdraw = 6012,
  ParticipationDeadlinePassed = 6013,
  CanceledEvent = 6014,
  LosingOption = 6015,
  EventIsNotCancelled = 6016,
  AllStakeLocked = 6017,
}

export type AllEvents = Event &
  Partial<EventMeta> & { options: Partial<EventOption>[] };

export interface Participation {
  version: number;
  eventId: BN;
  payer: PublicKey;
  option: number;
  depositedAmount: BN;
  isClaimed: boolean;
}

export interface User {
  version: number;
  payer: PublicKey;
  stake: BN;
  lockedStake: BN;
  trustLvl: BN;
  name: number[];
}

export interface Appeal {
  version: number;
  eventId: BN;
}
