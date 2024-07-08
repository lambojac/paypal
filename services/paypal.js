const axios = require("axios");

const generateAccessToken = async () => {
  try {
    const response = await axios({
      url: `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, 
      method: "post",
      data: "grant_type=client_credentials",
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_SECRET
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log(response.data)
    return response.data.access_token;
  } catch (error) {
    console.error("Error generating access token:", error.response ? error.response.data : error.message);
  }
};

const createOrder = async () => {
  try {
    const accessToken = await generateAccessToken();
    const response = await axios({
      url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      method: "post",
      headers: {
        'Content-Type': 'application/json',
        'PayPal-Request-Id': '7b92603e-77ed-4896-8e78-5dea2050476a',
        'Authorization': `Bearer ${accessToken}`
      },
      data: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          items: [
            {
              name: "Nodejs course",
              description: "Nodejs course with express",
              quantity: 1,
              unit_amount: {
                currency_code: "USD",
                value: '100.00'
              }
            }
          ],
          amount: {
            currency_code: "USD",
            value: "100.00",
            breakdown: {
              item_total: { // Corrected this line
                currency_code: "USD",
                value: '100.00'
              }
            }
          },
          application_context: {
            return_url: "http://localhost:3000/complete-order",
            cancel_url: "http://localhost:3000/cancel-order",
          }
        }]
      })
    });
    console.log(response.data);
  } catch (error) {
    console.error("Error creating order:", error.response ? error.response.data : error.message);
  }
};

createOrder();
