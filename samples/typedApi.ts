import {DynamicRest, dynamicRest} from "../src";
import {Api} from "./api";
import {ICustomerPostBody} from "./api/routes/customer";
import {IOrderPostBody} from "./api/routes/order";


async function ensureLoggedIn(api: DynamicRest<Api>) {

}


async function main() {
    const api = dynamicRest<Api>("https://localhost/api");

    // Check if logged in
    const loggedIn = await api.auth.Get();

    if (!loggedIn) {
        // Login
        const authResult = await api.auth.Post({username: "test", password: "test"});

        if (authResult.valid) {
            api._initParams.headers["token"] = authResult.jwt;
        } else {
            alert("Failed to login!");
        }
    }
    ///// Customers /////

    // List Customers
    const customers = await api.customer.Get({sort: ["firstName"]});

    // Create Customer
    const customerData: ICustomerPostBody = {
        firstName: "Joe",
        lastName: "Dirt",
        phoneNumber: "(734) 775 3164",
        email: "joe.dirt@domain.com"
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
        date: "2000-01-01",
        totalAmount: 100,
        customerId: customer.id,
    };
    await api.order.Post(orderData);

    // Get an order (without customer)
    const order = await api.order[10].Get();

    // Get an order (with customer)
    const orderC = await api.order[10].Get({withCustomer: true});

    // Update an order
    order.totalAmount = 120;
    await api.order[order.id].Patch(order);

    // Delete an order
    await api.order[order.id].Delete();

    // Logout
    await api.auth.Delete();
}