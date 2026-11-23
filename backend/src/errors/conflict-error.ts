class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'Conflict Error';
    this.statusCode = 409;
  }
}

export default ConflictError;
