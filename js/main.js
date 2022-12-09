// PRICE SLIDER/////////////////////////////////////////////////////
(function() {

  var parent = document.querySelector(".range-slider");
  if(!parent) return;

  var
    rangeS = parent.querySelectorAll("input[type=range]"),
    numberS = parent.querySelectorAll("input[type=number]");

  rangeS.forEach(function(el) {
    el.oninput = function() {
      var slide1 = parseFloat(rangeS[0].value),
        	slide2 = parseFloat(rangeS[1].value);

      if (slide1 > slide2) {
				[slide1, slide2] = [slide2, slide1];
        // var tmp = slide2;
        // slide2 = slide1;
        // slide1 = tmp;
      }

      numberS[0].value = slide1;
      numberS[1].value = slide2;
    }
  });

  numberS.forEach(function(el) {
    el.oninput = function() {
			var number1 = parseFloat(numberS[0].value),
					number2 = parseFloat(numberS[1].value);
			
      if (number1 > number2) {
        var tmp = number1;
        numberS[0].value = number2;
        numberS[1].value = tmp;
      }

      rangeS[0].value = number1;
      rangeS[1].value = number2;

    }
  });

})();

// CART/////////////////////////////////////////////////////


const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDom = document.querySelector(".products-center");



// cart
let cart =[];
//buttons
let buttonsDOM =[];

// getting the products
class Products {

  async getProducts(){
   try {
    let result = await fetch ("/js/products.json");
    let data = await result.json();
    let products = data.items;
    products = products.map(item =>{

    
    const {title,price} = item.fields;
    const {id} = item.sys;
    const image = item.fields.image.fields.file.url;
    return {price,title,id,image} ;
  })
  return products

   } catch (error) {
    console.log(error);
   }
 

 }

}


//display products
class UI {
  displayProducts(products){
    let result = "";
    products.forEach(product => {

      result +=`
      <div class="col-lg-3 col-md-6 col-sm-6 here p-0 m-0 v-frame ">

               <div class="w-100 h-100 h-frame ">

                  <div class="zoom m-4">
                     <a href="detail.html"><img class="w-100 " src="${product.image}"alt="product"></a>
                  </div>
                  <div class="w-100 p-3  ref line-frame  ">
                     <div class="w-100">
                        <a href="detail.html"><h4>${product.title}</h4></a>
                        <div class="d-flex justify-content-between">
                           <p>$${product.price}</p>
                           <button  data-id=${product.id} class="bag-btn special-btn  m-1" type="submit">
                              \uF179
                           </button>
                        </div>

                     </div>
                  </div>
               </div>
            </div>


      
      `
    });
    productsDom.innerHTML = result; 
}

getBagButtons(){

  const buttons = [...document.querySelectorAll(".bag-btn")];
  buttonsDOM = buttons;

  buttons.forEach(button=>{
    let id = button.dataset.id;
    let inCart = cart.find(item => item.id === id);

    if(inCart){
      button.innerText = "\uF170";
      button.disabled = true;
    
    }
      button.addEventListener("click",(btn)=>{
        btn.target.innerText = "\uF170";
        btn.target.disabled = true;
        //get product from product
        let cartItem ={ ...Storage.getProduct(id),amount:1};
        //add product to the cart 
        cart =[...cart,cartItem];
        //save cart in local storage
        Storage.saveCart(cart);
        //set cart values
        this.setCartValues(cart);
        //display cart item
        this.addCartItem(cartItem);
        //show the cart
        this.showCart();

      })
    
  });

};

setCartValues(cart){
  let tempTotal = 0;
  let itemsTotal = 0;

  cart.map(item =>{
    tempTotal += item.price * item.amount;
    itemsTotal +=  item.amount;
  });

  cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
  cartItems.innerText = itemsTotal;
}

addCartItem(item){
  const div = document.createElement("div");
  div.classList.add("cart-item");
  div.innerHTML=`
   <img src=${item.image} alt="product" />
            <div>
              <h4>${item.title}</h4>
              <h5>${item.price}</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>

            <div>
              <i class="fas fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
  `
    cartContent.appendChild(div);
}

showCart(){
  cartOverlay.classList.add("transparentBcg");
  cartDOM.classList.add("showCart");
}

setupAPP(){
  cart = Storage.getCart();
  this.setCartValues(cart);
  this.populateCart(cart);
  cartBtn.addEventListener('click',this.showCart);
  closeCartBtn.addEventListener('click',this.hideCart);
}

populateCart(cart){
  cart.forEach(item =>this.addCartItem(item));
}
hideCart(){
  cartOverlay.classList.remove("transparentBcg");
  cartDOM.classList.remove("showCart");
}

cartLogic(){
  //clear cart button 
  clearCartBtn.addEventListener('click',()=>{
  this.clearCart();
});
//cart functionality
cartContent.addEventListener('click',cartE=>{
if(cartE.target.classList.contains('remove-item')){
  let removeItem = cartE.target;
  let id = removeItem.dataset.id;
  cartContent.removeChild
  (removeItem.parentElement.parentElement);
  this.removeItem(id);

}else if(cartE.target.classList.contains('fa-chevron-up')){
let addAmount = cartE.target;
let id = addAmount.dataset.id;
let tempItem = cart.find(item=> item.id ===id);
tempItem.amount = tempItem.amount + 1;
Storage.saveCart(cart);
this.setCartValues(cart);
addAmount.nextElementSibling.innerText =
tempItem.amount;
}else if

(cartE.target.classList.contains('fa-chevron-down')){
let lowerAmount = cartE.target;
let id = lowerAmount.dataset.id;
let tempItem = cart.find(item=> item.id ===id);
tempItem.amount = tempItem.amount-1;

if(tempItem.amount > 0){
  Storage.saveCart(cart);
  this.setCartValues(cart);
  lowerAmount.previousElementSibling.innerText = tempItem.amount;

}else{
  cartContent.removeChild(lowerAmount.parentElement.parentElement);
  this.removeItem(id)
}

}
  
})
}
clearCart(){
 let cartItems = cart.map(item=>item.id);
 console.log(cartContent.children);
 cartItems.forEach(id=>this.removeItem(id))
 while(cartContent.children.length>0){
  cartContent.removeChild(cartContent.children[0])
 }
 this.hideCart();
}

removeItem(id){
  cart =cart.filter(item=> item.id !== id)
  this.setCartValues(cart);
  Storage.saveCart(cart);
  let button = this.getSingleButton(id);
  button.disabled = false;
  button.innnerHTML = `<i class="fas fa-shopping-basket"></i>add to cart`;
}
getSingleButton(id){
  return buttonsDOM.find(button => button.dataset.id === id);
}
} 



