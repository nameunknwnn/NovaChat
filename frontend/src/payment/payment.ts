interface Window {
    Razorpay: any;
  }

export async function Payment() {
    // STEP 1 → ask backend to create order
    const res = await fetch("http://localhost:3000/order", {
      method: "POST",
    });
  
    const order = await res.json();
  
    // STEP 2 → checkout options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  
      amount: order.amount,
      currency: order.currency,
  
      name: "My App",
      description: "Test Payment",
  
      order_id: order.id,
  
      handler: function (response: any) {
        console.log("PAYMENT SUCCESS");
  
        console.log(response);
      },
  
      prefill: {
        name: "Aditya",
        email: "test@test.com",
        contact: "9999999999",
      },
  
      theme: {
        color: "#000000",
      },
    };
  
    // STEP 3 → open checkout
    const razorpay = new window.Razorpay(options);


    razorpay.open();
  }