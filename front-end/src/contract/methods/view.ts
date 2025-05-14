import { PublicKey } from "@solana/web3.js";
import type {
  AllEvents,
  Appeal,
  Event,
  EventMeta,
  EventOption,
  Participation,
  User,
} from "@/types/predictory";
import { Program } from "@coral-xyz/anchor";
import { type Predictory } from "../idl/predictory";
import BN from "bn.js";
import { Entity } from "../utils/entity";

export class ViewMethods {
  private entity: Entity;
  constructor(private program: Program<Predictory>) {
    this.entity = new Entity(program.programId);
  }

  /**
   * Fetch States Data
   */
  async state() {
    try {
      const [state] = this.entity.findContractStateAddress();
      const stateAccount = await this.program.account.state.fetch(state);
      return stateAccount;
    } catch (error) {
      console.error("VIEW STATE error \n\n", error);
      throw error;
    }
  }

  /**
   * Fetch Events Data
   * @returns {Event[]}
   */
  async events(): Promise<Event[]> {
    try {
      const events = await this.program.account.event.all();
      return events.map((event) => event.account);
    } catch (error) {
      console.error("VIEW EVENTS error \n\n", error);
      throw error;
    }
  }

  /**
   * Fetch Event Data
   * @param {BN} eventId
   * @returns {Event} Event
   */
  async event(eventId: BN): Promise<Event> {
    try {
      const publicKey = new PublicKey(eventId.toString());
      const event = await this.program.account.event.fetch(publicKey);
      return event;
    } catch (error) {
      console.error("VIEW EVENT error \n\n", error);
      throw error;
    }
  }

  /**
   * Fetch Events Meta Data
   * @returns {EventMeta[]}
   */
  async eventsMeta(): Promise<EventMeta[]> {
    try {
      const events = await this.program.account.eventMeta.all();
      return events.map((event) => event.account);
    } catch (error) {
      console.error("VIEW EVENTS META error \n\n", error);
      throw error;
    }
  }

  /**
   * Fetch Event Meta Data
   * @param {BN} eventId
   * @returns {EventMeta}
   */
  async eventMeta(eventId: BN): Promise<EventMeta> {
    try {
      const publicKey = new PublicKey(eventId.toString());
      const eventMeta = await this.program.account.eventMeta.fetch(publicKey);
      return eventMeta;
    } catch (error) {
      console.error("VIEW EVENT META error \n\n", error);
      throw error;
    }
  }

  /**
   * Fetch Events Options Data
   * @returns {EventOption[]}
   */
  async eventsOptions(): Promise<EventOption[]> {
    try {
      const events = await this.program.account.eventOption.all();
      return events.map((event) => event.account);
    } catch (error) {
      console.error("VIEW EVENTS OPTIONS error \n\n", error);
      throw error;
    }
  }

  /**
   * Fetch Event Option Data
   * @param {BN} eventId
   * @returns {EventOption}
   */
  async eventOption(eventId: BN): Promise<EventOption> {
    try {
      const publicKey = new PublicKey(eventId.toString());
      const eventOption =
        await this.program.account.eventOption.fetch(publicKey);
      return eventOption;
    } catch (error) {
      console.error("VIEW EVENT OPTION error \n\n", error);
      throw error;
    }
  }

  /**
   * Fetch All Events Data
   * @returns {Array<AllEvents>}
   */
  async allEvents(): Promise<Array<AllEvents>> {
    try {
      const events = await this.program.account.event.all();
      const eventsMeta = await this.program.account.eventMeta.all();
      const eventsOptions = await this.program.account.eventOption.all();

      const optionsByEventId = eventsOptions.reduce(
        (acc, option) => {
          const eventId = option.account.eventId.toString();
          if (!acc[eventId]) {
            acc[eventId] = [];
          }
          acc[eventId].push(option.account);
          return acc;
        },
        {} as Record<string, Array<EventOption>>,
      );

      const result = events.map((event) => {
        const eventId = event.account.id.toString();
        const meta = eventsMeta.find(
          (m) => m.account.eventId.toString() === event.account.id.toString(),
        );
        const options = optionsByEventId[eventId] || [];

        return {
          ...event.account,
          ...(meta?.account || {}),
          options,
        };
      });
      return result;
    } catch (error) {
      console.error("VIEW ALL EVENTS error \n\n", error);
      throw error;
    }
  }

  async appellation(appellationId: BN): Promise<Appeal> {
    try {
      const publicKey = new PublicKey(appellationId.toString());
      const appellations =
        await this.program.account.appellation.fetch(publicKey);
      return appellations;
    } catch (error) {
      console.error("VIEW APPELLATION error \n\n", error);
      throw error;
    }
  }

  async appellations(): Promise<Appeal[]> {
    try {
      const appellations = await this.program.account.appellation.all();
      return appellations.map((appellation) => appellation.account);
    } catch (error) {
      console.error("VIEW APPELLATIONS error \n\n", error);
      throw error;
    }
  }

  async user(userId: string): Promise<User> {
    try {
      const publicKey = new PublicKey(userId);
      const [userAccountPublicKey] = this.entity.findUserAddress(publicKey);
      const user = await this.program.account.user.fetch(userAccountPublicKey);
      return user;
    } catch (error) {
      console.error("VIEW USER error \n\n", error);
      throw error;
    }
  }

  async users(): Promise<User[]> {
    try {
      const users = await this.program.account.user.all();
      return users.map((user) => user.account);
    } catch (error) {
      console.error("VIEW USERS error \n\n", error);
      throw error;
    }
  }

  async participant(
    participantId: string,
    eventId: BN,
  ): Promise<Participation> {
    try {
      const publicKey = new PublicKey(participantId);
      const [participantAccountPublicKey] = this.entity.findParticipantAddress(
        eventId,
        publicKey,
      );
      const participant = await this.program.account.participation.fetch(
        participantAccountPublicKey,
      );
      return participant;
    } catch (error) {
      console.error("VIEW PARTICIPANT error \n\n", error);
      throw error;
    }
  }

  async participants(): Promise<Participation[]> {
    try {
      const participants = await this.program.account.participation.all();
      return participants.map((participation) => participation.account);
    } catch (error) {
      console.error("VIEW PARTICIPANTS error \n\n", error);
      throw error;
    }
  }
}
