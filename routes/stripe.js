const router = require("express").Router();
// const stripe = require("stripe")(process.env.STRIPE_KEY); // process.env not work here
const stripe = require("stripe")(
  "sk_test_51LMQMsERUvHz2eQwMnkaA5NUFGmZEH5S9MnJ4w3HRu9qEjqIynPwGOtNdSPR0O5jRQ831XEQzLZ4cf7weRXuD8Y300OZttC1sV"
);

// amount for react https://www.npmjs.com/package/react-stripe-checkout
router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req?.body?.tokenId,
      amount: req?.body?.amount,
      currency: "usd",
      // amount: {1000000} // cents
      // email="w.ptucky@gmail.com"
    },
    (stripeError, stripeRes) => {
      if (stripeError) {
        res.status(500).json(stripeError);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
