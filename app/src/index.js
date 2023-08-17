var express = require('express');
var mortgage = require('./mortgage');
var app = express()
const port = process.env['PORT'] || 8080
 
// SIGTERM Handler

process.on('SIGTERM', async () => {
    console.info('[express] SIGTERM received');

    console.info('[express] cleaning up');
    // perform actual clean up work here.
    await new Promise(resolve => setTimeout(resolve, 100));

    console.info('[express] exiting');
    process.exit(0)
});

app.get('/', function(req, res) {
    var errorMessage = "Call GET on /rate instead";
    return res.send(errorMessage)
});

/**
 * This is the rate call.
 * Gets the monthly value allotted.
 */
app.get('/rate', function (req, res) {

    var loan_principal = req.query.loan_principal;
    var amortization_period = req.query.amortization_period;
    var payment_schedule = req.query.payment_schedule;
    var apy = req.query.apy;

    // If all the parameters exist
    if (loan_principal && amortization_period && payment_schedule && apy)
    {
        // calculate the monthly payment
        var monthly_payment = mortgage.calculate(loan_principal, amortization_period, payment_schedule, apy);

        // if the payment is not a number display the error
        if (isNaN(monthly_payment))
        {
            return res.send(showError(monthly_payment, 500));
        }
        else
        {
            // display the JSON if the monthly_payment exists
            res.json(
                {
                    monthly_payment : parseFloat(monthly_payment),
                    status: 200,
                    timestamp : parseInt(Date.now()/1000)
                });
        }
    }
    else
    {
        // Find out which variable(s) don't exist and tell the user
        var errorMessage = "";
        if (!loan_principal)
        {
            errorMessage += 'Loan Principal does not exist. ';
        }
        if (!amortization_period)
        {
            errorMessage += 'Amortization period does not exist. ';
        }
        if (!payment_schedule)
        {
            errorMessage += 'Payment Schedule does not exist. ';
        }
        if (!apy)
        {
            errorMessage += 'Interest Rate/ APY does not exist. ';
        }

        return res.send(showError(errorMessage, 404));
    }
});

/**
 * This function is used to show the error message
 * msg, the message that you want to display
 * status, the error status number
 */
var showError = function(msg, status)
{
    var error = new Error();
    error.errorMessage = msg;
    error.status = status;
    error.timestamp = parseInt(Date.now()/1000);
    return error;
}

/**
 * Listen in on http://localhost:{port}
 */

app.listen(port, () => {
    console.log(`Mortgage app listening at http://localhost:${port}`)
})