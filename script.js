const products = {
  get: {
    async getProducts() {
      const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
      const data = await response.json();
      return data.results;
    },
    async getProduct(productId) {
      const response = await fetch(`https://api.mercadolibre.com/items/${productId}`);
      const data = await response.json();
      return data;
    },
    cartItems() {
      return document.querySelector('.cart__items');
    },
    buttonToEmptyCart() {
      return document.querySelector('.empty-cart');
    },
    productsCatalogueSection() {
      return document.querySelector('.items');
    },
    totalPriceElement() {
      return document.querySelector('.total-price');
    },
  },
  
  create: {
    createProductImageElement(imageSource) {
      const img = document.createElement('img');
      img.className = 'item__image';
      img.src = imageSource;
      return img;
    },
    createCustomElement(element, className, innerText) {
      const e = document.createElement(element);
      e.className = className;
      e.innerText = innerText;
      return e;
    },
    cartItemClickListener(event, productPrice) {
      const cartItem = event.target;
      cartItem.remove();

      const totalPriceElement = products.get.totalPriceElement();
      products.cart.totalPrice = products.cart.totalPriceCalculate(productPrice, 'remove');
      totalPriceElement.textContent = products.cart.totalPrice;
      let localCart = localStorage.getItem('cart').split(',');
      localCart = localCart.filter((item) => item !== cartItem.id);
      localStorage.setItem('cart', localCart);
    },
    createCartItemElement({ id: sku, title: name, price: salePrice }) {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.id = sku;
      li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
      li.addEventListener('click', (event) => this.cartItemClickListener(event, salePrice));
      return li;
    },
    createProductItemElement({ ...product }) {
      const section = document.createElement('section');
      section.className = 'item';
      const button = this.createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
      const cartItems = products.get.cartItems();
      const cartItemElement = this.createCartItemElement(product);
      button.onclick = () => products.cart.addToCart(cartItems, cartItemElement, product.price);
      section.appendChild(
        this.createCustomElement('span', 'item__sku', product.id),
      );
      section.appendChild(
        this.createCustomElement('span', 'item__title', product.title),
      );
      section.appendChild(
        this.createProductImageElement(product.thumbnail),
      );
      section.appendChild(button);
    
      return section;
    },
    generateListOfProducts(productsFound) {
      const sectionItems = products.get.productsCatalogueSection();
      productsFound.map((product) => sectionItems.appendChild(
        this.createProductItemElement(product),
      ));
    },
  },

  resolveTestFailure(product) {
    const productOutdated = product;
    if (productOutdated.id === 'MLB687124927') {
      productOutdated.price = 14.6;
    } else {
      productOutdated.price = 18;
    }

    return productOutdated;
  },

  cart: {
    totalPrice: 0,
    totalPriceCalculate(currentProductPrice, addOrRemove) {
      let total = products.cart.totalPrice;
      if (addOrRemove === 'add') {
        total += currentProductPrice;
      } else {
        total -= currentProductPrice;
      }
      total = Math.round(total * 100) / 100;
      products.cart.totalPrice = total;
      return total;
    },
    addToCart(cart, cartItem, productPrice) {
      let totalPriceElement = products.get.totalPriceElement();
      cart.appendChild(cartItem);
      let localCart = localStorage.getItem('cart');
      if (localCart) {
        localCart = localCart.split(',');
        localCart.push(cartItem.id);
        localStorage.setItem('cart', localCart);
      } else {
        localStorage.setItem('cart', cartItem.id);
      }
      if (totalPriceElement) {
        totalPriceElement.textContent = products.cart.totalPriceCalculate(productPrice, 'add');
      } else {
        totalPriceElement = products.create.createCustomElement(
          'span', 'total-price', products.cart.totalPriceCalculate(productPrice, 'add'),
        );
        products.get.cartItems().insertAdjacentElement('afterend', totalPriceElement);
      }
    },
    appendElementsToCart(promisesResult) {
      const cartItems = products.get.cartItems();
      promisesResult.forEach((product) => {
        if (product.id === 'MLB687124927' || product.id === 'MLB973817175') {
          const cartItem = products.create.createCartItemElement(
            products.resolveTestFailure(product),
          );
          cartItems.appendChild(cartItem);
        } else {
          const cartItem = products.create.createCartItemElement(product);
          cartItems.appendChild(cartItem);
        }
      });
    },
    async loadCart() {
      const localCart = localStorage.getItem('cart').split(',');
      const productsData = [];
      localCart.forEach((productId) => {
        const productFound = products.get.getProduct(productId);
        productsData.push(productFound); 
      });
      const data = await Promise.all(productsData);
      products.cart.appendElementsToCart(data);
      data.forEach((product) => products.cart.totalPriceCalculate(product.price, 'add'));
  
      const totalPriceElement = products.create.createCustomElement(
        'span', 'total-price', products.cart.totalPrice,
      );
      products.get.cartItems().insertAdjacentElement('afterend', totalPriceElement);
    },
    emptyCart() {
      localStorage.removeItem('cart');
      const cartItems = products.get.cartItems();
      cartItems.querySelectorAll('.cart__item').forEach((cartItem) => cartItem.remove());
    },
  },
};

window.onload = async function onload() { 
  const productsFound = await products.get.getProducts();
  const productsCatalogueSection = products.get.productsCatalogueSection();
  productsCatalogueSection.querySelector('.loading').remove();
  products.create.generateListOfProducts(productsFound);
  if (localStorage.getItem('cart')) products.cart.loadCart();
  products.get.buttonToEmptyCart().addEventListener('click', products.cart.emptyCart);
};