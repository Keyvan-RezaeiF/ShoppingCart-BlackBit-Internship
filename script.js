// DOM

const productsDiv = document.querySelector('.products_container')
const cartItemsCounter = document.querySelector('#cart-items-counter')
let cartItemsDiv = document.querySelector('.cart_items_container')
const cartItemCounter = document.querySelector('.item_counter')
const cartDiv = document.querySelector('.cart_container')

// OOP

class Product {
	constructor(index, id, name, price, image) {
    this.index = index;
		this.id = id;
		this.name = name;
		this.price = price;
		this.image = image;
	}
}

class CartItem extends Product {
  constructor(index, id, name, price, image, quantity) {
    super(index, id, name, price, image);
    this.quantity = quantity;
  }
}

class Cart {
  constructor() {
    this.items = [];
    this.totalPrice = 0;
  }
}

// Utils

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
})

// functions

function renderCart() {
  cartItemsDiv.remove();
  cartItemsDiv = document.createElement('div')
  cartItemsDiv.className = "cart_items_container"
  cartDiv.appendChild(cartItemsDiv)

  cart.items.map(cartItem => {
    cartItemsDiv.innerHTML += `
      <div class="cart_item">
        <div class="item">
          <img src="${cartItem.image}" width="100px" height="100px">
          <!-- <div class="item_title">${cartItem.name}</div> -->
        </div>
        <div class="price">
          ${formatter.format(cartItem.price)}
        </div>
        <div class="quantity">
          <button class="remove_item" onclick="removeFromCart(${cartItem.index})">-</button>
          <div class="item_counter">
            ${cartItem.quantity}
          </div>
          <button class="add_item" onclick="addToCart(${cartItem.index})">+</button>
        </div>
        <div class="subtotal">
          ${formatter.format(cartItem.price * cartItem.quantity)}
        </div>
      </div>
      `
  })
  cartItemsDiv.innerHTML += `
    <div class="total_price">
      Total Price : ${formatter.format(cart.totalPrice)}
    </div>
  `
}

const addToCart = (index) => {
  const product = products.find(item => item.index === index)
  const isItemExist = cart.items.find(item => item.index === index)
  if (!isItemExist) {
    const newCartItem = new CartItem(product.index, product.id, product.name, product.price, product.image, 1, false)
    cart.items.push(newCartItem)
  } else {
    cart.items.map(item => {
      if (item.index === index) {
        item.quantity++;
      }
    })
  }
  cart.totalPrice += product.price;
  cartItemsCounter.innerText = Number(cartItemsCounter.innerText) + 1;

  localStorage.setItem('cart', JSON.stringify(cart))
  renderCart()
};

const removeFromCart = (index) => {
  const product = products.find(item => item.index === index)
  const isItemExist = cart.items.find(item => item.index === index)
  if (isItemExist) {
    cart.items.map(item => {
      if (item.index === index) {
        item.quantity--;
        if (item.quantity == 0) {
          i = cart.items.indexOf(item)
          cart.items.splice(i, 1)
        }
      }
    })
    cart.totalPrice -= product.price;
    cartItemsCounter.innerText = Number(cartItemsCounter.innerText) - 1;
  }

  localStorage.setItem('cart', JSON.stringify(cart))
  renderCart()
}

function renderProducts() {
  products.map(product => {
    productsDiv.innerHTML += `
      <div class="product_container">
          <img src=${product.image} width="400px" height="400px">
          <div class="product_info">
              <span class="product_title">${product.name}</span>
              <button class="add_item" onclick="addToCart(${product.index})">+</button>
              <button class="remove_item" onclick="removeFromCart(${product.index})">-</button>
              <span class="product_price">${formatter.format(product.price)}</span>
          </div>
      </div>
      `
  })
}

function getCartItems() {
  if (localStorage.getItem('cart') != null) {
    cart = JSON.parse(localStorage.getItem('cart'));
  } else {
    cart.items = [];
    cart.totalPrice = 0;
  }

  cart.items.map(cartItem => {
    cartItemsCounter.innerText = Number(cartItemsCounter.innerText) + cartItem.quantity;
  })
}

const makeProducts = (data) => {
  let index = 0
  data.map(item => {
    const newProduct = new Product(index, item.id, item.name, item.price, item.image);
    products.push(newProduct)
    index++;
  })
}

const productsData = fetch('https://course-api.com/react-store-products')
                          .then(response => response.json())
                          .then(data => data)
                          .catch(error => console.log("The Error is " + error.message));

// Main

const main = async () => {
  const data = await productsData;
  makeProducts(data);
  getCartItems()
  renderProducts()
  renderCart()
}

const products = [];
let cart = new Cart()
main()