class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'Unauthorized Error';
    this.statusCode = 401;
  }
}

export default UnauthorizedError;
