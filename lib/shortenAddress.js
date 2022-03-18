import { getAddress } from "@ethersproject/address";

export const isAddress = value => {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
};

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export const shortenAddress = (address, chars = 2) => {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
};
