// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, _next) {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
  });
};
