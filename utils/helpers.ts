/**
 * Calculates the estimated reading time for a given text.
 * @param text The content to analyze
 * @param wordsPerMinute Average words read per minute (default: 200)
 * @returns Estimated minutes to read
 */
export const calculateReadTime = (
  text: string,
  wordsPerMinute: number = 200,
): number => {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes > 0 ? minutes : 1;
};
