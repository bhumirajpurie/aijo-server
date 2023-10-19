//if the route was not found, respond with a 404 not found
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl} 😥`);
  res.status(404);
  next(error);
};

//overwriting the default error handler
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    status: "error",
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
