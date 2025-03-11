//calculate totals
function calculateTotals() {
    const rows = document.querySelectorAll('#invoice-items tr');
    let subtotal = 0;
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const qty = parseInt(cells[0].textContent);
        const price = parseFloat(cells[2].textContent.replace('₱', ''));
        const total = qty * price;
        
        cells[3].textContent = `₱${total.toFixed(2)}`;
        subtotal += total;
    });
    
    const taxRate = 0.10;
    const tax = subtotal * taxRate;
    const grandTotal = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `₱${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `₱${tax.toFixed(2)}`;
    document.getElementById('grand-total').textContent = `₱${grandTotal.toFixed(2)}`;
}

//update date to current date
function updateDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateElement = document.getElementById('invoice-date');
    if (dateElement) {
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    } else {
        console.error("Invoice date element not found!");
    }
}

//generate sequential invoice number
function generateSequentialInvoiceNumber() {
    //get the last invoice number from localStorage
    let lastInvoiceNumber = localStorage.getItem('lastInvoiceNumber') || 0;
    
    //increment the number
    let newInvoiceNumber = parseInt(lastInvoiceNumber) + 1;
    
    //format to have leading zeros (0001, 0002, etc.)
    let formattedNumber = newInvoiceNumber.toString().padStart(4, '0');
    
    //save the new number for next time
    localStorage.setItem('lastInvoiceNumber', newInvoiceNumber);
    
    //update the invoice number on the page
    const invoiceNumberElement = document.getElementById('invoice-number');
    if (invoiceNumberElement) {
        invoiceNumberElement.textContent = formattedNumber;
    } else {
        console.error("Invoice number element not found!");
    }
}

//add new item row
function addItemRow(qty, description, detail, price) {
    const tbody = document.getElementById('invoice-items');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>${qty}</td>
        <td>
            <div>${description}</div>
            <div class="item-description">${detail}</div>
        </td>
        <td>$${price.toFixed(2)}</td>
        <td>$${(qty * price).toFixed(2)}</td>
    `;
    
    tbody.appendChild(newRow);
    calculateTotals();
}

//reset invoice numbers (for testing purposes)
function resetInvoiceNumbers() {
    localStorage.removeItem('lastInvoiceNumber');
    alert('Invoice numbers reset to start from 0001 again');
}

//make sure the DOM is loaded before executing our functions
function initializeInvoice() {
    console.log("Initializing invoice...");

    updateDate();
    generateSequentialInvoiceNumber();
    calculateTotals();
}

function download() {
    print()
}

//try both DOMContentLoaded and window.onload to ensure scripts run
document.addEventListener('DOMContentLoaded', initializeInvoice);

//fallback in case DOMContentLoaded doesn't fire
window.onload = function() {
    const dateElement = document.getElementById('invoice-date');
    const invoiceNumberElement = document.getElementById('invoice-number');
    
    //check if elements are still empty after DOMContentLoaded
    if (!dateElement.textContent || !invoiceNumberElement.textContent) {
        console.log("Elements still empty, initializing again...");
        initializeInvoice();
    }
};

//immediate execution attempt with a slight delay
setTimeout(function() {
    const dateElement = document.getElementById('invoice-date');
    const invoiceNumberElement = document.getElementById('invoice-number');
    
    //check if elements exist but are empty
    if (dateElement && invoiceNumberElement && 
        (!dateElement.textContent || !invoiceNumberElement.textContent)) {
        console.log("Running delayed initialization...");
        initializeInvoice();
    }
}, 500);