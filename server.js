require('dotenv').config()
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('server.ejs')
})

app.post('/checkout', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'foremedia video'
                    },
                    unit_amount: 10 * 100
                },
                quantity: 1
            },
            // {
            //     price_data: {
            //         currency: 'usd',
            //         product_data: {
            //             name: 'JavaScript T-Shirt'
            //         },
            //         unit_amount: 20 * 100
            //     },
            //     quantity: 2
            // }            
        ],
        mode: 'payment',
        // shipping_address_collection: {
        //     allowed_countries: ['US', 'BR']
        // },
        success_url: `http://localhost/3000/complete`,
        cancel_url: `http://localhost/3000/cancel`
    })

    console.log(session)
})

// app.get('/complete', async (req, res) => {
//     const result = Promise.all([
//         stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['payment_intent.payment_method'] }),
//         stripe.checkout.sessions.listLineItems(req.query.session_id)
//     ])

//     console.log(JSON.stringify(await result))

//     res.send('Your payment was successful')
// })

app.get('/cancel', (req, res) => {
    res.redirect('/')
})

app.listen(3000, () => console.log('Server started on port 3000'))