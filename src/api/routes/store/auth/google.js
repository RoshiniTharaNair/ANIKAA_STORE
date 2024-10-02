import { Router } from 'express';

const route = Router();

export default (app) => {
  app.use('/store/auth/google', route);

  route.post('/', async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    try {
      const customerService = req.scope.resolve('customerService');
      const customer = await customerService.retrieveByEmail(email);

      // Create a session for the customer
      req.session.customer_id = customer.id;
      res.json({ customer });
    } catch (error) {
      if (error.type === 'not_found') {
        // Customer not found, create a new one
        try {
          const customerService = req.scope.resolve('customerService');
          const customer = await customerService.create({ email });
          // Create a session for the new customer
          req.session.customer_id = customer.id;
          res.json({ customer });
        } catch (createError) {
          res.status(500).json({ message: 'Error creating customer' });
        }
      } else {
        res.status(500).json({ message: 'Error retrieving customer' });
      }
    }
  });

  return app;
};
