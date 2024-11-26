// src/redux/ticketSlice.js

import { createSlice } from "@reduxjs/toolkit";

const ticketSlice = createSlice({
  name: "ticket",
  initialState: {
    ticketId: null,
  },
  reducers: {
    setTicketId: (state, action) => {
      state.ticketId = action.payload;
    },
    clearTicketId: (state) => {
      state.ticketId = null;
    },
  },
});

export const { setTicketId, clearTicketId } = ticketSlice.actions;
export default ticketSlice.reducer;
