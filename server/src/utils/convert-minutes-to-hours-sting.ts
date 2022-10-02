//1080 => 18:00
// tranformar em string e caso a variavel não tenha dois caracteres add um zero

export function ConvertMinutesStringToHours(minutesAmount: number) {
  const hours = Math.floor(minutesAmount / 60);
  const minutes = minutesAmount % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}
