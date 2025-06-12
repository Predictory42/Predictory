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

export function formatDateTimeCompact(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Get the current time in seconds
 * @returns {BN} The current time in seconds
 */
export const getCurrentTime = (): BN => {
  return new BN(Math.round(new Date().getTime()));
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

export const calculatePercentage = (
  totalVotes: number,
  optionVotes: number,
) => {
  if (totalVotes === 0) return 0;
  if (optionVotes === 0) return 0;
  if (optionVotes > totalVotes) return 0;
  if (optionVotes === totalVotes) return 100;
  return ((totalVotes - optionVotes) / totalVotes) * 100;
};
