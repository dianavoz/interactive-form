//Select all the color options in the 'T-Shirt Info' section
const $colorOption = $('#color option');

//Create div to show the error message for the form validation
const $errorDiv = document.createElement('div');

//Create div to show the total cost in the 'Activities' section
const $totalDiv = $('<div class="total"></div>');

// Set focus on the name input
$('#name').focus();

/* ======================== Job Role ======================== */

$('#other-title, .sr-only').hide();
// If the 'other' option is selected , show the 'other-title' input field, otherwise hide it
$('#title').on('change', function() {
    $(this).val() === 'other' ? $('#other-title').show() : $('#other-title').hide();
});

/* ======================== T-Shirt Info ======================== */

$('#colors-js-puns').hide();
// Append the option to the t-shirt 'Color' menu if the value matches the color
function addItem(colorOne, colorTwo, colorThree) {
    $colorOption.filter(function() {
        return $(this).val() === colorOne || $(this).val() === colorTwo || $(this).val() === colorThree;
    }).appendTo('#color');
}

// For the t-shirt 'Color' menu, only display the color options that match the design selected in the 'Design' menu
$('#design').on('change', function() {
    $('#design option:nth(0)').get(0).disabled = true;
    $('#colors-js-puns').show();
    $colorOption.remove();
    if ($(this).val() === 'js puns') {
        addItem('cornflowerblue', 'darkslategrey', 'gold');
    } else if ($(this).val() === 'heart js') {
        addItem('tomato', 'steelblue', 'dimgrey');
    }
});

/* ======================== Activities Registration ======================== */

//Extracts the price from a specified individual activity
const price = item => {
    return parseInt(item.substring(item.indexOf('$') + 1));
}

// Start with the count with zero total
let $totalCost = 0;

// Appends the total amount to 'Register for Activities'
function appendTotal(total) {
    if ($('.total span') && total > 0) {
        $('.total span').remove();
        $('.activities').append($totalDiv);
        $totalDiv.append(`<span>Total: ${total}</span>`);
    }
}

// If the total is 0, then remove the total from the page
function cost(total) {
    if (total == 0) {
        $('.total span').remove();
    } else {
        return total;
    }
}

// Disables the checkbox and label
function disableCheckbox(time, name, disable) {
    return $('[data-day-and-time="' + time + '"]')
        .not('[name="' + name + '"]')
        .prop('disabled', disable);
}

$('.activities').change((e) => {
    const $clicked = e.target;
    let $item = $($clicked).parent().text();
    const $clickedTime = $($clicked).attr("data-day-and-time");
    const $name = $($clicked).attr("name");

    // Iterate over each checkbox that is checked and add/remove 'disabled' class
    $('.activities input').each(function() {
        if ($clicked.checked) {
            disableCheckbox($clickedTime, $name, true)
                .parent()
                .addClass('disabled');
        } else {
            disableCheckbox($clickedTime, $name, false)
                .parent()
                .removeClass('disabled');
        }
    });

    //Add cost for checked checkbox to the $totalCost
    $clicked.checked ? $totalCost += price($item) : $totalCost -= price($item);
    cost($totalCost);
});


/* ======================== Payment Info ======================== */

//The "Credit Card" payment option should be selected by default. 
$('#payment option[value="Credit Card"]').attr('selected', true);

// Disable the "Select Payment Method" option
$('#payment option[value="select method"]').attr('disabled', true);

function hidePayment() {
    $('#paypal').hide();
    $('#bitcoin').hide();
    $('#credit-card').hide();
}

// Hide the "PayPal" and "Bitcoin" information and show the "Credit Card" information by default
hidePayment();
$('#credit-card').show();

// Payment option in the select menu matches the payment option displayed on the page
$('#payment').change(function() {
    if ($(this).val() === 'Bitcoin') {
        hidePayment();
        $('#bitcoin').show();
    } else if ($(this).val() === 'PayPal') {
        hidePayment();
        $('#paypal').show();
    } else if ($(this).val() === 'Credit Card') {
        hidePayment();
        $('#credit-card').show();
    }
});

/* ======================== Form Validation ======================== */

// Numbers are not allowed
function isValidName(name) {
    return /^[a-zA-Z\s]+$/.test(name);

}

// Must be a valid email address
function isValidEmail(mail) {
    return /^[^@]+@[^@]+\.[a-z]+$/i.test(mail);
}

//Must have 13-16 numbers
function validCreditCardNumber(card) {
    return /^\d{13,16}$/.test(card);
}

//Must have 5 numbers
function validZipCode(zipCode) {
    return /^\d{5}$/.test(zipCode);
}

//Must have 3 numbers
function validCvv(cvv) {
    return /^\d{3}$/.test(cvv);
}

// User must select at least one checkbox
function isActivityChecked() {
    return $('input[type=checkbox]:checked').length > 0;
}

//Create error message
function createMsg(element, msg) {
    $('#' + element).addClass('text-input-error');
    $('#' + element).after($($errorDiv).addClass('error-msg').text(msg));
}

//Remove the error message
function removeMsg(element) {
    $('#' + element).removeClass('text-input-error');
    $('#' + element).after($($errorDiv).text(''));
    $('#' + element).removeClass('error-msg');
}

//Create 'keyup focus' listener to show error message: name, email, credit card, zip code, cvv
//The input can't be empty
function createListener(element, msg, validator) {
    element.on('keyup focus', function() {
        const text = $(this).val();
        const valid = validator($(this).val());
        const tooltip = $(this).attr("id");

        text !== "" && !valid || text == "" ? createMsg(tooltip, msg) : removeMsg(tooltip);
    });
}

createListener($('#name'), 'Please enter a name.', isValidName);
createListener($('#mail'), 'Please enter a valid email.', isValidEmail);
createListener($('#cc-num'), 'Credit card must be between 13 and 16 digits.', validCreditCardNumber);
createListener($('#zip'), 'Must be 5 numbers.', validZipCode);
createListener($('#cvv'), 'Must be 3 numbers.', validCvv);

// Show error message for checkboxes
$('.activities').on('change', function() {
    appendTotal(cost($totalCost));
    if (isActivityChecked()) {
        $('.activities legend').after($($errorDiv).text(''));
        $('.activities legend').removeClass('error-msg');
    } else {
        $('.activities legend').after($($errorDiv)
            .addClass('error-msg')
            .text('Please select at least one activity.'));
    }
});

/* ======================== Submit Button ======================== */

$(":submit").click(function(){
    return false;
 });