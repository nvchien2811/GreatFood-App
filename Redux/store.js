import { createSlice, configureStore} from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 5,
    link:'http://192.168.43.25/DemoJWT/',
    searchMenu:'',
    amountFavorite:0,
    amountCart:0,
  },
  reducers: {
    incremented: state => {
      state.value += 1
    },
    updateSearchMenu : (state,action) => {
      state.searchMenu = action.payload;  
    },
    updateAmountFavorite : (state,action) => {
      state.amountFavorite = action.payload
    },
    updateAmountCart : (state,action) => {
      state.amountCart = action.payload
    },
   
  }
})


export const { incremented,updateSearchMenu,updateAmountFavorite,updateAmountCart } = counterSlice.actions


const store = configureStore({
    reducer: counterSlice.reducer
})
// Can still subscribe to the store
// store.subscribe(() => console.log(store.getState()))

// Still pass action objects to `dispatch`, but they're created for us
store.dispatch(incremented())
// {value: 1}
export default store;