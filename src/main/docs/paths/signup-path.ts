export const signupPath = {
  post: {
    tags: ["Accounts"],
    summary: "API to create user account",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/signupParams",
          },
        },
      },
    },
    responses: {
      200: {
        description: "Account created",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/account",
            },
          },
        },
      },
      400: {
        description: "Invalid or missing parameters",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/error",
            },
          },
        },
      },
      403: {
        description: "Email already in use",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/error",
            },
          },
        },
      },
      500: {
        $ref: "#/components/serverError",
      },
    },
  },
};
