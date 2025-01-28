import {CustomerKey} from "../../types";

export const customerKey = (row:CustomerKey) => `${row.ARDivisionNo}-${row.CustomerNo}`;
