class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'Not Found Error';
    this.statusCode = 404;
  }
}

export default NotFoundError;
