const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export function isValidAddress(address: string): boolean {
  return ADDRESS_REGEX.test(address);
}

export function checksumAddress(address: string): string {
  if (!isValidAddress(address)) {
    throw new Error(`Invalid address: ${address}`);
  }
  return address.toLowerCase();
}

export function areAddressesEqual(a: string, b: string): boolean {
  if (!isValidAddress(a) || !isValidAddress(b)) return false;
  return a.toLowerCase() === b.toLowerCase();
}
