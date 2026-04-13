class AICircuitBreaker {
  constructor() {
    this.failureCount = 0;
    this.state = "CLOSED"; // CLOSED | OPEN
    this.lastFailureTime = null;

    this.failureThreshold = 3; // after 3 failures → OPEN
    this.cooldownTime = 2 * 60 * 1000; // 2 min cooldown
  }

  isOpen() {
    if (this.state === "OPEN") {
      const now = Date.now();

      // auto reset after cooldown
      if (now - this.lastFailureTime > this.cooldownTime) {
        this.reset();
        return false;
      }

      return true;
    }

    return false;
  }

  recordSuccess() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  recordFailure() {
    this.failureCount += 1;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
      console.warn(" AI Circuit OPEN - switching to fallback mode");
    }
  }

  reset() {
    this.failureCount = 0;
    this.state = "CLOSED";
    this.lastFailureTime = null;
  }
}

export const aiCircuitBreaker = new AICircuitBreaker();