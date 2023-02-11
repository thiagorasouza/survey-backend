export const unauthorized = {
  description: "Unauthorized: needs authentication",
  content: {
    "application/json": {
      schema: {
        $ref: "#/schemas/error",
      },
    },
  },
};
