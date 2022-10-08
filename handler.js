"use strict";
const fetch = require("node-fetch");

module.exports.stockInfo = async (event) => {
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
  let body = await response.json();

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
