export default {
  mongoUrl: process.env.MONGO_URL || "mongodb://mongo:27017/survey",
  port: process.env.PORT || "5000",
  jwtSecret: process.env.JWT_SECRET || "secret",
};
