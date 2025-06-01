// Value Object - Username (following Domain-Driven Design principles)
export class Username {
  private readonly value: string;

  constructor(username: string) {
    if (!this.isValid(username)) {
      throw new Error('Invalid username format');
    }
    this.value = username.trim();
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Username): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  private isValid(username: string): boolean {
    // Business rules for username validation
    const trimmed = username.trim();
    return (
      trimmed.length >= 3 &&
      trimmed.length <= 30 &&
      /^[a-zA-Z0-9_-]+$/.test(trimmed) &&
      !/^[_-]/.test(trimmed) &&
      !/[_-]$/.test(trimmed)
    );
  }

  public static create(username: string): Username {
    return new Username(username);
  }
}