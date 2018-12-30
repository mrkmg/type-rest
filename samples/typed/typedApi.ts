import {api} from "./api";
import {ICustomerPostBody} from "./api/routes/customer";
import {IOrderPostBody} from "./api/routes/order";

async function main() {
    // Check if logged in
    const loggedIn = await api.auth.Get();

    if (!loggedIn) {
        // Login
        const authResult = await api.auth.Post({username: "test", password: "test"});

        if (authResult.valid) {
            api.headers.token = authResult.jwt;
        } else {
            alert("Failed to login!");
        }
    }
    ///// Customers /////

    // List Customers
    const customers = await api.customer.Get({sort: ["firstName"]});

    // Create Customer
    const customerData: ICustomerPostBody = {
        email: "joe.dirt@domain.com",
        firstName: "Joe",
        lastName: "Dirt",
        phoneNumber: "(734) 775 3164",
    };
    await api.customer.Post(customerData);

    // List orders for a customer
    const customerOrders = await api.customer[1].orders.Get({});

    // Get a Customer
    const customer = await api.customer[10].Get();

    // Update a Customer
    customer.firstName = "NewName";
    await api.customer[10].Patch(customer);

    // Delete a Customer
    await api.customer[10].Delete();

    ////// Orders /////

    // List Orders
    const orders = await api.order.Get({limit: 10});

    // Create an order
    const orderData: IOrderPostBody = {
        customerId: customer.id,
        date: "2000-01-01",
        totalAmount: 100,
    };

    await api.order.Post(orderData);

    // Get an order (without customer)
    const order = await api.order[10].Get();

    // Get an order (with customer)
    const orderWithCustomer = await api.order[10].Get({withCustomer: true});

    // Update an order
    order.totalAmount = 120;
    await api.order[order.id].Patch(order);

    // Delete an order
    await api.order[order.id].Delete();

    // Logout
    await api.auth.Delete();
}
