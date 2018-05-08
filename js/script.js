// focus on the name input when the page loads
window.onload = () => document.getElementById("name").focus();

const jobRole             = document.getElementById("title");
const design              = document.getElementById("design");
const color               = document.getElementById("color");
const input               = document.getElementById("other-title");
const activitiesContainer = document.getElementsByClassName("activities");

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
color.disabled = true;

// hide "other title"
input.style.display = "none";

// noinspection JSCheckFunctionSignatures
jobRole.insertAdjacentElement("afterEnd", input);

jobRole.addEventListener("change", function (event) {
	const otherTitle = document.getElementById("other-title");
	// noinspection JSUnresolvedVariable
	if (event.target.selectedIndex === 5) {
		otherTitle.style.display = "inherit";
	} else {
		otherTitle.style.display = "none";
	}
});

design.addEventListener("change", function (event) {
	// noinspection JSUnresolvedVariable
	const selectedIndex = event.target.selectedIndex;

	color.disabled = selectedIndex === 0;

	// JS Puns was selected
	if (selectedIndex === 1) {
		for (let i = 0; i < color.options.length; i++) {
			color.options[i].disabled = !color.options[i].textContent.includes("Puns");
		}
	}

	// I <3 JS was selected
	else if (selectedIndex === 2) {
		for (let i = 0; i < color.options.length; i++) {
			color.options[i].disabled = color.options[i].textContent.includes("Puns");
		}
	}

});

for (let i = 0; i < activities.length; i++) {
	if (activities[i].parentElement.innerText.includes("9am")) {
		activities[i].className = "first_block";
	} else if (activities[i].parentElement.innerText.includes("1pm")) {
		activities[i].className = "second_block";
	}

	activities[i].addEventListener("change", function (event) {
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
		if (totalCost > 0) {
			totalCostValue.style.display = "inherit";
			totalCostValue.innerText     = "Total: $" + totalCost;
			activitiesContainer[0].appendChild(totalCostValue);
		} else {
			totalCostValue.style.display = "none";
		}
	});
}


payment.addEventListener("change", function(event) {
	const selectedIndex = event.target.selectedIndex;

	// credit card
	if (selectedIndex === 1) {
		creditCard.style.display = "inherit";

		paypal.style.display = "none";
		bitcoin.style.display = "none";
	}

	// paypal
	else if (selectedIndex === 2) {
		paypal.style.display = "inherit";

		creditCard.style.display = "none";
		bitcoin.style.display = "none";
	}

	// bitcoin
	else if (selectedIndex === 3) {
		bitcoin.style.display = "inherit";

		creditCard.style.display = "none";
		paypal.style.display = "none";
	}

});
