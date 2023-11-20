import { cart , removeFromCart , updateDeliveryOption} from "../../data/cart.js";
import { products ,getProduct} from "../../data/products.js";
import { formatCurrency } from "../../utils/money.js";
import { updateQuantity } from "../../data/cart.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";



export function renderOrderSummary(){
    let checkoutHTML = '';

        cart.forEach((cartItem)=>{
            const productId = cartItem.productId;

            const matchingProduct = getProduct(productId);

            const deliveryOptionId = cartItem.deliveryOptionId;

            const deliveryOption = getDeliveryOption(deliveryOptionId)

            const today = dayjs();
                const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');

                const dateString = deliveryDate.format('dddd, MMMM D')

            
            checkoutHTML += `
                <div class="cart-item-container js-item-container-${matchingProduct.id}">
                        <div class="delivery-date">
                        Delivery date: ${dateString}
                        </div>

                        <div class="cart-item-details-grid">
                        <img class="product-image"
                            src=${matchingProduct.image}>

                        <div class="cart-item-details">
                            <div class="product-name">
                            ${matchingProduct.name}
                            </div>
                            <div class="product-price">
                            $${formatCurrency(matchingProduct.priceCents)}
                            </div>
                            <div class="product-quantity">
                            <span>
                                Quantity: <span data-product-id = ${matchingProduct.id}  class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                            </span>
                            <span data-product-id = ${matchingProduct.id} class="update-quantity-link link-primary js-update-quantity-link">
                                Update 
                            </span> 
                            <input data-product-id = "${matchingProduct.id}" class ="quantity-input  quantity-input-${matchingProduct.id}">
                            <span data-product-id = ${matchingProduct.id} class="save-quantity-link js-save-quantity-link link-primary">Save</span>
                            <span class="delete-quantity-link js-delete-quantity-link link-primary" data-product-id = "${matchingProduct.id}">
                                Delete
                            </span>
                            </div>
                        </div>

                        <div class="delivery-options">
                            <div class="delivery-options-title">
                            Choose a delivery option:
                            </div>
                        ${deliveryOptionsHTML(matchingProduct, cartItem)}
                        
                        </div>
                    </div>
                </div>
                
            `;

            document.querySelector(".js-order-summary").innerHTML = checkoutHTML;
        })

        function deliveryOptionsHTML(matchingProduct , cartItem) {

            let html = '';
            deliveryOptions.forEach((deliveryOption)=>{
                const today = dayjs();
                const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');

                const dateString = deliveryDate.format('dddd, MMMM D')

                const priceString = deliveryOption.priceCents === 0 
                ? 'FREE'
                : `$${formatCurrency(deliveryOption.priceCents)} -`;

                const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

                html +=

                `
                <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
                <input type="radio"
                    ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                <div>
                    <div class="delivery-option-date">
                    ${dateString}
                    </div>
                    <div class="delivery-option-price">
                    ${priceString} Shipping
                    </div>
                    </div>
                </div>
            
                `
            });

            return html;
        
        }


        document.querySelectorAll(".js-delete-quantity-link")
            .forEach((link)=>{
                link.addEventListener('click',()=>{
                    const productId = link.dataset.productId;
                    removeFromCart(productId)

                    const deleteContainer = document.querySelector(`.js-item-container-${productId}`);
                    deleteContainer.remove();

                    renderPaymentSummary();

                    updateCart();

                });
            });

            function updateCart() {
                let cartQuantity = 0; // Initialize cartQuantity to zero.
            
                cart.forEach((cartItem) => {
                    cartQuantity += cartItem.quantity; // Update cartQuantity with each cart item's quantity.
                });
            
                document.querySelector(".js-checkout-quantity").innerHTML = `${cartQuantity} Items`;
            }

        window.addEventListener('load', updateCart);
            

        document.querySelectorAll(".js-update-quantity-link")
                .forEach((link)=>{
                    link.addEventListener('click', ()=>{
                        const productId = link.dataset.productId;
                        document.querySelector(`.js-item-container-${productId}`).classList.add('is-editing-quantity')
                    })
                })

            document.querySelectorAll('.js-save-quantity-link ')
                .forEach((link)=>{
                    link.addEventListener('click',()=>{
                        const productId = link.dataset.productId;
                        document.querySelector(`.js-item-container-${productId}`).classList.remove('is-editing-quantity')
                        const quantityInput = document.querySelector(`.quantity-input-${productId}`).value;
                        const newQuantity = Number(quantityInput);
                        updateQuantity(productId,newQuantity);
                        updateCart();
                        renderPaymentSummary();
                        const quantityLabel = document.querySelector(
                            `.js-quantity-label-${productId}`
                        );
                        quantityLabel.innerHTML = newQuantity;
                    
                    })

                })

            
        document.querySelectorAll('.js-delivery-option')
                .forEach((element)=>{
                    element.addEventListener('click' , ()=>{
                        const {productId , deliveryOptionId} = element.dataset
                        updateDeliveryOption(productId, deliveryOptionId)
                        renderOrderSummary();
                    });
                });

    renderPaymentSummary();
}

