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

import HttpClient from '../common/HTTPClient';

const StripeConnection: ProcessorConnection<APIKeyCredentials, CardDetails> = {
  name: 'STRIPE',

  website: 'stripe.com',

  configuration: {
    accountId: 'acct_1JABhzB6ZoI1vpjB',
    apiKey: 'pk_test_51JABhzB6ZoI1vpjBlt61JzI2Ttj0PvqCwJg3suMFkZJUlcowJZFsyiYcLTd7oYb9s8HWuTMb9LZFh86rwqmkZb6g00YZVVpezI',
  },

  /**
   *
   * You should authorize a transaction and return an appropriate response
   */  
  authorize(
    request: RawAuthorizationRequest<APIKeyCredentials, CardDetails>,
  ): Promise<ParsedAuthorizationResponse> {

    const stripe = require('stripe')(StripeConnection.configuration.apiKey);

    const paymentIntent = stripe.paymentIntents.create({
      amount: 1099,
      currency: 'gbp',
      payment_method_types: ['card'],
      capture_method: 'manual'
    });

    return paymentIntent()
  },

  /**
   * Capture a payment intent
   * This method should capture the funds on an authorized transaction
   */
  capture(
    request: RawCaptureRequest<APIKeyCredentials>,
  ): Promise<ParsedCaptureResponse> {

    const stripe = require('stripe')(StripeConnection.configuration.apiKey)
    
    const captureIntent = stripe.paymentIntents.capture(StripeConnection.configuration.accountId)

    return captureIntent()
  },

  /**
   * Cancel a payment intent
   * This one should cancel an authorized transaction
   */
  cancel(
    request: RawCancelRequest<APIKeyCredentials>,
  ): Promise<ParsedCancelResponse> {
    const stripe = require('stripe')(StripeConnection.configuration.apiKey)

    const cancelTransaction = stripe.paymentIntents.cancel(StripeConnection.configuration.accountId)

    return cancelTransaction()
 
  },
};

export default StripeConnection;
