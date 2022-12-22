import { components } from "./components";
import { paths } from "./paths";
import { schemas } from "./schemas";

export default {
  openapi: "3.0.0",
  info: {
    title: "Survey Backend API",
    description: "API for the survey app backend",
    version: "1.5.1",
  },
  servers: [
    {
      url: "/api",
    },
  ],
  tags: [
    {
      name: "Login",
    },
    {
      name: "Surveys",
    },
  ],
  paths: paths,
  components: components,
  schemas: schemas,
};
