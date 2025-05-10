import { PublicKey } from "@solana/web3.js";
import type {
  AllEvents,
  Event,
  EventMeta,
  EventOption,
} from "@/types/predictory";
import { Program } from "@coral-xyz/anchor";
import { type Predictory } from "../idl/predictory";
import BN from "bn.js";

export class ViewMethods {
  constructor(private program: Program<Predictory>) {}

  /**
   * Fetch States Data
   */
  async state() {
    try {
      const state = await this.program.account.state.fetch(
        this.program.programId,
      );
      return state;
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

  async appeal(appealId: BN) {
    try {
      const publicKey = new PublicKey(appealId.toString());
      const appeal = await this.program.account.appeal.fetch(publicKey);
      return appeal;
    } catch (error) {
      console.error("VIEW APPEAL error \n\n", error);
      throw error;
    }
  }

  async appeals() {
    try {
      const appeals = await this.program.account.appeal.all();
      return appeals.map((appeal) => appeal.account);
    } catch (error) {
      console.error("VIEW APPEALS error \n\n", error);
      throw error;
    }
  }

  async user(userId: string) {
    try {
      const publicKey = new PublicKey(userId);
      const user = await this.program.account.user.fetch(publicKey);
      return user;
    } catch (error) {
      console.error("VIEW USER error \n\n", error);
      throw error;
    }
  }

  async users() {
    try {
      const users = await this.program.account.user.all();
      return users.map((user) => user.account);
    } catch (error) {
      console.error("VIEW USERS error \n\n", error);
      throw error;
    }
  }

  async participant(participantId: string) {
    try {
      const publicKey = new PublicKey(participantId);
      const participant =
        await this.program.account.participation.fetch(publicKey);
      return participant;
    } catch (error) {
      console.error("VIEW PARTICIPANT error \n\n", error);
      throw error;
    }
  }

  async participants() {
    try {
      const participants = await this.program.account.participation.all();
      return participants.map((participation) => participation.account);
    } catch (error) {
      console.error("VIEW PARTICIPANTS error \n\n", error);
      throw error;
    }
  }
}
