// focus on the name input when the page loads
window.onload = () => document.getElementById("name").focus();

const emailValidation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// form elements
const form                = document.getElementsByTagName("FORM")[0];
const name                = document.getElementById("name");
const email               = document.getElementById("email");
const jobRole             = document.getElementById("title");
const shirtDesign         = document.getElementById("design");
const shirtColor          = document.getElementById("color");
const otherTitle          = document.getElementById("other-title");
const creditCardNumber    = document.getElementById("cc-num");
const creditCardZip       = document.getElementById("zip");
const creditCardCvv       = document.getElementById("cvv");
const submit              = document.querySelector("[type=submit]");
const activitiesContainer = document.getElementsByClassName("activities");

// array of elements to validate
const elementsToValidate = [name, email, creditCardNumber, creditCardZip, creditCardCvv];
let formValidated        = true;

// payment methods
const payment    = document.getElementById("payment");
const creditCard = document.getElementById("credit-card");
const paypal     = document.getElementById("paypal");
const bitcoin    = document.getElementById("bitcoin");

// hide paypal and bitcoin initially
paypal.style.display  = "none";
bitcoin.style.display = "none";

let totalCost = 0;

const activities = document.querySelectorAll(".activities input");

const totalCostValue = document.createElement("H3");

// disable the color input until a design has been chosen
shirtColor.disabled = true;

// hide "other title"
otherTitle.style.display = "none";

// noinspection JSCheckFunctionSignatures
jobRole.insertAdjacentElement("afterEnd", otherTitle);

jobRole.addEventListener("change", function (event) {
	const otherTitle = document.getElementById("other-title");
	// noinspection JSUnresolvedVariable
	if (event.target.selectedIndex === 5) {
		otherTitle.style.display = "inherit";
	} else {
		otherTitle.style.display = "none";
	}
});

shirtDesign.addEventListener("change", function (event) {
	// noinspection JSUnresolvedVariable
	const selectedIndex = event.target.selectedIndex;

	shirtColor.disabled = selectedIndex === 0;

	// JS Puns was selected
	if (selectedIndex === 1) {
		for (let i = 0; i < shirtColor.options.length; i++) {
			shirtColor.options[i].disabled = !shirtColor.options[i].textContent.includes("Puns");
		}
	}

	// I <3 JS was selected
	else if (selectedIndex === 2) {
		for (let i = 0; i < shirtColor.options.length; i++) {
			shirtColor.options[i].disabled = shirtColor.options[i].textContent.includes("Puns");
		}
	}

});

for (let i = 0; i < activities.length; i++) {
	const parent   = activities[i].parentElement;
	const checkbox = parent.innerText;

	if (checkbox.includes("9am")) {activities[i].className = "first_block";}
	else if (checkbox.includes("1pm")) {activities[i].className = "second_block";}

	activities[i].addEventListener("change", function (event) {
		parent.parentElement.classList.remove("error");
		const target      = event.target;
		const optionText  = target.parentElement.innerText;
		const firstBlock  = optionText.includes("9am");
		const secondBlock = optionText.includes("1pm");

		if (target.checked) {
			let priceArray = optionText.split("$");
			totalCost += parseInt(priceArray[priceArray.length - 1]);

			if (firstBlock) {
				for (let j = 0; j < activities.length; j++) {
					if (activities[j].className === "first_block" && !activities[j].checked) {
						activities[j].disabled = true;
					}
				}
			} else if (secondBlock) {
				for (let j = 0; j < activities.length; j++) {
					if (activities[j].className === "second_block" && !activities[j].checked) {
						activities[j].disabled = true;
					}
				}
			}
		}

		else if (!target.checked) {
			let priceArray = optionText.split("$");
			totalCost -= parseInt(priceArray[priceArray.length - 1]);

			if (firstBlock) {
				for (let j = 0; j < activities.length; j++) {
					if (activities[j].className === "first_block" && !activities[j].checked) {
						activities[j].disabled = false;
					}
				}
			} else if (secondBlock) {
				for (let j = 0; j < activities.length; j++) {
					if (activities[j].className === "second_block" && !activities[j].checked) {
						activities[j].disabled = false;
					}
				}
			}
		}

		// if totalCost > 0, display the total cost
		if (totalCost > 0) {showTotalCost();}
		else {hideTotalCost();}
	});
}

payment.addEventListener("change", function (event) {
	const selected = event.target.selectedIndex;
	// credit card
	if (selected === 1) {paymentIsCreditCard();}
	// paypal
	else if (selected === 2) {paymentIsPaypal();}
	// bitcoin
	else if (selected === 3) {paymentIsBitcoin();}

});

form.addEventListener("submit", function (event) {
	event.preventDefault();
	if (validateForm()) {form.submit();}
});

elementsToValidate.forEach(function (element) {
	removeErrorOnFocus(element);
});

function validateForm() {
	formValidated        = true;
	let activitySelected = false;

	if (name.value === "") {formError(name, "Don't be insane, you must have a name!");}

	if (email.value === "") {formError(email, "Are you a sea snail? Where is your email!");}

	if (!emailValidation.test(email.value)) {formError(email, "Please enter a valid email");}

	for (let i = 0; i < activities.length; i++) {
		if (activities[i].checked) {
			activitySelected = true;
			break;
		}
	}

	if (!activitySelected) {formError(activitiesContainer[0], "Please select an activity");}

	// user selected credit card
	if (payment.selectedIndex === 1) {
		if (!creditCardNumber.value.length) {formError(creditCardNumber, "Invalid credit card");}
		if (!creditCardZip.value.length) {formError(creditCardZip, "Invalid zip");}
		if (!creditCardCvv.value.length) {formError(creditCardCvv, "Invalid CVV");}
	}

	return formValidated;
}

function formError(element, message) {
	formValidated = false;
	if (element.nextSibling === undefined || element.nextSibling.classList === undefined) {
		let errorText       = document.createElement("DIV");
		errorText.className = "error-text";
		errorText.innerText = message;
		element.insertAdjacentElement("afterEnd", errorText);
	}

	else {
		element.nextSibling.innerText = message;
	}

	element.className += " error";
}

function removeErrorOnFocus(element) {
	element.addEventListener("focus", function () {
		element.classList.remove("error");
	});
}

function showTotalCost() {
	totalCostValue.style.display = "inherit";
	totalCostValue.innerText     = "Total: $" + totalCost;
	if (activitiesContainer[0].lastElementChild.tagName !== "H3") {
		activitiesContainer[0].appendChild(totalCostValue);
	}
}

function hideTotalCost() {
	totalCostValue.style.display = "none";
}

function paymentIsCreditCard() {
	creditCard.style.display = "inherit";

	paypal.style.display  = "none";
	bitcoin.style.display = "none";
}

function paymentIsPaypal() {
	paypal.style.display = "inherit";

	creditCard.style.display = "none";
	bitcoin.style.display    = "none";
}

function paymentIsBitcoin() {
	bitcoin.style.display = "inherit";

	creditCard.style.display = "none";
	paypal.style.display     = "none";
}