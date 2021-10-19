// WEB3
export function web3Loaded(connection) {
  return {
    type: "WEB3_LOADED",
    connection,
  };
}

export function web3AccountLoaded(account) {
  return {
    type: "WEB3_ACCOUNT_LOADED",
    account,
  };
}

export function marketplaceStateChanged(marketplaceState) {
  return {
    type: "MARKETPLACE_STATE_CHANGED",
    marketplaceState,
  };
}

export function investmentSoldChanged(investmentSold) {
  return {
    type: "INVESTMENT_SOLD_CHANGED",
    investmentSold,
  };
}

export function investorUnitsChanged(investorUnits) {
  return {
    type: "INVESTOR_UNITS_CHANGED",
    investorUnits,
  };
}

export function marketplaseOwnerAccountLoaded(account) {
  return {
    type: "MARKETPLACE_OWNER_ACCOUNT_LOADED",
    account,
  };
}

// MARKETPLACE
export function marketplaceLoaded(contract) {
  return {
    type: "MARKETPLACE_LOADED",
    contract,
  };
}

export function numTicketsLoaded(numTickets) {
  return {
    type: "NUM_TICKETS_LOADED",
    numTickets,
  };
}
export function ticketsLoaded(tickets) {
  return {
    type: "TICKETS_LOADED",
    tickets,
  };
}

// Toggle sale
export function saleToggling(ticket) {
  return {
    type: "SALE_TOGGLING",
    ticket,
  };
}

export function saleToggled(ticket) {
  return {
    type: "SALE_TOGGLED",
    ticket,
  };
}

export function ticketCreating(ticket) {
  return {
    type: "TICKET_CREATING",
    ticket,
  };
}

export function ticketCreated(ticket) {
  return {
    type: "TICKET_CREATED",
    ticket,
  };
}

export function openModal(modal, data) {
  return {
    type: "OPEN_MODAL",
    modal,
    data,
  };
}
export function closeModal() {
  return {
    type: "CLOSE_MODAL",
  };
}
export function ticketPriceChanging(ticket) {
  // console.log("TICKET_PRICE_CHANGING ticket", ticket);
  return {
    type: "TICKET_PRICE_CHANGING",
    ticket,
  };
}
export function ticketPriceChanged(ticket) {
  // console.log("TICKET_PRICE_CHANGED ticket", ticket);
  return {
    type: "TICKET_PRICE_CHANGED",
    ticket,
  };
}
//////////////////////////TODO remove not needed below

export function cancelledOrdersLoaded(cancelledOrders) {
  return {
    type: "CANCELLED_ORDERS_LOADED",
    cancelledOrders,
  };
}

export function filledOrdersLoaded(filledOrders) {
  return {
    type: "FILLED_ORDERS_LOADED",
    filledOrders,
  };
}

export function allOrdersLoaded(allOrders) {
  return {
    type: "ALL_ORDERS_LOADED",
    allOrders,
  };
}

export function orderCancelled(order) {
  return {
    type: "ORDER_CANCELLED",
    order,
  };
}

// Fill Order
export function orderFilling() {
  return {
    type: "ORDER_FILLING",
  };
}

export function orderFilled(order) {
  return {
    type: "ORDER_FILLED",
    order,
  };
}

// Balances
export function etherBalanceLoaded(balance) {
  return {
    type: "ETHER_BALANCE_LOADED",
    balance,
  };
}

export function tokenBalanceLoaded(balance) {
  return {
    type: "TOKEN_BALANCE_LOADED",
    balance,
  };
}

export function exchangeEtherBalanceLoaded(balance) {
  return {
    type: "EXCHANGE_ETHER_BALANCE_LOADED",
    balance,
  };
}

export function exchangeTokenBalanceLoaded(balance) {
  return {
    type: "EXCHANGE_TOKEN_BALANCE_LOADED",
    balance,
  };
}

export function balancesLoaded() {
  return {
    type: "BALANCES_LOADED",
  };
}

export function balancesLoading() {
  return {
    type: "BALANCES_LOADING",
  };
}

export function etherDepositAmountChanged(amount) {
  return {
    type: "ETHER_DEPOSIT_AMOUNT_CHANGED",
    amount,
  };
}

export function etherWithdrawAmountChanged(amount) {
  return {
    type: "ETHER_WITHDRAW_AMOUNT_CHANGED",
    amount,
  };
}

export function tokenDepositAmountChanged(amount) {
  return {
    type: "TOKEN_DEPOSIT_AMOUNT_CHANGED",
    amount,
  };
}

export function tokenWithdrawAmountChanged(amount) {
  return {
    type: "TOKEN_WITHDRAW_AMOUNT_CHANGED",
    amount,
  };
}

// Buy Order
export function buyOrderAmountChanged(amount) {
  return {
    type: "BUY_ORDER_AMOUNT_CHANGED",
    amount,
  };
}

export function buyOrderPriceChanged(price) {
  return {
    type: "BUY_ORDER_PRICE_CHANGED",
    price,
  };
}

export function buyOrderMaking(price) {
  return {
    type: "BUY_ORDER_MAKING",
  };
}

// Generic Order
export function orderMade(order) {
  return {
    type: "ORDER_MADE",
    order,
  };
}

// Sell Order
export function sellOrderAmountChanged(amount) {
  return {
    type: "SELL_ORDER_AMOUNT_CHANGED",
    amount,
  };
}

export function sellOrderPriceChanged(price) {
  return {
    type: "SELL_ORDER_PRICE_CHANGED",
    price,
  };
}

export function sellOrderMaking(price) {
  return {
    type: "SELL_ORDER_MAKING",
  };
}
