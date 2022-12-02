'use strict'

const addAssetBtn = document.querySelector('.add-asset-btn')
const searchInput = document.querySelector('.search')
const selectAssetEl = document.querySelector('.select-asset')
const assetMenu = document.querySelector('.asset-menu')
const coins = document.querySelectorAll('.coin')
const placeholder = document.querySelector('.placeholder')
const buyButton = document.querySelector('.buy-btn')
const sellButton = document.querySelector('.sell-btn')
const buyInput = document.querySelector('.buy-input')
const sellInput = document.querySelector('.sell-input')
const inputAssetBuy = document.querySelector('.input-asset-buy')
const inputAmountBuy = document.querySelector('.input-amount-buy')
const inputAssetSell = document.querySelector('.input-asset-sell')
const inputAmountSell = document.querySelector('.input-amount-sell')
const confirmBuy = document.querySelector('.confirm-buy')
const confirmSell = document.querySelector('.confirm-sell')
const tableHeadings = document.querySelector('.table-headings')
const portfolioValue = document.querySelector('.portfolio-value')
const autocompleteBuy = document.querySelector('.autocomplete-buy')
const inputBuyUser = document.querySelector('.input-buy-user')
const inputBuyAuto = document.querySelector('.input-buy-auto')
const autoCompleteList = document.querySelector('.autocomplete-list')
const holdingsEl = document.querySelector('.holdings')
const quoteText = document.querySelector('.quote-text')
const quoteAuthor = document.querySelector('.quote-author cite')
const quoteEl = document.querySelector('.quote')
const hamburger = document.querySelector('.hamburger')
const mobileNav = document.querySelector('.mobile-nav')
const label = document.querySelector('.label')
const label1 = document.querySelector('.label1')
const label2 = document.querySelector('.label2')
const logo = document.querySelector('.logo a')


let trades = []
let allAssets = []
let currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
window.addEventListener('load', () => document.body.style.opacity = '1')
logo.lastChild.textContent = ''


if (!localStorage.getItem('trades')) {
    localStorage.setItem('trades', JSON.stringify(trades))
}
class Trade {
    constructor(assetID, assetName, amount, price, type, orderID) {
        this.id = assetID
        this.orderID = orderID
        this.name = assetName
        this.price = price
        this.amount = amount
        this.type = type
        this.date = new Intl.DateTimeFormat('en-US').format(new Date())
        this.calcValue()
        this.moveToLocalStorage()
        this.calcHoldings()
    }
    calcValue() {
        this.value = this.price * this.amount
        return this.value
    }
    moveToLocalStorage() {
        if (localStorage.getItem('trades')) {
            trades = JSON.parse(localStorage.getItem('trades'))
        }
        trades.push(this)
        localStorage.setItem('trades', JSON.stringify(trades))
    }
    calcHoldings() {
        const filteredArr = JSON.parse(localStorage.getItem('trades')).filter(trade => trade.name === `${this.name}`)

        const amount = filteredArr.reduce((acc, cur) => { return acc + cur.amount }, 0)
        localStorage.setItem(`${this.name}`, amount)
    }
}


function renderHoldings() {
    holdingsEl.innerHTML = ''
    const values = Object.keys(localStorage).filter(item => item !== 'envelopes' && item !== 'quotes' && item !== 'trades' && item !== 'assets' && item !== 'expenses' && item !== 'incomes')
    values.forEach(value => {
        const amount = localStorage.getItem(value)
        holdingsEl.insertAdjacentHTML('afterbegin', `
            <div class="holding ${value.replace(' ', '-')}-holding">
            <span>${value} </span><span>${amount}</span>
            </div>
            `)
        if (amount == 0) {
            holdingsEl.querySelector(`.${value.replace(' ', '-')}-holding`).remove()
        }
    })
}
renderHoldings()