// local storage 
class Storage {
  static saveProducts(products){
    localStorage.setItem("products",JSON.stringify(products));
  }
  static getProduct (id){
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find (product => product.id === id)
  }
  static saveCart (cart){
    localStorage.setItem("cart",JSON.stringify(cart))
  }
  static getCart(){
    return localStorage.getItem('cart')?JSON.parse(
      localStorage.getItem('cart')
    ):[]
  }
}


document.addEventListener("DOMContentLoaded",()=>{

 const ui = new UI ();
 const products = new Products();
 //setup app
 ui.setupAPP();

//get all products
products
.getProducts()
.then(products=>{

 ui.displayProducts(products);
 Storage.saveProducts(products);
 
}).then(()=>{

  ui.getBagButtons();
  ui.cartLogic();

}

)

});





// TO-TOP-BUTTON/////////////////////////////////////////////////////

let mybutton = document.getElementById("back-to-top");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0; 
  document.documentElement.scrollTop = 0; 
}



//SLIDER/////////////////////////////////////////////////////

const sliderContainer = document.querySelector('.slider-container')
const slideRight = document.querySelector('.right-slide')
const slideLeft = document.querySelector('.left-slide')
const upButton = document.querySelector('.up-button')
const downButton = document.querySelector('.down-button')
const slidesLength = slideRight.querySelectorAll('div').length

let activeSlideIndex = 0

slideLeft.style.top = `-${(slidesLength - 1) * 80}vh`

upButton.addEventListener('click', () => changeSlide('up'))
downButton.addEventListener('click', () => changeSlide('down'))

const changeSlide = (direction) => {
  const sliderHeight = sliderContainer.clientHeight
  if (direction === 'up') {
    activeSlideIndex++
    if (activeSlideIndex > slidesLength - 1) {
      activeSlideIndex = 0
    }
  } else if (direction === 'down') {
    activeSlideIndex--
    if (activeSlideIndex < 0) {
      activeSlideIndex = slidesLength - 1
    }
  }

  slideRight.style.transform = `translateY(-${activeSlideIndex * sliderHeight}px)`
  slideLeft.style.transform = `translateY(${activeSlideIndex * sliderHeight}px)`
}


// PRICE SLIDER/////////////////////////////////////////////////////
(function() {

  var parent = document.querySelector(".range-slider");
  if(!parent) return;

  var
    rangeS = parent.querySelectorAll("input[type=range]"),
    numberS = parent.querySelectorAll("input[type=number]");

  rangeS.forEach(function(el) {
    el.oninput = function() {
      var slide1 = parseFloat(rangeS[0].value),
        	slide2 = parseFloat(rangeS[1].value);

      if (slide1 > slide2) {
				[slide1, slide2] = [slide2, slide1];
        // var tmp = slide2;
        // slide2 = slide1;
        // slide1 = tmp;
      }

      numberS[0].value = slide1;
      numberS[1].value = slide2;
    }
  });

  numberS.forEach(function(el) {
    el.oninput = function() {
			var number1 = parseFloat(numberS[0].value),
					number2 = parseFloat(numberS[1].value);
			
      if (number1 > number2) {
        var tmp = number1;
        numberS[0].value = number2;
        numberS[1].value = tmp;
      }

      rangeS[0].value = number1;
      rangeS[1].value = number2;

    }
  });

})();