# Wise Tracker

Wise Tracker is an app that allows users to track their personal finances and cryptocurrency investments. 

EXPENSE TRACKER - 
The user can input their monthly income and expenses. The app renders that data on the page and saves it in local storage. A budget is created and updated anytime the user adds or removes a transaction. The budget is visualized using Charts.js library.

ENVELOPES - 
Based on envelope saving system, traditionally using physical envelopes and cash, the user can create virtual envelopes and add money anytime to save up for a specific expense.

CRYPTO TRACKER - 
The user can add and track their cryptocurrency orders. Anytime a buy or sell order is added, the app will fetch the current price via Coin Gecko's API and calculate the order amount. The cryptocurrency is added to the user's holdings and the portfolio amount is updated. Autocomplete functionality is created from scratch using the API data.

CHARTS - 
The user can add assets to their watchlist, which will display the asset's chart. The charts are made using the Chart.js library and created dynamically by fetching the last 30 days of price data from the Coin Gecko API. Data from the same API is also used to dynamically create the list of available assets, their logos and symbols.
