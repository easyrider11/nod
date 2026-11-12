function overlap(text: string, start: string, shorter: number, longer: number, minimum: number) {
  const answer = text.toLocaleLowerCase().replace(/\s+/gu, ' ').trim();
  const acknowledgement = start.toLocaleLowerCase().replace(/\s+/gu, ' ').trim();
  if (!answer || !acknowledgement) return false;
  if (answer === acknowledgement) return true;
  const words = (value: string) => new Set(value.match(/[\p{L}\p{N}]{3,}/gu) ?? []);
  const first = words(answer);
  const second = words(acknowledgement);
  const shortest = Math.min(first.size, second.size);
  const shared = [...first].filter((word) => second.has(word)).length;
  return (
    shortest >= 3 &&
    shared >= Math.min(minimum, shortest) &&
    shared / shortest >= shorter &&
    shared / Math.max(first.size, second.size) >= longer
  );
}

export function resemblesTaskAcknowledgement(text: string, start: string) {
  const status =
    /^(?:(?:sure|ok(?:ay)?)[,.!\s]+)?(?:on it\b|i(?:['’]ll| will)\b|i(?:['’]m| am)\s+(?:going|working|starting)\b|i(?:['’]ve| have)\s+started\b|started\b|working\b)/iu.test(
      text.trim(),
    );
  return status && !/[\p{N}€$£\n]|https?:\/\//iu.test(text) && overlap(text, start, 0.45, 0.4, 3);
}

export function repeatsTaskStart(text: string, start: string) {
  const details = text.match(/https?:\/\/\S+|[€$£]\s*\d[\d.,]*|\b\d[\d.,]*\b/gu) ?? [];
  return (
    !text.includes('\n') &&
    details.every((detail) => start.includes(detail)) &&
    overlap(text, start, 0.8, 0.85, 5)
  );
}
