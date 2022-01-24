//Expected Input: None
//Expect Return: None
//Get values when the calculate button is pressed
function getValues(){
    let loanAmount = document.getElementById("loanAmount").value;
    let payments = document.getElementById("payments").value;
    let rate = document.getElementById("rate").value;

    loanAmount = parseFloat(loanAmount);
    payments = parseInt(payments);
    rate = parseFloat (rate);

    //validate input

    if (!isNaN(loanAmount) && !isNaN(payments) && !isNaN(rate)) {
        let paymentObjectArray = generatePayments(loanAmount, payments, rate);
        displayPayments(paymentObjectArray, loanAmount);
    }
    else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Only numbers are allowed in the loan calculator'
        });
    }
     
}

//Expected input: float (currency), int, float (currency)
//Expected return: Array of Payment objects [{int, float (currency), float (currency), float (currency), float (currency), float (currency)},...{...}]
//Generate the data based on the loan amount, amount of payments, and interest rate
function generatePayments(loanAmount, payments, rate){
    let paymentObjectArray = [];
    
    //constants
    let payment = (loanAmount) * (rate/1200) / (1- Math.pow((1 + rate/1200),-payments));
    let interest = loanAmount * rate/1200;

    //starting data
    let balance = loanAmount;

    //initializers
    let principal = 0;
    let totalInterest = 0;

    //iterate
    for (let month = 1; month <= payments; month++){
        //calculations
        principal = payment - interest;
        totalInterest += interest;
        balance -= principal;
        if (balance < 0){
            balance = 0;
        }

        //set the data
        let paymentObject = {};

        paymentObject["month"] = i;
        paymentObject["payment"] = payment;
        paymentObject["principal"] = principal;
        paymentObject["interest"] = interest;
        paymentObject["totalInterest"] = totalInterest;
        paymentObject["balance"] = balance;

        paymentObjectArray.push(paymentObject);

        //do this calculation after pushing data
        interest = balance * rate/1200;
    }

    return paymentObjectArray;
}

//Expect input: Array of objects [{int, float (currency), float (currency), float (currency), float (currency), float (currency)},...{...}], float (currency)
//Expected return: none
//Display the data to the html
function displayPayments(paymentObjectArray, loanAmount){
    //Get the template and data
    let template = document.getElementById("paymentData-template");
    let paymentDataBody = document.getElementById("paymentDataBody");
    //clear the data
    paymentDataBody.innerHTML="";


    let currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    })

    //iterate through the array
    for (let i = 0; i < paymentObjectArray.length; i++){
        //get the tr element from the template
        let paymentRow = document.importNode(template.content, true);
        //get an array of td elements from the tr element
        let paymentCols = paymentRow.querySelectorAll("td");

        //put the data into the td elements
        paymentCols[0].textContent = paymentObjectArray[i].month;
        paymentCols[1].textContent = currencyFormatter.format(paymentObjectArray[i].payment);
        paymentCols[2].textContent = currencyFormatter.format(paymentObjectArray[i].principal);
        paymentCols[3].textContent = currencyFormatter.format(paymentObjectArray[i].interest);
        paymentCols[4].textContent = currencyFormatter.format(paymentObjectArray[i].totalInterest);
        paymentCols[5].textContent = currencyFormatter.format(paymentObjectArray[i].balance);

        //append the data
        paymentDataBody.appendChild(paymentRow);
    }


    let finalPaymentObject = paymentObjectArray[paymentObjectArray.length - 1];

    let monthlyPayment = document.getElementById("monthlyPayment");
    let totalPrincipal = document.getElementById("totalPrincipal");
    let totalInterest = document.getElementById("totalInterest");
    let totalCost = document.getElementById("totalCost");

    //replace the other data
    monthlyPayment.innerHTML = currencyFormatter.format(finalPaymentObject.payment);
    totalPrincipal.innerHTML = currencyFormatter.format(loanAmount);
    totalInterest.innerHTML = currencyFormatter.format(finalPaymentObject.totalInterest);
    totalCost.innerHTML = currencyFormatter.format(loanAmount + finalPaymentObject.totalInterest);
}