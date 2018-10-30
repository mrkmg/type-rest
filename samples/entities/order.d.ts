import {ICustomer} from "./customer";

export interface IOrder {
    id: number;
    date: string;
    totalAmount: number;
    customerId: number;
    customer: ICustomer;
}