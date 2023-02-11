export const loginPath = {
  post: {
    tags: ["Accounts"],
    summary: "API to authenticate user",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/loginParams",
          },
        },
      },
    },
    responses: {
      200: {
        description: "Authenticated successfully",
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
      401: {
        description: "Username or password incorrect",
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
