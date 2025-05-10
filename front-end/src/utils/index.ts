import { BN } from "@coral-xyz/anchor";

export const truncateAddress = (address: string) => {
  return address.slice(0, 4) + "..." + address.slice(-4);
};

const persons = [
  "/icons/person-1.svg",
  "/icons/person-2.svg",
  "/icons/person-3.svg",
  "/icons/person-4.svg",
  "/icons/person-5.svg",
  "/icons/person-6.svg",
  "/icons/person-7.svg",
];

export const personImage = (address: string): string => {
  const hash = Array.from(address).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0,
  );
  const index = hash % persons.length;

  return persons[index];
};

export function formatTimeFromDate(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${hours}h ${minutes}m ${seconds}s`;
}

/**
 * Get the current time in seconds
 * @returns {BN} The current time in seconds
 */
export const getCurrentTime = (): BN => {
  return new BN(Math.round(new Date().getTime()) / 1000);
};
