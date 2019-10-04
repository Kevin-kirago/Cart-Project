// ///////////////////////////////////////////////////////////////
// Storage Controller
// ///////////////////////////////////////////////////////////////

const StorageController = (function() {
	return {
		getItemsFromStorage: function() {
			let data;
			if (localStorage.getItem("Data") === null) {
				data = {
					items: [],
					total_price: 0
				};
			} else {
				data = JSON.parse(localStorage.getItem("Data"));
			}
			return data;
		},

		// Add item to local storage
		addItemToStorage: function(obj) {
			let data;
			let sum = 0;

			if (localStorage.getItem("Data") === null) {
				data = {
					items: [],
					total_price: 0
				};
				// Push new item
				data.items.push(obj);
				data.items.forEach(el => {
					sum += parseFloat(el.price);
				});

				data.total_price = sum;

				// Set ls
				localStorage.setItem("Data", JSON.stringify(data));
			} else {
				// Get what is already in ls
				data = JSON.parse(localStorage.getItem("Data"));

				// Push new item
				data.items.push(obj);
				data.items.forEach(el => {
					sum += parseFloat(el.price);
				});

				data.total_price = sum;

				// Re set ls
				localStorage.setItem("Data", JSON.stringify(data));
			}
		},

		removeItemFromStorage: id => {
			// get items from local storage
			let data = JSON.parse(localStorage.getItem("Data"));
			let sum = 0;

			// Loop over the array
			data.items.forEach((cur, index) => {
				if (id === cur.id) {
					data.items.splice(index, 1);
				}
			});

			data.items.forEach(el => {
				sum += parseFloat(el.price);
			});

			data.total_price = sum;

			// update local storage
			localStorage.setItem("Data", JSON.stringify(data));
		}
	};
})();

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

	const data = StorageController.getItemsFromStorage();

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

		removeStoreItem: id => {
			let ids, index;

			// get the ids
			ids = data.items.map(el => {
				return el.id;
			});

			// Get the index
			index = ids.indexOf(id);

			if (index !== -1) {
				// remove item
				data.items.splice(index, 1);
			}
		},

		clearStoreItems: () => {
			data.items.splice(0, data.items.length);
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
		cartItem: ".cart-item",
		storeItemIcon: ".store-item-icon",
		totalsContainer: ".cart-total-container",
		itemRemoveBtn: ".cart-item-remove",
		clearCartBtn: "clear-cart"
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
			<div class="cart-item d-flex justify-content-between align-items-center text-capitalize my-3" id="cart_item-${obj.id}">
				<img src="${obj.image}" class="img-fluid rounded-circle" id="item-img" alt="">
				<div class="item-text">
					<p id="cart-item-title" class="font-weight-bold mb-0">${obj.name}</p>
					<span>$</span>
					<span id="cart-item-price" class="cart-item-price" class="mb-0">${obj.price}</span>
				</div>
				<span class="cart-item-remove">
					<i class="fas fa-trash"></i>
				</span>
			</div>
			`;

			document.querySelector(element).insertAdjacentHTML("beforebegin", html);
		},

		populateCartItems: obj => {
			if (obj.items.length === 0) {
				let element, html;

				element = domStrings.totalsContainer;

				obj.items.forEach(el => {
					html += `
					<div class="cart-item d-flex justify-content-between align-items-center text-capitalize my-3" id="cart_item-${el.id}">
						<img src="${el.image}" class="img-fluid rounded-circle" id="item-img" alt="">
						<div class="item-text">
							<p id="cart-item-title" class="font-weight-bold mb-0">${el.name}</p>
							<span>$</span>
							<span id="cart-item-price" class="cart-item-price" class="mb-0">${el.price}</span>
						</div>
						<span class="cart-item-remove">
							<i class="fas fa-trash"></i>
						</span>
					</div>
					`;
				});

				document.querySelector(element).insertAdjacentHTML("beforebegin", html);
			}
		},

		removeItemFromUi: selectorId => {
			let el = document.getElementById(selectorId);
			el.parentNode.removeChild(el);
		},

		clearItemsFromUi: () => {
			let itemNode = document.querySelectorAll(domStrings.cartItem);
			itemNode.forEach(el => {
				el.remove();
			});
		},

		UpdateUiTotals: obj => {
			document.getElementById("cart-total").textContent = obj.total_price;
			document.querySelector(".item-total").textContent = obj.total_price;
			document.getElementById("item-count").textContent = obj.items.length;
		},

		getDomStrings: () => {
			return domStrings;
		}
	};
})();

//////////////////////////////////////////////
// App controller
const AppController = (function(dataCtrl, uiCtrl, strgCtrl) {
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

		// Remove item
		document.getElementById(dom.cartContainer).addEventListener("click", removeItem);

		// Clear items
		document.getElementById(dom.clearCartBtn).addEventListener("click", clearItems);
	};

	const updateTotals = () => {
		// get data from our ui
		const data = strgCtrl.getItemsFromStorage();

		// update ui
		uiCtrl.UpdateUiTotals(data);
	};

	// add item
	const addItem = event => {
		// Get data(image, price, name)
		const data = uiCtrl.getData(event);

		// Add item to data
		const item = dataCtrl.addStoreItem(data.image, data.name, data.price);

		// strgCtrl.addItemToStorage(item);
		strgCtrl.addItemToStorage(item);

		// Add item to ui
		uiCtrl.addItemToUi(item);
		alert("Item has been added to cart");

		// Update totals
		updateTotals();
	};

	// remove item
	const removeItem = event => {
		let id, itemID;

		if (event.target.parentElement.parentElement.parentElement.classList.contains(dom.cartContainer)) {
			id = event.target.parentElement.parentElement.id;
			itemID = parseInt(id.split("-")[1]);

			// remove item from our data
			dataCtrl.removeStoreItem(itemID);

			// remove item from ls
			strgCtrl.removeItemFromStorage(itemID);

			// remove item from our ui
			uiCtrl.removeItemFromUi(id);

			// update ui
			updateTotals();
		}
	};

	// Clear items
	const clearItems = () => {
		// clear items from our data model
		dataCtrl.clearStoreItems();

		// clear items from our ui
		uiCtrl.clearItemsFromUi();

		// update ui
		updateTotals();
	};

	return {
		init() {
			console.log("Application has started ...");

			const data = dataCtrl.getData();

			// Populating the cart
			if (localStorage.length !== 0) {
				uiCtrl.populateCartItems(data);
				updateTotals();
			}

			setUpEventListeners();
		}
	};
})(DataController, UIController, StorageController);

AppController.init();
