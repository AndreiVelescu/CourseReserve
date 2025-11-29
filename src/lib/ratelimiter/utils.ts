export function getRateLimitMessage(resetTime: number): string {
  const secondsRemaining = Math.ceil((resetTime - Date.now()) / 1000);

  if (secondsRemaining < 0) {
    return "Vă rugăm încercați din nou.";
  }

  if (secondsRemaining < 60) {
    return `Vă rugăm așteptați ${secondsRemaining} ${
      secondsRemaining === 1 ? "secundă" : "secunde"
    }.`;
  }

  const minutesRemaining = Math.ceil(secondsRemaining / 60);
  return `Vă rugăm așteptați ${minutesRemaining} ${
    minutesRemaining === 1 ? "minut" : "minute"
  }.`;
}

export class RateLimitError extends Error {
  constructor(
    public resetTime: number,
    public remaining: number = 0,
    public limit: number = 0,
  ) {
    super(`Prea multe cereri. ${getRateLimitMessage(resetTime)}`);
    this.name = "RateLimitError";
  }
}

export function formatRateLimitInfo(info: {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}): string {
  if (info.success) {
    return `${info.remaining}/${info.limit} cereri rămase`;
  }
  return `Limită atinsă. ${getRateLimitMessage(info.reset)}`;
}
