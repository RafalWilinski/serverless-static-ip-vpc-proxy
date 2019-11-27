import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import * as request from "request-promise-native";
import "source-map-support/register";
import response from "./response";

const transformUrl = (event: APIGatewayProxyEvent) => {
  const query = Object.keys(event.queryStringParameters)
    .map(key => `${key}=${event.queryStringParameters[key]}`)
    .join("&");

  return `${process.env.BASE_URL}${event.pathParameters}${
    query ? `?${query}` : undefined
  }`;
};

const transformHeaders = (event: APIGatewayProxyEvent) => {
  return {
    // add any custom headers here
    ...event.headers
  };
};

export const handle: APIGatewayProxyHandler = async (event, _context) => {
  console.log(
    event.path,
    event.pathParameters,
    event.queryStringParameters,
    event.body,
    event.headers
  );

  const params = {
    uri: transformUrl(event),
    method: event.httpMethod,
    headers: transformHeaders(event),
    body: event.body
  };

  console.log("Calling", params);

  try {
    const payload = await request(params).promise();

    return response({ payload });
  } catch (error) {
    console.log("Error", params, error);
    return response({ error }, 400);
  }
};
