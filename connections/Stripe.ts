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
   
    function encodedPaymentDetails(request: RawAuthorizationRequest<APIKeyCredentials, CardDetails>): string {
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

      return paymentDetails;
  }
       
    return HTTPClient.request(
      'https://api.stripe.com/v1/payment_intents',
      {
        method: 'post',
        body: encodedPaymentDetails(request),
        headers:
          {
            'Authorization': `Bearer ${request.processorConfig.apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
      }
    ).then((result) => {
        const response = JSON.parse(result.responseText)

        // console.log(response)

        if (result.statusCode === 200) {
          return {
            transactionStatus: 'AUTHORIZED',
            processorTransactionId: response['id']
          } as ParsedAuthorizationResponse;
        } 
        else if (result.statusCode === 402) {
          return {
            transactionStatus: 'DECLINED',
            declineReason: response['error']['message']
          } as ParsedAuthorizationResponse;
        } else {
          return {
            transactionStatus: 'FAILED',
            errorMessage: response['error']['message']
          } as ParsedAuthorizationResponse;
        }
      })
      .catch(() => {
        return {
          transactionStatus: 'FAILED',
          errorMessage: 'Unable to connect with Stripe API, please try again.'
        }
      })
  },



  /**
   * Capture a payment intent
   * This method should capture the funds on an authorized transaction
   */
  capture(
    request: RawCaptureRequest<APIKeyCredentials>,
  ): Promise<ParsedCaptureResponse> {

    return HTTPClient.request(
      `https://api.stripe.com/v1/payment_intents/${request.processorTransactionId}/capture`,
      {
        method: 'post',
        body: '',
        headers: 
          {
            'Authorization': `Bearer ${request.processorConfig.apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
      }
    ).then((result) => {
        const response = JSON.parse(result.responseText)

        if (result.statusCode === 200) {
          return {
            transactionStatus: 'SETTLED'
          } as ParsedCaptureResponse;
        } else {
          return {
            transactionStatus: 'FAILED',
            errorMessage: response['error']['message']
          } as ParsedCaptureResponse;
        }
      })
      .catch(() => {
        return {
          transactionStatus: 'FAILED',
          errorMessage: 'Unable to connect with Stripe API, please try again.'
        }
      })
  },



  /**
   * Cancel a payment intent
   * This one should cancel an authorized transaction
   */
   cancel(
    request: RawCancelRequest<APIKeyCredentials>,
  ): Promise<ParsedCancelResponse> {

    return HTTPClient.request(
      `https://api.stripe.com/v1/payment_intents/${request.processorTransactionId}/cancel`,
      {
        method: 'post',
        body: '',
        headers: 
          {
            'Authorization': `Bearer ${request.processorConfig.apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
      }
    ).then((result) => {
        const response = JSON.parse(result.responseText)

        if (result.statusCode === 200) {
          return {
            transactionStatus: 'CANCELLED'
          } as ParsedCancelResponse;
        } else {
          return {
            transactionStatus: 'FAILED',
            errorMessage: response['error']['message']
          } as ParsedCancelResponse;
        }
    })
    .catch(() => {
      return {
        transactionStatus: 'FAILED',
        errorMessage: 'Unable to connect to Stripe API, please try again.'
      }
    })

  },

};

export default StripeConnection;
