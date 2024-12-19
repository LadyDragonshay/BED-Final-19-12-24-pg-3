const errorHandler = (err, req, res, next) => {
  // If response headers have already been sent, delegate the error further.
  if (res.headersSent) {
    return next(err);
  }

  // Set http status code for instances of PrismaClientKnownRequestError
  if (err.name === "PrismaClientKnownRequestError") {
    switch (err.code) {
      case "P2000":
      case "P2004":
      case "P2005":
      case "P2006":
      case "P2006":
      case "P2007":
      case "P2008":
      case "P2009":
      case "P2011":
      case "P2012":
      case "P2013":
      case "P2014":
      case "P2016":
      case "P2017":
      case "P2019":
      case "P2020":
      case "P2023":
      case "P2026":
        err.status = 400;
        break;
      case "P2001":
      case "P2015":
      case "P2018":
      case "P2021":
      case "P2022":
      case "P2025":
        err.status = 404;
        break;
      case "P2002":
      case "P2003":
        err.status = 500; // arguably, status code 422 could be used here
        break;
      default: {
        err.status = 500;
      }
    }
  }

  // Set http status code for instances of PrismaClientValidationError
  if (err.name === "PrismaClientValidationError") {
    err.status = 400;
  }

  // Write the error to the console
  console.log(`Error: ${err.status} ${err.name}:\n${err.message}`);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Something went wrong!" });

  next();
};

export default errorHandler;
