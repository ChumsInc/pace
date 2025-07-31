import type {CustomerFilter, CustomerKey, CustomerPaceRow} from "../../types";

export const customerKey = (row: CustomerKey) => `${row.ARDivisionNo}-${row.CustomerNo}`;


export const filterCustomerPace = (rows: CustomerPaceRow[], {arDivisionNo, segment}: CustomerFilter) => {
    return rows
        .filter(row => !arDivisionNo || row.ARDivisionNo === arDivisionNo)
        .filter(row => !segment || row.Segment === segment)

}
