import React, { useState } from "react";
import { useEffect, useCallback } from "react";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import axios from "axios";
import styles from "./Cart.module.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [allCarts, setAllCarts] = useState([]);
  const customerID = 3;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/Cart/cusID", { cusID: customerID });
        console.log("Dữ liệu giỏ hàng từ API:", response.data);
        setCartItems(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
      }
    };
    fetchCart();
  }, []);

  // const fetchAllCarts = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:3001/api/Cart/");
  //     console.log("Tất cả giỏ hàng:", response.data);
  //   } catch (error) {
  //     console.error("Lỗi khi lấy danh sách giỏ hàng:", error);
  //   }
  // };

  const updateQuantity = async (cartDetailID, amount) => {
    const updatedItem = cartItems.find(item => item.cartDetailID === cartDetailID);
    if (!updatedItem) return;

    const newQuantity = Math.max(1, updatedItem.quantity + amount);

    try {
      await axios.put("http://localhost:3001/api/Cart/update/", { cartDetailID, quantity: newQuantity });
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cartDetailID === cartDetailID ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
    }
  };

  const removeItem = async (cartDetailID) => {
    try {
      await axios.delete(`http://localhost:3001/api/Cart/delete/`, { data: { cartDetailID } });

      setCartItems(cartItems.filter(item => item.cartDetailID !== cartDetailID));
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
    }
  };

  const checkout = async () => {
    try {
      if (cartItems.length === 0) return;
      await axios.post("http://localhost:3001/api/Cart/checkout/", { cartID: cartItems[0].CartID });
      alert("Thanh toán thành công!");
      setCartItems([]);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <Header />
      <div className={styles.cart_container}>
        <h2 className={styles.cart_header}>Giỏ hàng</h2>
        {/* <button className={styles.view_all_button} onClick={fetchAllCarts}>Xem tất cả giỏ hàng</button>
        {allCarts.length > 0 && (
          <div className={styles.all_carts}>
            <h3>Danh sách tất cả giỏ hàng</h3>
            <ul>
              {allCarts.map((cart) => (
                <li key={cart.cartID}>
                  <strong>Giỏ hàng {cart.cartID}</strong> - Khách hàng {cart.customerID}
                </li>
              ))}
            </ul>
          </div>
        )} */}
        <div className={styles.cart_content}>
          {cartItems.length === 0 ? (
            <p className={styles.empty_cart}>Giỏ hàng đang trống</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.cartDetailID} className={styles.cart_item}>
                <div className={styles.item_details}>
                  <h3 className={styles.item_name}>{item.productName}</h3>
                  <p className={styles.item_price}>{item.productPrice.toLocaleString()} VNĐ</p>
                </div>
                <div className={styles.quantity_control}>
                  <button className={styles.quantity_button} onClick={() => updateQuantity(item.cartDetailID, -1)}>
                    -
                  </button>
                  <span className={styles.quantity_value}>{item.Quantity}</span>
                  <button className={styles.quantity_button} onClick={() => updateQuantity(item.cartDetailID, 1)}>
                    +
                  </button>
                </div>
                <button className={styles.remove_button} onClick={() => removeItem(item.cartDetailID)}>
                  Xóa
                </button>
              </div>
            ))
          )}
          {cartItems.length > 0 && (
            <div className={styles.total}>
              <h3>Tổng: {totalPrice.toLocaleString()} VNĐ</h3>
              <button className={styles.checkout_button} onClick={checkout}>Thanh toán</button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;