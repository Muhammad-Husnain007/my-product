class ApiError extends Error {
  constructor(status = 500, message = "Server Error", error = null) {
    super(message); 
    this.status = status;
    this.error = error;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
