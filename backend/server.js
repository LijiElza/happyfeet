
import express from "express";
import Stripe from 'stripe';
import uuid from "uuidv4";
import cors from "cors";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const db = require('./db.json');

const stripe = new Stripe('sk_test_51GudyFAEkbUpGireOUBdVTNichDcFwfQCfYpmVFBS0sjwYVYjy6vgpxmiBbZgrcxxA7XWCjJhRpihURdWywW20ta00ggAKZLs0');

const app = express();
app.use(express.json());
app.use(cors());

app.get("/products", async (req, res) => {
    var response=''
    let error;
    let status;
    try {
         response=db;
        status = "success";
    }
    catch (error) {
        console.error("Error:", error);
        status = "failure";
    }
    res.json({ error, status ,response});
})
app.post("/checkout", async (req, res) => {
    let error;
    let status;
    try {
        const { token, price } = req.body;

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });

        const charge = await stripe.charges.create(
            {
                amount: price,
                currency: "inr",
                customer: customer.id,
                receipt_email: token.email,
                description: `Purchased shoes`,
                shipping: {
                    name: token.card.name,
                    address: {
                        line1: token.card.address_line1,
                        line2: token.card.address_line2,
                        city: token.card.address_city,
                        country: token.card.address_country,
                        postal_code: token.card.address_zip
                    }
                }
            }
        );
        status = "success";
    } catch (error) {
        console.error("Error:", error);
        status = "failure";
    }

    res.json({ error, status });
});

app.listen(5000);
