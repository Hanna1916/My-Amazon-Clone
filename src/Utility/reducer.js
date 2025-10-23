

// import { Type } from './action.type'
// import { useReducer } from 'react'

// export const initialState = {
//   basket: [],
//   user: null
// }

// export const reducer = (state, action) => {
//   switch (action.type) {
//     case Type.ADD_TO_BASKET: {
// // Check if the item already exists in the basket
//       const existingItem = state.basket.find(
//         (item) => item.id === action.item.id
//       )

//       if (existingItem) {
//         const updatedBasket = state.basket.map((item) =>
//           item.id === action.item.id
//             ? { ...item, amount: (item.amount ?? 1) + 1 }
//             : item
//         )

//         return {
//           ...state,
//           basket: updatedBasket
//         }
//       } else {
//         return {
//           ...state,
//           basket: [...state.basket, { ...action.item, amount: 1 }]
//         }
//       }
//     }

//     case Type.REMOVE_FROM_BASKET:
//             const index = state.basket.findIndex(item => item.id ===action.id)
//               let newBasket = [...state.basket];
//               if(index >=0){
//                 if(newBasket[index].amount > 1){
//                     newBasket[index] = {...newBasket[index], amount: newBasket[index].amount - 1}
//                 }else{
//                     newBasket.splice(index,1)
//                 }
//               }
//               return {
//                 ...state,
//                 basket: newBasket
//               }

//     case Type.SET_USER:
//       return {
//         ...state,
//         user: action.user
//       }

//       case Type.EMPTY_BASKET:
//   return {
//     ...state,
//     basket: [], // ✅ clear basket
//   };


//     default:
//       return state;
//   }
// }


import { Type } from "./action.type";

export const initialState = {
  user: null,
  basket: [],
};

export const reducer = (state, action) => {
  switch (action.type) {
    case Type.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case Type.ADD_TO_BASKET:
      // Check if the item already exists in basket
      const existingItem = state.basket.find(
        (item) => item.id === action.item.id
      );
      if (existingItem) {
        return {
          ...state,
          basket: state.basket.map((item) =>
            item.id === action.item.id
              ? { ...item, amount: item.amount + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        basket: [...state.basket, { ...action.item, amount: 1 }],
      };
    case Type.REMOVE_FROM_BASKET:
      return {
        ...state,
        basket: state.basket.filter((item) => item.id !== action.id),
      };
    case Type.EMPTY_BASKET:
      return {
        ...state,
        basket: [],
      };
    case Type.INCREASE_QUANTITY:
      return {
        ...state,
        basket: state.basket.map((item) =>
          item.id === action.id ? { ...item, amount: item.amount + 1 } : item
        ),
      };
    case Type.DECREASE_QUANTITY:
      return {
        ...state,
        basket: state.basket
          .map((item) =>
            item.id === action.id && item.amount > 1
              ? { ...item, amount: item.amount - 1 }
              : item
          )
          .filter((item) => item.amount > 0),
      };
    default:
      return state;
  }
};