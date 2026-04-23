export const normalizeSearchValue = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stripPincode = (value = "") =>
  String(value)
    .replace(/\b\d{5,6}\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

const levenshteinDistance = (left = "", right = "") => {
  if (left === right) {
    return 0;
  }

  if (!left.length) {
    return right.length;
  }

  if (!right.length) {
    return left.length;
  }

  const rows = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let previousValue = leftIndex - 1;
    rows[0] = leftIndex;

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const currentValue = rows[rightIndex];
      const substitutionCost =
        left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;

      rows[rightIndex] = Math.min(
        rows[rightIndex] + 1,
        rows[rightIndex - 1] + 1,
        previousValue + substitutionCost
      );

      previousValue = currentValue;
    }
  }

  return rows[right.length];
};

const getBestApproximateDistance = (query, candidate) => {
  const tokens = candidate.split(" ").filter(Boolean);
  const variants = new Set([candidate, ...tokens]);
  let bestDistance = Number.POSITIVE_INFINITY;

  variants.forEach((variant) => {
    const lengthDifference = Math.abs(variant.length - query.length);

    if (lengthDifference <= 2) {
      bestDistance = Math.min(bestDistance, levenshteinDistance(query, variant));
    }

    if (variant.length > query.length + 1) {
      for (let index = 0; index <= variant.length - query.length; index += 1) {
        const windowText = variant.slice(index, index + query.length + 1);
        bestDistance = Math.min(
          bestDistance,
          levenshteinDistance(query, windowText)
        );

        if (bestDistance <= 1) {
          break;
        }
      }
    }
  });

  return bestDistance;
};

const scoreCandidate = (query, candidate) => {
  const normalizedCandidate = normalizeSearchValue(candidate);

  if (!normalizedCandidate) {
    return null;
  }

  const words = normalizedCandidate.split(" ").filter(Boolean);

  if (normalizedCandidate === query || words.includes(query)) {
    return {
      tier: 0,
      distance: 0,
      index: 0,
      lengthDifference: Math.abs(normalizedCandidate.length - query.length),
    };
  }

  if (normalizedCandidate.startsWith(query)) {
    return {
      tier: 1,
      distance: 0,
      index: 0,
      lengthDifference: Math.abs(normalizedCandidate.length - query.length),
    };
  }

  const wordStartsIndex = words.findIndex((word) => word.startsWith(query));
  if (wordStartsIndex !== -1) {
    return {
      tier: 1,
      distance: 0,
      index: normalizedCandidate.indexOf(words[wordStartsIndex]),
      lengthDifference: Math.abs(words[wordStartsIndex].length - query.length),
    };
  }

  const containsIndex = normalizedCandidate.indexOf(query);
  if (containsIndex !== -1) {
    return {
      tier: 2,
      distance: 0,
      index: containsIndex,
      lengthDifference: Math.abs(normalizedCandidate.length - query.length),
    };
  }

  if (query.length < 2) {
    return null;
  }

  const approximateDistance = getBestApproximateDistance(query, normalizedCandidate);

  if (approximateDistance <= 2) {
    return {
      tier: 3,
      distance: approximateDistance,
      index: Number.MAX_SAFE_INTEGER,
      lengthDifference: Math.abs(normalizedCandidate.length - query.length),
    };
  }

  return null;
};

const compareRank = (left, right) => {
  if (left.tier !== right.tier) {
    return left.tier - right.tier;
  }

  if (left.priority !== right.priority) {
    return left.priority - right.priority;
  }

  if (left.distance !== right.distance) {
    return left.distance - right.distance;
  }

  if (left.index !== right.index) {
    return left.index - right.index;
  }

  return left.lengthDifference - right.lengthDifference;
};

export const rankDirectoryItems = (items, query, getCandidates) => {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return [...items];
  }

  return items
    .map((item, itemIndex) => {
      const candidates = getCandidates(item)
        .map((candidate, candidateIndex) =>
          typeof candidate === "string"
            ? { text: candidate, priority: candidateIndex }
            : {
                text: candidate?.text,
                priority:
                  typeof candidate?.priority === "number"
                    ? candidate.priority
                    : candidateIndex,
              }
        )
        .filter((candidate) => candidate.text);

      let bestRank = null;

      candidates.forEach((candidate) => {
        const score = scoreCandidate(normalizedQuery, candidate.text);

        if (!score) {
          return;
        }

        const rankedCandidate = {
          ...score,
          priority: candidate.priority,
        };

        if (!bestRank || compareRank(rankedCandidate, bestRank) < 0) {
          bestRank = rankedCandidate;
        }
      });

      if (!bestRank) {
        return null;
      }

      return { item, itemIndex, rank: bestRank };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const rankDiff = compareRank(left.rank, right.rank);

      if (rankDiff !== 0) {
        return rankDiff;
      }

      return left.itemIndex - right.itemIndex;
    })
    .map(({ item }) => item);
};

export const sortDirectoryItems = (items, getLabel) =>
  [...items].sort((left, right) =>
    String(getLabel(left) || "").localeCompare(String(getLabel(right) || ""))
  );

export const getAreaLabel = (item = {}) => {
  const directArea =
    item.area ||
    item.locality ||
    item.neighborhood ||
    item.location ||
    item.area_name ||
    item.place ||
    item.region;

  if (directArea) {
    return stripPincode(directArea);
  }

  const parts = String(item.address || "")
    .split(",")
    .map((part) => stripPincode(part))
    .filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return parts[Math.max(0, parts.length - 2)];
};
