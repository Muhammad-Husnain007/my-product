class ApiResponse {
  constructor(status, success = true, message = "Success", data = null) {
    this.status = status;
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

export default ApiResponse;
