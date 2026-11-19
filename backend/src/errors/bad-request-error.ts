class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "Bad Request Error";
    this.statusCode = 400;
  }
}

export default BadRequestError;
