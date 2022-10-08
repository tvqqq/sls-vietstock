"use strict";
const fetch = require("node-fetch");

// redis
const { createClient } = require("redis");
const client = createClient({
  url: process.env.REDIS_URL,
});

module.exports.stockInfo = async (event) => {
  await client.connect();
  const PREFIX_REDIS_KEY = "vietstock_";
  const query = event.queryStringParameters;
  if (query === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: "Ticket is not found!",
          input: event,
        },
        null,
        2
      ),
    };
  }
  let body = await client.get(PREFIX_REDIS_KEY + query.ticket);
  body = JSON.parse(body);
  if (body === null) {
    const response = await fetch(
      "https://finance.vietstock.vn/company/tradinginfo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Cookie: "__RequestVerificationToken=" + process.env.COOKIE,
        },
        body:
          "code=" +
          query.ticket +
          "&s=0&t=&__RequestVerificationToken=" +
          process.env.BODY_TOKEN,
      }
    );
    body = await response.json();
    await client.set(PREFIX_REDIS_KEY + query.ticket, JSON.stringify(body), {
      EX: 60 * 5,
    });
  }
  await client.quit();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        data: body,
      },
      null,
      2
    ),
  };
};