const addAssetToPortfolio = async function (assetID, assetName, amount, type) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${assetID}&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=true&precision=2`)
        const data = await response.json()
        const price = Object.values(data)[0].usd

        if (response.status !== 200) {
            throw new Error(`Something went wrong: ${response.status}`)
        }
        const newTrade = new Trade(assetID, assetName, amount, price, type.toUpperCase(), Math.random())
        createFromLocalStorage()
    } catch (err) {
        Error(err)
    }
}


function createFromLocalStorage() {
    const tradesLocal = JSON.parse(localStorage.getItem('trades'))
    document.querySelectorAll('.row').forEach(row => row.remove())
    tradesLocal.forEach(trade => {
        tableHeadings.insertAdjacentHTML('afterend', `
        <tr class="row" data-id="${trade.orderID}" data-name="${trade.name}">
        <td>${trade.type}</td>
        <td>${trade.name}</td>
        <td>${currencyFormatter.format(trade.price)}</td>
    <td>${Math.abs(trade.amount)}</td>
    <td>${currencyFormatter.format(Math.abs(trade.value))}</td>
    <td>${(trade.date)}<span><svg class="trash trash-orders" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg></span></td>
  </tr>
  `)
        calcPortValue()
        renderHoldings()
        removeOrder()
    })
}
createFromLocalStorage()


function removeOrder() {
    const trash = document.querySelectorAll('.trash-orders')
    trash.forEach(trash => {
        trash.addEventListener('click', (e) => {
            const deleteID = e.target.closest('tr').dataset.id
            const name = e.target.closest('tr').dataset.name
            const trades = [...JSON.parse(localStorage.getItem('trades'))]
            trades.forEach((trade, index) => {
                if (trade.orderID == deleteID) {
                    trades.splice(index, 1)
                    localStorage.setItem(name, (JSON.parse(localStorage.getItem(name))) - trade.amount)
                }
                localStorage.setItem('trades', JSON.stringify(trades))
            })
            createFromLocalStorage()
            renderHoldings()
            calcPortValue()
        })
    })
}
removeOrder()


const chooseAsset = function () {
    buyButton.addEventListener('click', async function () {
        buyButton.style.filter = 'brightness(1.2)'
        sellButton.style.filter = 'brightness(.6)'
        buyInput.style.transform = 'translateY(0) translateX(10px)'
        sellInput.style.transform = 'translateY(100%) translateX(10px)'
        setTimeout(() => buyInput.style.zIndex = '100', 300)
        sellInput.style.zIndex = '-100'
    })
    sellButton.addEventListener('click', () => {
        sellButton.style.filter = 'brightness(1.2)'
        buyButton.style.filter = 'brightness(.6)'
        sellInput.style.transform = 'translateY(0) translateX(10px)'
        buyInput.style.transform = 'translateY(100%) translateX(10px)'
        setTimeout(() => sellInput.style.zIndex = '100', 300)
        buyInput.style.zIndex = '-100'
    })

    confirmBuy.addEventListener('click', () => {
        const selected = allAssets.filter(item => item.name.toLowerCase() === inputAssetBuy.value.toLowerCase())
        addAssetToPortfolio(selected[0].id, selected[0].name, +inputAmountBuy.value, 'buy')
        inputAssetBuy.value = ''
        inputAmountBuy.value = ''
        buyInput.style.transform = 'translateY(100%)'
        buyButton.style.filter = 'brightness(.6)'
        sellInput.style.transform = 'translateY(100%)'
        buyInput.style.zIndex = '-10'
        sellInput.style.zIndex = '-10'

    })
    confirmSell.addEventListener('click', () => {
        const selected = allAssets.filter(item => item.name.toLowerCase() === inputAssetSell.value.toLowerCase())
        addAssetToPortfolio(selected[0].id, selected[0].name, -inputAmountSell.value, 'sell')
        inputAssetSell.value = ''
        inputAmountSell.value = ''
        sellButton.style.filter = 'brightness(.6)'
        buyInput.style.transform = 'translateY(100%)'
        sellInput.style.transform = 'translateY(100%)'
        buyInput.style.zIndex = '-10'
        sellInput.style.zIndex = '-10'
    })
}
chooseAsset()


function deleteAutoComp() {
    document.querySelectorAll('.delete').forEach(el => el.remove())
}


const autocomplete = function () {
    inputAssetBuy.addEventListener('keyup', (e) => {
        deleteAutoComp()
        allAssets.forEach(asset => {
            if (inputAssetBuy.value === '') {
                return
            }
            if (asset.name.toLowerCase().startsWith(inputAssetBuy.value.toLowerCase())) {
                const autocompletePart = asset.name.slice(inputAssetBuy.value.length)

                autoCompleteList.insertAdjacentHTML('beforeend', `
                <div class="delete autocomplete-buy" data-id="${asset.id}"><span>${inputAssetBuy.value}</span><span style="color: #aaa">${autocompletePart}</span></div>
                `)
            }
        })
        document.querySelectorAll('.autocomplete-buy').forEach(el => {
            el.addEventListener('click', (e) => {
                const target = e.target.closest('.autocomplete-buy')
                inputAssetBuy.value = target.children[0].textContent + target.children[1].textContent
                deleteAutoComp()
            })
        })
    })

    window.addEventListener('click', (e) => {
        if (!e.target.closest('.delete')) { }
        deleteAutoComp()
    })
    inputAssetSell.addEventListener('keyup', (e) => {
        deleteAutoComp()
        allAssets.forEach(asset => {

            if (inputAssetSell.value === '') {
                return
            }
            if (asset.name.toLowerCase().startsWith(inputAssetSell.value.toLowerCase())) {
                const autocompletePart = asset.name.slice(inputAssetSell.value.length)
                autoCompleteList.insertAdjacentHTML('beforeend', `
                <div class="delete autocomplete-sell" data-id="${asset.id}"><span>${inputAssetSell.value}</span><span style="color: #aaa">${autocompletePart}</span></div>
                `)
            }
        })
        document.querySelectorAll('.autocomplete-sell').forEach(el => {
            el.addEventListener('click', (e) => {
                const target = e.target.closest('.autocomplete-sell')
                inputAssetSell.value = target.children[0].textContent + target.children[1].textContent
                deleteAutoComp()
            })
        })
    })
}
autocomplete()


function calcPortValue() {
    let portValue
    const tradesLocal = JSON.parse(localStorage.getItem('trades'))
    portValue = tradesLocal.reduce((acc, tr) => { return acc + tr.value }, 0)
    portfolioValue.textContent = new Intl.NumberFormat('en-us', { style: 'currency', currency: 'USD' }).format(portValue)
}


//create a chart
const getChart = async function (name, chartID, asset, currency) {
    assetMenu.insertAdjacentHTML('afterend', `
        <div class="${name} chart">
        <div class="open"></div>
        <div><svg class="trash trash-chart" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg></div>
        <canvas  id="${chartID}"></canvas>
        </div>
        `)
    //config chart design
    const labels = [];
    let pricesArr = []
    let timeArr = []

    const data = {
        labels: labels,
        datasets: [{
            label: `${name.toUpperCase()}`,
            fill: true,
            backgroundColor: 'rgba(255, 173, 32, .5)',
            borderColor: 'rgb(255, 173, 32)',
            borderWidth: '2',
            data: pricesArr,
            pointRadius: 0,
            fillColor: 'red'
        }]
    };
    const config = {
        type: 'line',
        data: data,
        options: {
            plugins: {
                legend: {
                    labels: {
                        boxWidth: 0,
                        color: 'rgb(40, 32, 162)'
                    }
                }
            },
            responsive: true,
            responsiveAnimationDuration: 0,
            scales: {
                y: {
                    ticks: {
                        callback: function (value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            },
        }
    };
    const myChart = new Chart(
        document.getElementById(chartID),
        config,
    );

    //fetch selected asset
    try {
        const request = await fetch(`https://api.coingecko.com/api/v3/coins/${asset}/market_chart?vs_currency=${currency}&days=30&interval=daily`)
        if (request.status !== 200) {
            throw new Error(`Something went wrong ☹: Error ${request.status}`)
        }
        //create array of asset's prices (Y-axis)
        const data = await request.json()
        const prices = data.prices

        prices.forEach(element => {
            const prices = element[1]
            pricesArr.push(prices)
            const time = element[0]
            timeArr.push(time)
        });

        //create array of dates (X-axis)
        timeArr.forEach(el => {
            let date = new Date(el)
            if (date.getDate() === 1) {
                const options = {
                    month: 'short',
                    day: 'numeric'
                }
                let dateFormatted = new Intl.DateTimeFormat('en-us', options).format(date)
                labels.push(dateFormatted)

            } if (date.getDate() !== 1) {
                const options = {
                    day: 'numeric',
                }
                let dateFormatted = new Intl.DateTimeFormat('en-us', options).format(date)
                labels.push(dateFormatted)
            }
        })

        labels.splice(-2, 1)
        pricesArr.splice(-2, 1)
        myChart.update()

    } catch (err) {
        alert(err.message)
    }
}


