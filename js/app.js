//////////////////////////////////////////////
// Data controller
const DataController = (function() {
	class Data {
		constructor(id, image, name, price) {
			this.id = id;
			this.image = image;
			this.name = name;
			this.price = price;
		}
	}

	const data = {
		items: [],
		total_price: 0
	};

	return {
		addStoreItem: (image, name, price) => {
			let newItem, id;

			// Generataing the id for each item
			if (data.items.length > 0) {
				id = data.items[data.items.length - 1].id + 1;
			} else {
				id = 0;
			}

			newItem = new Data(id, image, name, price);
			data.items.push(newItem);

			return newItem;
		},

		calculateTotalPrice: () => {
			let sum = 0;
			data.items.forEach(cur => {
				sum += parseFloat(cur.price);
			});

			data.total_price = sum;
		},

		getData: () => {
			return {
				items: data.items,
				totalPrice: data.total_price
			};
		},

		testing: () => {
			console.log(data);
		}
	};
})();

//////////////////////////////////////////////
// UI controller
const UIController = (function() {
	const domStrings = {
		cartContainer: "cart",
		cartBtn: "cart-info",
		showCart: "show-cart",
		storeItemIcon: ".store-item-icon",
		totalsContainer: ".cart-total-container"
	};

	return {
		// toggles the cart object
		showCart: () => {
			const cart = document.getElementById(domStrings.cartContainer);
			cart.classList.toggle("show-cart");
		},

		// Get data
		getData: event => {
			// Getting the Image
			let fullPath, pos, partialPath;
			if (event.target.parentElement.classList.contains("store-item-icon")) {
				fullPath = event.target.parentElement.previousElementSibling.src;
				pos = fullPath.indexOf("img") + 3;
				partialPath = fullPath.slice(pos);

				return {
					name: event.target.parentElement.parentElement.nextElementSibling.children[0].children[0].textContent,
					price: event.target.parentElement.parentElement.nextElementSibling.children[0].children[1].children[0].textContent,
					image: `img-cart${partialPath}`
				};
			} else if (event.target.classList.contains("store-item-icon")) {
				fullPath = event.target.previousElementSibling.src;
				pos = fullPath.indexOf("img") + 3;
				partialPath = fullPath.slice(pos);

				return {
					name: event.target.parentElement.nextElementSibling.children[0].children[0].textContent,
					price: event.target.parentElement.nextElementSibling.children[0].children[1].children[0].textContent,
					image: `img-cart${partialPath}`
				};
			}
		},

		addItemToUi: obj => {
			let element, html;

			element = domStrings.totalsContainer;

			html = `
			<div class="cart-item d-flex justify-content-between align-items-center text-capitalize my-3">
				<img src="${obj.image}" class="img-fluid rounded-circle" id="item-img" alt="">
				<div class="item-text">
					<p id="cart-item-title" class="font-weight-bold mb-0">${obj.name}</p>
					<span>$</span>
					<span id="cart-item-price" class="cart-item-price" class="mb-0">${obj.price}</span>
				</div>
				<a href="#" id='cart-item-remove' class="cart-item-remove">
					<i class="fas fa-trash"></i>
				</a>
			</div>
			`;

			document.querySelector(element).insertAdjacentHTML("beforebegin", html);
		},

		UpdateUiTotals: obj => {
			document.getElementById("cart-total").textContent = obj.totalPrice;
			document.querySelector(".item-total").textContent = obj.totalPrice;
			document.getElementById("item-count").textContent = obj.items.length;
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

	const updateTotals = () => {
		// Calculate data totals
		dataCtrl.calculateTotalPrice();

		// get data from our ui
		const data = dataCtrl.getData();

		// update ui
		uiCtrl.UpdateUiTotals(data);
	};

	const addItem = event => {
		// Get data(image, price, name)
		const data = uiCtrl.getData(event);

		// Add item to data
		const item = dataCtrl.addStoreItem(data.image, data.name, data.price);

		// Add item to ui
		uiCtrl.addItemToUi(item);
		alert("Item has been added to cart");

		// Update totals
		updateTotals();
	};

	return {
		init() {
			console.log("Application has started ...");

			setUpEventListeners();
		}
	};
})(DataController, UIController);

AppController.init();
