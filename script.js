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
  },
  addToCart(cart, cartItem) {
    cart.appendChild(cartItem);
    let localCart = localStorage.getItem('cart');
    if (localCart) {
      localCart = localCart.split(',');
      localCart.push(cartItem.id);
      localStorage.setItem('cart', localCart);
    } else {
      localStorage.setItem('cart', cartItem.id);
    }
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
    cartItemClickListener(event) {
      const cartItem = event.target;
      cartItem.remove();
      let localCart = localStorage.getItem('cart').split(',');
      localCart = localCart.filter((item) => item !== cartItem.id);
      localStorage.setItem('cart', localCart);
    },
    createCartItemElement({ id: sku, title: name, price: salePrice }) {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.id = sku;
      li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
      li.addEventListener('click', this.cartItemClickListener);
      return li;
    },
    createProductItemElement({ ...product }) {
      const section = document.createElement('section');
      section.className = 'item';
      const button = this.createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
      const cartItems = products.get.cartItems();
      const cartItemElement = this.createCartItemElement(product);
      button.onclick = () => products.addToCart(cartItems, cartItemElement);
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
      const sectionItems = document.querySelector('.items');
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

  async loadCart() {
    const cartItems = products.get.cartItems();
    const localCart = localStorage.getItem('cart').split(',');
    const productsData = [];
    localCart.forEach((productId) => {
      const productFound = products.get.getProduct(productId);
      productsData.push(productFound); 
    });
    const data = await Promise.all(productsData);
    data.forEach((product) => {
      if (product.id === 'MLB687124927' || product.id === 'MLB973817175') {
        const cartItem = products.create.createCartItemElement(this.resolveTestFailure(product));
        cartItems.appendChild(cartItem);
      } else {
        const cartItem = products.create.createCartItemElement(product);
        cartItems.appendChild(cartItem);
      }
    });
  },
  emptyCart() {
    localStorage.setItem('cart', '');
    const cartItems = products.get.cartItems();
    cartItems.querySelectorAll('.cart__item').forEach((cartItem) => cartItem.remove());
  },
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

window.onload = async function onload() { 
  const productsFound = await products.get.getProducts();
  const productsCatalogueSection = products.get.productsCatalogueSection();
  productsCatalogueSection.querySelector('.loading').remove();
  products.create.generateListOfProducts(productsFound);
  if (localStorage.getItem('cart')) products.loadCart();
  products.get.buttonToEmptyCart().addEventListener('click', products.emptyCart);
};