let assets = []

if (!localStorage.getItem('assets')) {
    localStorage.setItem('assets', JSON.stringify(assets))
}


class Asset {
    assets = []
    constructor(name, chartID, coin, currency) {
        this.name = name
        this.chartID = chartID
        this.coin = coin
        this.currency = currency
        this.moveToLocalStorage()
    }
    moveToLocalStorage() {
        if (localStorage.getItem('assets')) {
            assets = JSON.parse(localStorage.getItem('assets'))
        }
        assets.push(this)
        localStorage.setItem('assets', JSON.stringify(assets))
    }
    showValues() {
    }
}


//remove asset from local storage
const removeItem = function () {
    const trash = document.querySelectorAll('.trash-chart')
    trash.forEach(trash => trash.addEventListener('click', (e) => {
        e.target.closest('.chart').remove()
        const target = e.target.closest('.chart').querySelector('canvas')
        const targetID = target.id
        const assetsLocal = localStorage.getItem('assets')
        const removedElementArr = JSON.parse(assetsLocal).filter(asset => asset.chartID !== targetID)
        localStorage.setItem('assets', JSON.stringify(removedElementArr))
        assets = removedElementArr
    }))
}

//create asset from local storage
const createCharts = function () {
    const assets = localStorage.getItem('assets')
    const objects = JSON.parse(assets)
    objects.forEach(obj => {
        getChart(obj.name, obj.chartID, obj.coin, obj.currency)
    })
}
createCharts()


