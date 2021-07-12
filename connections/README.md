# Connections - Processors

Below is an explanation of how to set up and run the code for the Processors challenge. For this exercise, a Processor connection using Stripe's API was required to be impletemented using the `authorize()`, `capture()` and `cancel()` functions.

**Note:** it was required that Stripe's node SDK should **not** be used.

## Set up

You'll need to create an account with [Stripe](https://dashboard.stripe.com/login) and log in to the dashboard. Once you've done that, you should be able to find an API Key in the developer section.

You will also be required to to change your integration settings to 'Handle card information directly' - see here: https://dashboard.stripe.com/settings/integration

IMPORTANT NOTE - In doing your own research, you may find this particular setting referred to elsewhere online as setting Stripe to 'accept non-tokenized card numbers'. This is congruent with older versions of the Stripe dashboard.

The value of `cardNumber` has already been set to `4111111111111111` in `main.ts`, but you can find other useful card numbers in the Stripe docs here: https://stripe.com/docs/testing#cards-responses.

Last, but not least - "the Stripe API accepts form-encoded request bodies, returns JSON-encoded reponses, and uses standard HTTP response codes, authentication, and verbs" - see further details here: https://stripe.com/docs/api

## Getting stuck in

Details on the `paymentIntent` object can be found here: https://stripe.com/docs/api/payment_intents/object.

## Implement the** `authorize()` method in `Stripe.ts`

**Parameters:**
<br/>

`confirm` - This should be manually set to `true` in order to allow the `paymentIntent` to be captured without any further confirmation being required - more details here: https://stripe.com/docs/api/payment_intents/create#create_payment_intent-confirm.

`capture_method` - In order to manually capture a payment, this parameter must be manually set to `manual`. The Stripe API automatically sets a `paymentIntent` to be `captured` immediately after being authorised, setting this parameter to `manual` overrides this - more details here: https://stripe.com/docs/payments/capture-later.

`payment_method_data` - This particular parameter accepts payment method details for details which are not yet registered to a Stripe account. `payment_method_data` must be provided with a type key, and a `card_object` may also be attached. In this case, it has been hard-coded to `card` - more details here: https://stripe.com/docs/api/payment_intents/create#create_payment_intent-payment_method_data.

**Response:**
<br/>

The `paymentIntent` object will be returned with a `status` parameter of `requires_capture`.

## Implement the `capture()` method in `Stripe.ts`

Don't forget to include the `paymentIntent` ID of the `paymentIntent` you want to capture in your API call. 

**Response:**
<br/>

The `paymentIntent` object will be returned with a `status` parameter of `succeeded`.

## Implement the `cancel()` method in `Stripe.ts`

Don't forget to include the `paymentIntent` ID of the `paymentIntent` you want to cancel in your API call. 

**Response:**
<br/>

The `paymentIntent` object will be returned with a `status` parameter of `canceled`.

## Run the program

To run the program use the following command:

```bash
yarn start:processors
```

Happy Coding :D

![Code](https://media.tenor.com/images/8460465dd4597849c320adfe461e91e3/tenor.gif)
