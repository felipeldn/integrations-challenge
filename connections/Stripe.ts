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

    //POST data form-encoded as recommended in Stripe docs - https://stripe.com/docs/api
    const paymentDetails = 
      `amount=${request.amount}` +
      `&currency=${request.currencyCode}` +
      `&confirm=true` +
      `&capture_method=manual` +
      `&payment_method_data[type]=card` +
      `&payment_method_data[card][number]=${request.paymentMethod.cardNumber}` +
      `&payment_method_data[card][exp_month]=${request.paymentMethod.expiryMonth}` +
      `&payment_method_data[card][exp_year]=${request.paymentMethod.expiryYear}` +
      `&payment_method_data[billing_details][name]=${request.paymentMethod.cardholderName}`
      
    
    let response = HTTPClient.request(
      'https://api.stripe.com/v1/payment_intents',
      {
        method: 'post',
        body: paymentDetails,
        headers:
          {
            Authorization: `Bearer ${request.processorConfig.apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
      }
    );

    let authorizationResponse = response
      .then((result) => {
        response = JSON.parse(result.responseText)

        // console.log(result)

        let parsedAuthorizationResponse :ParsedAuthorizationResponse

        if (result.statusCode == 200) {
          parsedAuthorizationResponse = {
            transactionStatus: 'AUTHORIZED',
            processorTransactionId: response['id']
          }
        }
        else if (result.statusCode == 402) {
          parsedAuthorizationResponse = {
            transactionStatus: 'DECLINED',
            declineReason: response['error']['message']
          }
        } else {
          parsedAuthorizationResponse = {
            transactionStatus: 'FAILED',
            errorMessage: response['error']['message']
          }
        }
      return parsedAuthorizationResponse
      })
      .catch(() => {
        let parsedAuthorizationResponse :ParsedAuthorizationResponse
          parsedAuthorizationResponse = {
            transactionStatus: 'FAILED',
            errorMessage: 'Unable to connect with Stripe API, please try again.'
          }
        return parsedAuthorizationResponse
      })

      return authorizationResponse
  },



  /**
   * Capture a payment intent
   * This method should capture the funds on an authorized transaction
   */
  capture(
    request: RawCaptureRequest<APIKeyCredentials>,
  ): Promise<ParsedCaptureResponse> {

    let response = HTTPClient.request(
      `https://api.stripe.com/v1/payment_intents/${request.processorTransactionId}/capture`,
      {
        method: 'post',
        body: '',
        headers: 
          {
            Authorization: `Bearer ${request.processorConfig.apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
      }
    );

    let parsedCaptureResponse = response
      .then((result) => {
        response = JSON.parse(result.responseText)

        // console.log(result)

        let parsedCaptureResponse :ParsedCaptureResponse

        if (result.statusCode == 200) {
          parsedCaptureResponse = {
            transactionStatus: 'SETTLED'
          }
        } else {
          parsedCaptureResponse = {
            transactionStatus: 'FAILED',
            errorMessage: response['error']['message']
          }
        }
        return parsedCaptureResponse
      })
      .catch(() => {
        let parsedAuthorizationResponse :ParsedAuthorizationResponse
        parsedAuthorizationResponse = {
          transactionStatus: 'FAILED',
          errorMessage: 'Unable to connect with Stripe API, please try again.'
        }
        return parsedAuthorizationResponse
      })

    return parsedCaptureResponse
  },



  /**
   * Cancel a payment intent
   * This one should cancel an authorized transaction
   */
   cancel(
    request: RawCancelRequest<APIKeyCredentials>,
  ): Promise<ParsedCancelResponse> {

    let response = HTTPClient.request(
      `https://api.stripe.com/v1/payment_intents/${request.processorTransactionId}/cancel`,
      {
        method: 'post',
        body: '',
        headers: 
          {
            Authorization: `Bearer ${request.processorConfig.apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
      }
    )

    let parsedCancelResponse = response
      .then((result) => {
        response = JSON.parse(result.responseText)

        // console.log(result)

        let parsedCancelResponse :ParsedCancelResponse

        if (result.statusCode == 200) {
          parsedCancelResponse = {
            transactionStatus: 'CANCELLED'
          }
        } else {
          parsedCancelResponse = {
            transactionStatus: 'FAILED',
            errorMessage: response['error']['message']
          }
        }

    return parsedCancelResponse
    })
    .catch(() => {
      let parsedAuthorizationResponse :ParsedAuthorizationResponse
      parsedAuthorizationResponse = {
        transactionStatus: 'FAILED',
        errorMessage: 'Unable to connect with Stripe API, please try again.'
      }
      return parsedAuthorizationResponse
    })

  return parsedCancelResponse

  },
};

export default StripeConnection;
