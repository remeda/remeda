const DEFAULT_MAX_LENGTH = 30;
const DEFAULT_OMISSION = "...";

type TruncateOptions = {
  readonly maxLength?: number;
  readonly omission?: string;
  readonly separator?: string | RegExp;
};

export function truncate(data: string, options?: TruncateOptions): string;
export function truncate(options?: TruncateOptions): (data: string) => string;

export function truncate(
  dataOrOptions: string | TruncateOptions | undefined,
  options?: TruncateOptions,
): unknown {
  return typeof dataOrOptions === "string"
    ? truncateImplementation(dataOrOptions, options)
    : (data: string) => truncateImplementation(data, dataOrOptions);
}

function truncateImplementation(
  data: string,
  {
    maxLength = DEFAULT_MAX_LENGTH,
    omission = DEFAULT_OMISSION,
    separator,
  }: TruncateOptions = {},
): string {
  if (data.length <= maxLength) {
    // No truncation needed.
    return data;
  }

  if (maxLength <= 0) {
    // Avoid weirdness when maxLength isn't positive.
    return "";
  }

  // Handle cases where the omission itself is too long.
  const effectiveOmission =
    omission.length > maxLength ? omission.slice(0, maxLength) : omission;

  // Our trivial cutoff is the point where we can add the omission and reach
  // the max length exactly, this is what we'll use when no separator is
  // provided.
  let cutoff = maxLength - effectiveOmission.length;

  if (typeof separator === "string") {
    const lastSeparator = data.lastIndexOf(separator, cutoff);
    if (lastSeparator !== -1) {
      // If we find the separator within the part of the string that would be
      // returned we move the cutoff further so that we also remove it.
      cutoff = lastSeparator;
    }
  } else if (separator !== undefined) {
    let lastSeparator;
    for (const { index } of data.matchAll(separator)) {
      if (index > cutoff) {
        // We only care about separators within the part of the string that
        // would be returned anyway, once we are past that point we don't care
        // about any further separators.
        break;
      }
      lastSeparator = index;
    }
    if (lastSeparator !== undefined) {
      cutoff = lastSeparator;
    }
  }

  // Build the output.
  return `${data.slice(0, cutoff)}${effectiveOmission}`;
}
