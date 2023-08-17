module.exports = {
    /*
Mortgage interest rate 2.5% per year

Payment formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
P = Payment
L = Loan Principal
c = Interest Rate
n = Number of payments 
*/
    /**
     * This is the calculation function. The asking price, down payment, amortization are all
     * numeric, so we have to check to see if they are sent correctly.
     * 
     * The payment schedule is only biweekly, weekly or monthly

     */
    calculate: function(loan_principal, amortization_period, payment_schedule, apy) {
        var number_of_payments;

        if (payment_schedule == undefined || !(payment_schedule == 'biweekly'  || 
            payment_schedule != 'weekly' || payment_schedule != 'monthly'))
        {
            // Incorrect payment schedule, throw error
            return "The payment schedule is not biweekly, weekly or monthly.";
        }

        // Check if the asking price is a number
        if (isNaN(loan_principal))
        {
            return "Loan Principal is not a valid number.";
        }

        // Check if the amortization period is a number
        if (isNaN(amortization_period))
        {
            return "The amortization period is not a valid number.";
        }

        // Min 5 years, max 30 years
        if (amortization_period < 5 && amortization_period > 30)
        {
            return "An invalid amortization period was given."
        }

        // calculate the number of payments
        var number_of_payments;
        if (payment_schedule == 'biweekly')
        {
            number_of_payments = 26 * amortization_period;
        }
        else if (payment_schedule == 'weekly')
        {
            number_of_payments = 52 * amortization_period;
        }
        else if (payment_schedule == 'monthly')
        {
            number_of_payments = 12 * amortization_period;
        }

        return mortgage.calculate_payment(loan_principal, apy / (100*12), number_of_payments);
    }
}

var mortgage = 
{
 
     /**
     * Payment Formula
     * Payment formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
        P = Payment
        L = Loan Principal
        c = Interest Rate
        n = Number of payments 
     */
    calculate_payment: function(L, c, n)
    {
        console.log("Loan Principal = " + L);
        console.log("Interest Rate = " + c);
        console.log("Term = " + n);


        var multiple = Math.pow((1 + c),n);
        console.log("Multiple = " + multiple);
        var p = L * c * multiple / (multiple - 1);

        // return the float as a dollar value XXXX.XX
        console.log("Payment = " + p);
        return p.toFixed(2);
    }
}