//////////////////////////////////////////////
// Data controller
const DataController = (function() {
	class Model {
		constructor(image, name, price) {
			this.image = image;
			this.name = name;
			this.price = price;
		}

		data = {
			items: [],
			final_price: 0
		};
	}
})();

//////////////////////////////////////////////
// UI controller
const UIController = (function() {
	const domStrings = {
		cartContainer: "cart",
		cartBtn: "cart-info",
		showCart: "show-cart",
		storeItemIcon: ".store-item-icon"
	};

	return {
		// toggles the cart object
		showCart: () => {
			const cart = document.getElementById(domStrings.cartContainer);
			cart.classList.toggle("show-cart");
		},

		// Get data
		getData: event => {
			let fullPath, pos, partialPath;
			if (event.target.parentElement.classList.contain("store-item-icon")) {
				fullPath = event.target.parentElement.previousElementSibiling.src;
				pos = fullPath.indexOf("img") + 3;
				partialPath = fullPath.slice(pos);
			}

			return {
				name: name,
				price: price,
				image: partialPath
			};
		},

		getDomStrings: () => {
			return domStrings;
		}
	};
})();

//////////////////////////////////////////////
// App controller
const AppController = (function(dataCtrl, uiCtrl) {
	let dom = uiCtrl.getDomStrings();

	// Setup the eventlisteners
	const setUpEventListeners = () => {
		// Toggle the cart window
		document.getElementById(dom.cartBtn).addEventListener("click", uiCtrl.showCart);

		// Add item
		const storeIcon = document.querySelectorAll(dom.storeItemIcon);
		storeIcon.forEach(el => {
			el.addEventListener("click", addItem);
		});
	};

	const addItem = event => {
		// Get data(image, price, name)
	};

	return {
		init() {
			console.log("Application has started ...");

			setUpEventListeners();
		}
	};
})(DataController, UIController);

AppController.init();
