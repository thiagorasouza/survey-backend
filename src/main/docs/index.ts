import { components } from "./components";
import { paths } from "./paths";
import { schemas } from "./schemas";

export default {
  openapi: "3.0.0",
  info: {
    title: "Survey Backend API",
    description: "API for The Survey App's backend",
    version: "2.0.0",
  },
  servers: [
    {
      url: "/api",
    },
  ],
  tags: [
    {
      name: "Accounts",
    },
    {
      name: "Surveys",
    },
  ],
  paths: paths,
  components: components,
  schemas: schemas,
};
