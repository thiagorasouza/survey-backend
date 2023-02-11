export const surveysPath = {
  get: {
    security: [
      {
        apiKeyAuth: [],
      },
    ],
    tags: ["Surveys"],
    summary: "API to list surveys",
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/surveys",
            },
          },
        },
      },
      204: {
        description: "No surveys found",
      },
      403: {
        $ref: "#/components/forbidden",
      },
      500: {
        $ref: "#/components/serverError",
      },
    },
  },
  post: {
    security: [
      {
        apiKeyAuth: [],
      },
    ],
    tags: ["Surveys"],
    summary: "API to create surveys",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/addSurveyParams",
          },
        },
      },
    },
    responses: {
      204: {
        description: "Success",
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
        $ref: "#/components/forbidden",
      },
      500: {
        $ref: "#/components/serverError",
      },
    },
  },
};
