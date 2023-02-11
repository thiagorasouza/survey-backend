export const surveyResultPath = {
  put: {
    security: [
      {
        apiKeyAuth: [],
      },
    ],
    tags: ["Surveys"],
    summary: "API to save a survey answer",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/saveSurveyResultParams",
          },
        },
      },
    },
    parameters: [
      {
        in: "path",
        name: "surveyId",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "Survey answer saved",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/surveyResult",
            },
          },
        },
      },
      401: {
        $ref: "#/components/unauthorized",
      },
      403: {
        description: "Invalid surveyId or answer",
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
  get: {
    security: [
      {
        apiKeyAuth: [],
      },
    ],
    tags: ["Surveys"],
    summary: "API to load survey compiled results",
    parameters: [
      {
        in: "path",
        name: "surveyId",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/surveyResult",
            },
          },
        },
      },
      401: {
        $ref: "#/components/unauthorized",
      },
      403: {
        description: "Invalid surveyId",
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
