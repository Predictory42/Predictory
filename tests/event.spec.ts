import {
  web3,
  AnchorProvider,
  setProvider,
  Program,
  workspace,
  BN,
} from "@coral-xyz/anchor";

import { TestToken } from "./util/token";
import { airdrop, bufferFromString, ONE_SOL, uuidToBn } from "./util/setup";

import { Predictory } from "../target/types/predictory";
import { v4 as uuidv4 } from "uuid";
import {
  findEventAddress,
  findEventMetaAddress,
  findEventOptionAddress,
  findUserAddress,
} from "./util/entity";

const provider = AnchorProvider.env();
setProvider(provider);

const program = workspace.Predictory as Program<Predictory>;

const authority = web3.Keypair.generate();
const another_authority = web3.Keypair.generate();

let eventId = uuidToBn(uuidv4());
let stake = ONE_SOL;

const now = new BN(Math.round(new Date().getTime()) / 1000);
const args = {
  name: Array.from(bufferFromString("Test name", 32)),
  isPrivate: false,
  description: Array.from(bufferFromString("Test Token description", 256)),
  startDate: now.addn(500),
  endDate: now.addn(1000),
  participationDeadline: null,
};

describe("General event test", () => {
  let testMint: TestToken;

  beforeAll(async () => {
    testMint = new TestToken(provider);
    await testMint.mint(1_000_000_000);

    await airdrop(provider.connection, authority.publicKey);
    await airdrop(provider.connection, another_authority.publicKey);
  });

  describe("create_user", () => {
    it("success", async () => {
      const [user] = findUserAddress(authority.publicKey);
      const name = Array.from(bufferFromString("User name", 32));

      // Creation:
      await program.methods
        .createUser(name)
        .accounts({
          sender: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      // Fetching user:
      const fetchedUserAccount = await program.account.user.fetch(user);

      expect(fetchedUserAccount.payer).toEqual(authority.publicKey);
      expect(fetchedUserAccount.name).toEqual(name);
    });
  });

  describe("create_event", () => {
    it("success", async () => {
      const [event] = findEventAddress(eventId);
      const [eventMeta] = findEventMetaAddress(eventId);

      // Creation:
      await program.methods
        .createEvent(eventId, stake, args)
        .accounts({
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      // Fetching event:
      const fetchedEventAccount = await program.account.event.fetch(event);

      expect(fetchedEventAccount.id.eq(eventId)).toBeTruthy();
      expect(fetchedEventAccount.authority).toEqual(authority.publicKey);
      expect(fetchedEventAccount.stake.eq(stake)).toBeTruthy();
      expect(fetchedEventAccount.startDate).toEqual(args.startDate);
      expect(fetchedEventAccount.endDate).toEqual(args.endDate);
      expect(fetchedEventAccount.participationDeadline).toEqual(
        args.participationDeadline
      );
      expect(fetchedEventAccount.optionCount).toEqual(0);
      expect(fetchedEventAccount.canceled).toEqual(false);
      expect(fetchedEventAccount.result).toBeNull();

      // Fetching event meta:
      const fetchedEventMetaAccount = await program.account.eventMeta.fetch(
        eventMeta
      );

      expect(fetchedEventMetaAccount.isPrivate).toEqual(args.isPrivate);
      expect(fetchedEventMetaAccount.name).toEqual(args.name);
      expect(fetchedEventMetaAccount.description).toEqual(args.description);
    });
  });

  describe("update_event", () => {
    beforeAll(async () => {
      await createNewEvent();
    });

    it("success", async () => {
      const [event] = findEventAddress(eventId);
      const [eventMeta] = findEventMetaAddress(eventId);

      const newName = Array.from(bufferFromString("New test name", 32));
      const newDescription = Array.from(
        bufferFromString("New test description", 256)
      );
      const newEndDate = args.endDate.addn(100);
      const newParticipationDeadline = args.startDate.addn(100);

      // Update name:
      await program.methods
        .updateEventName(eventId, newName)
        .accounts({
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      // Update description:
      await program.methods
        .updateEventDescription(eventId, newDescription)
        .accounts({
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      // Update participation deadline:
      await program.methods
        .updateEventParticipationDeadline(eventId, newParticipationDeadline)
        .accounts({
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      // Update end date:
      await program.methods
        .updateEventEndDate(eventId, newEndDate)
        .accounts({
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      // Fetching event:
      const fetchedEventAccount = await program.account.event.fetch(event);

      expect(fetchedEventAccount.endDate).toEqual(newEndDate);
      expect(fetchedEventAccount.participationDeadline).toEqual(
        newParticipationDeadline
      );

      // Fetching event meta:
      const fetchedEventMetaAccount = await program.account.eventMeta.fetch(
        eventMeta
      );

      expect(fetchedEventMetaAccount.name).toEqual(newName);
      expect(fetchedEventMetaAccount.description).toEqual(newDescription);
    });
  });

  describe("cancel_event", () => {
    beforeAll(async () => {
      await createNewEvent();
    });

    it("success", async () => {
      const [event] = findEventAddress(eventId);
      // TODO: also add cancel by user
      // Cancel event:
      await program.methods
        .cancelEvent(eventId)
        .accounts({
          sender: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      // Fetching event:
      const fetchedEventAccount = await program.account.event.fetch(event);

      expect(fetchedEventAccount.canceled).toBeTruthy();
    });
  });

  describe("complete_event", () => {
    beforeAll(async () => {
      const now = new BN(Math.round(new Date().getTime()) / 1000);

      await createNewEvent(now.subn(100), now.subn(50));
    });

    it("success", async () => {
      const [event] = findEventAddress(eventId);
      const resIndex = 1;

      // Complete event:
      await program.methods
        .completeEvent(eventId, resIndex)
        .accounts({
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      // Fetching event:
      const fetchedEventAccount = await program.account.event.fetch(event);

      expect(fetchedEventAccount.result).toEqual(resIndex);
    });
  });

  describe("withdraw_stake", () => {
    beforeAll(async () => {
      const now = new BN(Math.round(new Date().getTime()) / 1000);

      await createNewEvent(now.subn(100), now.subn(50));
    });

    it("success", async () => {
      const [event] = findEventAddress(eventId);

      // Fetching balance:
      const balanceBefore = await provider.connection.getBalance(event);

      // Complete event:
      await program.methods
        .withdrawStake(eventId)
        .accounts({
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      // Fetching balance:
      const balanceAfter = await provider.connection.getBalance(event);

      expect(balanceAfter).toEqual(balanceBefore - stake.toNumber());
    });
  });

  describe("create_option", () => {
    beforeAll(async () => {
      await createNewEvent();
    });

    it("success", async () => {
      // Fetching option index:
      const [event] = findEventAddress(eventId);
      const fetchedEventAccount = await program.account.event.fetch(event);
      const index = fetchedEventAccount.optionCount;

      const [eventOption] = findEventOptionAddress(eventId, index);

      const description = Array.from(bufferFromString("Test description", 256));

      // Create event option:
      await program.methods
        .createEventOption(eventId, index, description)
        .accounts({
          authority: authority.publicKey,
          option: eventOption,
        })
        .signers([authority])
        .rpc();

      // Fetching event option:
      const fetchedEventOptionAccount = await program.account.eventOption.fetch(
        eventOption
      );

      expect(fetchedEventOptionAccount.eventId.eq(eventId)).toBeTruthy();
      expect(fetchedEventOptionAccount.description).toEqual(description);
      expect(fetchedEventOptionAccount.vaultBalance.eq(new BN(0))).toBeTruthy();
      expect(fetchedEventOptionAccount.votes.eq(new BN(0))).toBeTruthy();
    });
  });

  describe("update_option", () => {
    beforeAll(async () => {
      await createNewEvent();

      const [eventOption] = findEventOptionAddress(eventId, 0);
      const description = Array.from(bufferFromString("Test description", 256));

      await program.methods
        .createEventOption(eventId, 0, description)
        .accounts({
          authority: authority.publicKey,
          option: eventOption,
        })
        .signers([authority])
        .rpc();
    });

    it("success", async () => {
      const [eventOption] = findEventOptionAddress(eventId, 0);

      const newDescription = Array.from(
        bufferFromString("New description", 256)
      );

      // Update event option:
      await program.methods
        .updateEventOption(eventId, 0, newDescription)
        .accounts({
          authority: authority.publicKey,
          option: eventOption,
        })
        .signers([authority])
        .rpc();

      // Fetching event option:
      const fetchedEventOptionAccount = await program.account.eventOption.fetch(
        eventOption
      );

      expect(fetchedEventOptionAccount.description).toEqual(newDescription);
    });
  });
});

async function createNewEvent(startDate?: BN, endDate?: BN) {
  eventId = uuidToBn(uuidv4());

  let newArgs = { ...args };

  if (startDate) {
    newArgs.startDate = startDate;
    newArgs.endDate = startDate.addn(1000);
  }

  if (endDate) {
    newArgs.endDate = endDate;
  }

  try {
    await program.methods
      .createEvent(eventId, stake, newArgs)
      .accounts({
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();
  } catch (error) {
    console.log("Error creating event", error);
  }
}
