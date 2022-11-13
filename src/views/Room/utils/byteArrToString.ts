const byteArrToString = (byteArr: Uint8Array): string => {
  return new TextDecoder().decode(byteArr);
};

export { byteArrToString };
