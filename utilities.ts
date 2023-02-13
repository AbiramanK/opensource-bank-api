export const generateBankAccountNumber = (): string => {
  const random = (Math.floor(Math.random() * 99999999) + 1)?.toString();
  return padStartWithZeros(random, 8);
};

export const padStartWithZeros = (text: string, length: number): string => {
  return text?.padStart(8, "0");
};
