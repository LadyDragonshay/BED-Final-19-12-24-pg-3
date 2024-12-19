class NotFoundError extends Error {
  constructor(resourceLabel, resourceLocator) {
    let errMsg;

    if (resourceLabel === "route") {
      errMsg = `Unmatched route: ${resourceLocator}\n`;
    } else if (Array.isArray(resourceLocator)) {
      errMsg = "";
      resourceLocator.forEach((nonExistingId) => {
        errMsg += `No matching ${resourceLabel} exists for id = "${nonExistingId}"\n`;
      });
    } else {
      errMsg = `No matching ${resourceLabel} exists for id = "${resourceLocator}"\n`;
    }

    super(errMsg);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

export default NotFoundError;
