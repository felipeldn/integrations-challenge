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
import { response } from 'express';
import HTTPClient from '../common/HTTPClient';

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

    throw new Error('Method Not Implemented');
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