//show list of assets to choose from
assetMenu.addEventListener('click', (e) => {
    if (e.target.closest('.asset-menu')) {
        selectAssetEl.style.display = 'block'
        coins.forEach(coin => coin.style.display = 'flex')
    }
})


window.addEventListener('click', (e) => {
    const coins = document.querySelectorAll('.coin')
    let counter = Math.random()
    //close and reset list when asset is chosen or list is closed
    if (e.target !== selectAssetEl && e.target.closest('.asset-menu') !== assetMenu && e.target !== searchInput) {
        selectAssetEl.style.display = 'none'
        searchInput.value = ''
        coins.forEach(coin => coin.style.display = 'flex')
    }
    //create new object from selected asset
    if (e.target.closest('.coin')) {
        const coin = e.target.closest('.coin').id
        const name = e.target.closest('.coin').textContent
        const chart = `myChart${counter}`
        getChart(name, chart, coin, 'usd')
        const newAsset = new Asset(name, chart, coin, 'usd')
        counter++
        removeItem()
    }
})


//create a list of assets to choose from
const searchAssets = async function () {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
            if (response.status !== 200) {
                throw new Error(`Something went wrong: ${response.status}`)
            }
        const data = await response.json()
        allAssets = data
        data.forEach((coin, i) => {
            placeholder.insertAdjacentHTML('beforebegin', `
            <div class="coin${i} coin" id="${coin.id}" >${coin.name} <span class="symbol">(${coin.symbol.charAt(0).toUpperCase() + coin.symbol.slice(1)})</span><img src=${coin.image}/></div>
            `)
        })
        //search functionality
        searchInput.addEventListener('keyup', (e) => {
            const coins = document.querySelectorAll('.coin')
            coins.forEach(coin => {
                if (`${coin.textContent.toLowerCase()}`.includes(searchInput.value.toLowerCase())) {
                    coin.style.display = 'flex'
                } else {
                    coin.style.display = 'none'
                }
            })
        })
        
    } catch (err) {
        console.log(err.message)
    }
}
assetMenu.addEventListener('click', () => {
    searchAssets()
})
buyButton.addEventListener('click', () => {
    searchAssets()
})
sellButton.addEventListener('click', () => {
    searchAssets()
})

removeItem()


////////////////////////////////Quotes//////////////////////////////

async function fetchQuotes() {
    try {
        const response = await fetch('quotes.json')
        const data = await response.json()
        localStorage.setItem('quotes', JSON.stringify(data))
        renderQuote()
        setInterval(renderQuote, 10000)
    } catch (err) {
        console.log(err.message)
    }
}


function renderQuote() {
    quoteEl.style.opacity = 1
    const quotesArr = JSON.parse(localStorage.getItem('quotes'))
    let random = Math.floor(Math.random() * quotesArr.length)
    const randomQuote = quotesArr[random]
    quoteText.textContent = randomQuote.text
    quoteAuthor.textContent = '- ' + randomQuote.author
    setTimeout(() => {
        quoteEl.style.opacity = 0
    }, 8000);
}


if (!localStorage.getItem('quotes')) {
    fetchQuotes()
} else {
    renderQuote()
    setInterval(renderQuote, 10000)
}


hamburger.addEventListener('click', (e) => { 
    if(e.target.closest('.hamburger')){
        mobileNav.classList.toggle('mobile-active')
        label.classList.toggle('label-active')
        label1.classList.toggle('label1-active')
        label2.classList.toggle('label2-active')
    }
})