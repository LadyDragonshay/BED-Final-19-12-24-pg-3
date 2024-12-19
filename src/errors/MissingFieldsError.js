class MissingFieldsError extends Error {
  constructor(missingFields) {
    super(
      `The following required fields are missing: "${missingFields.join(
        '", "'
      )}"`
    );
    this.name = "MissingFieldsError";
    this.status = 400;
  }
}

export default MissingFieldsError;
