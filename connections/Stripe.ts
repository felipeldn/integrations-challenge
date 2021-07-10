import {
  APIKeyCredentials,
  CardDetails,
  ParsedAuthorizationResponse,
  ParsedCancelResponse,
  ParsedCaptureResponse,
  ProcessorConnection,
  RawAuthorizationRequest,
  RawCancelRequest,
  RawCaptureRequest,
} from '@primer-io/app-framework';

import HTTPClient from '../common/HTTPClient';

const StripeConnection: ProcessorConnection<APIKeyCredentials, CardDetails> = {
  name: 'STRIPE',

  website: 'stripe.com',

  configuration: {
    accountId: 'acct_1JABhzB6ZoI1vpjB',
    apiKey: 'sk_test_51JABhzB6ZoI1vpjB9xwAsKXu4nc64P2nkV7PL4MulIiYaljlTGihBZ0zwLhE1bNI9bWcYLFBb3yt0waO8BBl9OqI00WprsplkD',
  },

  /**
   *
   * You should authorize a transaction and return an appropriate response
   */  
  authorize(
    request: RawAuthorizationRequest<APIKeyCredentials, CardDetails>,
  ): Promise<ParsedAuthorizationResponse> {

    // formatting POST data as form-encoded data as per the Stripe documentation
      // https://stripe.com/docs/api
      let encodedData = 
          `amount=${request.amount}`+ 
          `&currency=${request.currencyCode}`+
          '&confirm=true' +
          '&capture_method=manual' +
          '&payment_method_data[type]=card' + 
          `&payment_method_data[card][number]=${request.paymentMethod.cardNumber}` +
          `&payment_method_data[card][exp_month]=${request.paymentMethod.expiryMonth}` + 
          `&payment_method_data[card][exp_year]=${request.paymentMethod.expiryYear}` +
          `&payment_method_data[billing_details][name]=${request.paymentMethod.cardholderName}`

      let response = HTTPClient.request(
        'https://api.stripe.com/v1/payment_intents',
          {
            method: 'post',
            body: encodedData,
            headers:
              {
                Authorization: `Bearer ${request.processorConfig.apiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
              }
          });

      let authorizationResponse = response
        .then((result) => {

          response = JSON.parse(result.responseText)

          let parsedAuthorizationResponse :ParsedAuthorizationResponse

          if (result.statusCode == 200) {
            parsedAuthorizationResponse = {
            transactionStatus: 'AUTHORIZED',
            processorTransactionId: response['id'] }
          }
          else if (result.statusCode == 402) {
            parsedAuthorizationResponse = {
            transactionStatus: 'DECLINED',
            declineReason: response['error']['message'] } 
          } else {
            parsedAuthorizationResponse = {
            transactionStatus: 'FAILED',
            errorMessage: response['error']['message'] }
          }
          return parsedAuthorizationResponse
        })
        .catch(() => {
          let parsedAuthorizationResponse :ParsedAuthorizationResponse
            parsedAuthorizationResponse = {
            transactionStatus: 'FAILED',
            errorMessage: 'Could not connect to Stripe API' }
          return parsedAuthorizationResponse 
        });

       return authorizationResponse

    // throw new Error('Method Not Implemented');
  },

  /**
   * Capture a payment intent
   * This method should capture the funds on an authorized transaction
   */
  capture(
    request: RawCaptureRequest<APIKeyCredentials>,
  ): Promise<ParsedCaptureResponse> {

    throw new Error('Method Not Implemented');
  },

  /**
   * Cancel a payment intent
   * This one should cancel an authorized transaction
   */
  cancel(
    request: RawCancelRequest<APIKeyCredentials>,
  ): Promise<ParsedCancelResponse> {
    throw new Error('Method Not Implemented');
 
  },
};

export default StripeConnection;
