import { get, groupBy, reject, maxBy, minBy } from "lodash";
import { createSelector } from "reselect";
import moment from "moment";
// import { ETHER_ADDRESS, GREEN, RED, ether, tokens } from '../helpers'

const account = (state) => get(state, "web3.account");
export const accountSelector = createSelector(account, (a) => a);

const web3 = (state) => get(state, "web3.connection");
export const web3Selector = createSelector(web3, (w) => w);

const marketplaceLoaded = (state) => get(state, "marketplace.loaded", false);
export const marketplaceLoadedSelector = createSelector(
  marketplaceLoaded,
  (ml) => ml
);

const marketplace = (state) => get(state, "marketplace.contract");
export const marketplaceSelector = createSelector(marketplace, (m) => m);

export const contractsLoadedSelector = createSelector(
  marketplaceLoaded,
  (ml) => ml
);
///////////////////////////////////////////////

// // TODO: Move me to helpers file
// export const formatBalance = (balance) => {
//   const precision = 100 // 2 decimal places

//   balance = ether(balance)
//   balance = Math.round(balance * precision) / precision // Use 2 decimal places

//   return balance
// }

// const tokenLoaded = state => get(state, 'token.loaded', false)
// export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl)

// const token = state => get(state, 'token.contract')
// export const tokenSelector = createSelector(token, t => t)

// const exchangeLoaded = state => get(state, 'exchange.loaded', false)
// export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el)

// const exchange = state => get(state, 'exchange.contract')
// export const exchangeSelector = createSelector(exchange, e => e)

// export const contractsLoadedSelector = createSelector(
//   tokenLoaded,
//   exchangeLoaded,
//   (tl, el) => (tl && el)
// )
