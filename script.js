'use strict'

const ctx = document.getElementById("myChart").getContext("2d");
const priceInput = document.querySelector("#price");
const itemInput = document.querySelector("#item");
const amountInput = document.querySelector("#amount");
const sourceInput = document.querySelector("#source");
const addExpenseButton = document.querySelector(".add-expense-btn");
const addIncomeButton = document.querySelector(".add-income-btn");
const date = document.querySelector("#date");
const budgetInput = document.querySelector("#budget-input");
const budgetBtn = document.querySelector("#budget-btn");
const budgetPara = document.querySelector("#budget-para");
const moneyLeft = document.querySelector("#money-left");
const budgetSpent = document.querySelector("#budget-spent");
const expensesContainer = document.querySelector(".expenses-container");
const incomeContainer = document.querySelector(".income-container");
const incomeHeading = document.querySelector(".income-heading")
const expensesHeading = document.querySelector(".expenses-heading")
const heading = document.querySelector('.heading')
const expenseInput = document.querySelector('.expense-input-container')
const incomeInput = document.querySelector('.income-input-container')
const displayIncomeButton = document.querySelector('.display-income-btn')
const displayExpenseButton = document.querySelector('.display-expense-btn')
const modalIncome = document.querySelector('.modal-income')
const modalExpenses = document.querySelector('.modal-expenses')
const expensesList = document.querySelector('.expenses-list')
const incomesList = document.querySelector('.incomes-list')
const addEnvelopeButton = document.querySelector('.add-envelope')
const modalEnvelopes = document.querySelector('.add-envelope-modal')
const categoryInput = document.querySelector('#category')
const goalInput = document.querySelector('#goal')
const addCategoryButton = document.querySelector('.add-category-btn')
const envelopes = document.querySelector('.envelopes')
const hamburger = document.querySelector('.hamburger')
const mobileNav = document.querySelector('.mobile-nav')
const label = document.querySelector('.label')
const label1 = document.querySelector('.label1')
const label2 = document.querySelector('.label2')
const logo = document.querySelector('.logo a')

window.addEventListener('load', () => document.body.style.opacity = 1)
logo.lastChild.textContent = ''

let expenses = [];
let incomes = []

if (!localStorage.getItem('expenses') && !localStorage.getItem('incomes')) {
    localStorage.setItem('expenses', JSON.stringify(expenses))
    localStorage.setItem('incomes', JSON.stringify(incomes))
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
})


class Expense {
    constructor(amount, description) {
        this.amount = amount
        this.description = description
        this.date = new Intl.DateTimeFormat('en-US').format(new Date())
        this.id = Math.random()
        this.moveToLocalStorage()
    }
    moveToLocalStorage() {
        if (localStorage.getItem('expenses')) {
            expenses = JSON.parse(localStorage.getItem('expenses'))
        }
        expenses.push(this)
        console.log(expenses)
        localStorage.setItem('expenses', JSON.stringify(expenses))
    }
}


class Income extends Expense {
    constructor(amount, description) {
        super(amount, description)
    }
    moveToLocalStorage() {
        if (localStorage.getItem('incomes')) {
            incomes = JSON.parse(localStorage.getItem('incomes'))
        }
        incomes.push(this)
        console.log(incomes)
        localStorage.setItem('incomes', JSON.stringify(incomes))
    }
}


const closeModal = function () {
    const closeModalBtn = document.querySelectorAll('.close-modal')
    closeModalBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.closest('.modal')) {
                document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('modal-active'))
            }
        })
    })
}

closeModal()


//display expense input fields
const displayExpense = function () {
    displayExpenseButton.addEventListener('click', () => {
        modalExpenses.classList.add('modal-active')
        modalIncome.classList.remove('modal-active')

        closeModal()
    })
}
displayExpense()


//display income input fields
const displayIncome = function () {
    displayIncomeButton.addEventListener('click', () => {
        modalIncome.classList.add('modal-active')
        modalExpenses.classList.remove('modal-active')

        closeModal()
    })
}
displayIncome()


//click CONFIRM - create new Expense
addExpenseButton.addEventListener('click', (e) => {
    e.preventDefault()
    const expenseElement = document.querySelectorAll('.expense')
    if (!priceInput.value || +priceInput.value === NaN) {
        alert('Invalid input. Please enter a number.')
        return
    }
    if (expenseElement) {
        expenseElement.forEach(el => el.remove())
    }
    new Expense(priceInput.value, itemInput.value)
    renderExpenses()
    removeExpense()
    updateChart()
    priceInput.value = ''
    itemInput.value = ''

    let audio = new Audio('audio/cash.mp3')
    audio.volume = 0.3
    audio.play()
})


//click CONFIRM - create new Income
addIncomeButton.addEventListener('click', (e) => {
    e.preventDefault()
    const incomeElement = document.querySelectorAll('.income')
    if (!amountInput.value || +amountInput.value === NaN) {
        alert('Invalid input. Please enter a number.')
        return
    }
    if (incomeElement) {
        incomeElement.forEach(el => el.remove())
    }
    new Income(amountInput.value, sourceInput.value)
    renderIncomes()
    removeIncome()
    updateChart()
    amountInput.value = ''
    sourceInput.value = ''

    let audio = new Audio('audio/coins.mp3')
    audio.play()
})


const removeExpense = function () {
    const trash = document.querySelectorAll('.trash-expense')
    trash.forEach(trash => trash.addEventListener('click', (e) => {
        e.target.closest('.expense').remove()

        const expenseID = +e.target.closest('.expense').dataset.id
        const expensesLocal = JSON.parse(localStorage.getItem('expenses'))
        const removedElementArr = expensesLocal.filter(exp => exp.id !== expenseID)
        localStorage.setItem('expenses', JSON.stringify(removedElementArr))

        updateChart()
    }))
}


const removeIncome = function () {
    const trash = document.querySelectorAll('.trash-income')
    trash.forEach(trash => trash.addEventListener('click', (e) => {
        const target = e.target.closest('.income')
        target.remove()

        const incomeID = +target.dataset.id
        const incomesLocal = JSON.parse(localStorage.getItem('incomes'))
        const removedElementArr = incomesLocal.filter(inc => inc.id !== incomeID)
        localStorage.setItem('incomes', JSON.stringify(removedElementArr))
        updateChart()
    }))
}


//render expenses 
const renderExpenses = function () {
    const expenses = JSON.parse(localStorage.getItem('expenses'))
    expenses.forEach(expense => {
        expensesList.insertAdjacentHTML(
            "afterbegin", `
            <div class="expense" data-id="${expense.id}">
            <p><strong>Description</strong>: ${expense.description}</p>
            <p><strong>Amount</strong>: ${currencyFormatter.format(expense.amount)}</p>
            <p><strong>Date</strong>: ${expense.date}</p>
            <div><svg class="trash-expense" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg></div>
            </div>
            `
        );
    })
    modalExpenses.classList.remove('modal-active')
    removeExpense()
    closeEnvelopeModal()
}

if (localStorage.getItem('expenses')) { renderExpenses() }


const renderIncomes = function () {
    const incomes = JSON.parse(localStorage.getItem('incomes'))
    incomes.forEach(income => {
        incomesList.insertAdjacentHTML(
            "afterbegin", `
                <div class="income" data-id="${income.id}">
                <p><strong>Description</strong>: ${income.description}</p>
                <p><strong>Amount</strong>: ${currencyFormatter.format(income.amount)}</p>
                <p><strong>Date</strong>: ${income.date}</p>
                <div><svg class="trash-income" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg></div>
                </div>
                `
        );
    })
    modalIncome.classList.remove('modal-active')
    removeIncome()
}

if (localStorage.getItem('incomes')) { renderIncomes() }

//create chart
const data = {
    datasets: [
        {
            backgroundColor: [
                'rgba(0, 128, 0, 0.477)', 'yellow'
            ],
            cutout: '75%',
            data: [0, 0]
        },

    ],
};

const config = {
    type: "doughnut",
    data: data,
    options: {
        responsive: true,
    },
};

const budgetChart = new Chart(ctx, config);

//update UI
const updateChart = function () {
    let prices = [];
    let incomeTotal
    let expensesTotal

    //calculate total income
    if (localStorage.getItem('incomes')) {

        const incomes = JSON.parse(localStorage.getItem('incomes'))
        incomeTotal = incomes.reduce((acc, inc) => { return acc + +inc.amount }, 0)
    }

    //calculate total expenses
    if (localStorage.getItem('expenses')) {
        const expenses = JSON.parse(localStorage.getItem('expenses'))
        expensesTotal = expenses.reduce((acc, exp) => { return acc + +exp.amount }, 0)
    }

    //calculate and render % of budget left
    const calcRemaining = function () {

        const formatter = new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'USD',
        })

        //format remaining value, update chart colors
        const remaining = incomeTotal - expensesTotal;
        const spent = incomeTotal - remaining
        if (remaining < 0) {
            moneyLeft.style.color = 'red'
        }
        if (remaining > 0) {
            moneyLeft.style.color = 'green'
        }
        if (remaining >= 0) {
            moneyLeft.textContent = `${currencyFormatter.format(remaining)}`;
        }
        if (remaining < 0) {
            moneyLeft.textContent = `${(currencyFormatter.format(remaining)).toLocaleString('en-us')}`;
        }

        budgetSpent.textContent = formatter.format(-spent)

        const incomeSpent = +((expensesTotal / incomeTotal) * 100).toFixed(2);

        //update chart
        data.datasets[0].data = [incomeTotal - expensesTotal, expensesTotal]
        const green = 'rgba(0, 128, 80)'

        if (incomeSpent < 25) {
            data.datasets[0].backgroundColor = [green, 'yellow']
        }
        if (incomeSpent >= 25) {
            data.datasets[0].backgroundColor = [green, 'orange']
        }
        if (incomeSpent >= 50) {
            data.datasets[0].backgroundColor = [green, 'orangered']
        }
        if (incomeSpent >= 75) {
            data.datasets[0].backgroundColor = [green, 'red']
        }

        if (incomeTotal - expensesTotal >= 0) {
            budgetChart.update()
        } else {
            moneyLeft.textContent = `You are over the budget! ${currencyFormatter.format(remaining)}`
            budgetSpent.style.opacity = '0'

            data.datasets[0].data = [0, 100]
            budgetChart.update()
        }

    };
    calcRemaining();

    if (localStorage.getItem('expenses') == '[]' && localStorage.getItem('incomes') == '[]') {
        heading.style.opacity = '1'
        heading.style.scale = '1'
        moneyLeft.style.opacity = '0'
        budgetSpent.style.opacity = '0'
    } else {
        heading.style.opacity = '0'
        moneyLeft.style.opacity = '1'

    }
    closeEnvelopeModal()
};
updateChart()


///////////////////////////////////////////////ENVELOPES/////////////////////////////////////////

function openEnvelopeModal() {
    addEnvelopeButton.addEventListener('click', (e) => {
        modalEnvelopes.classList.add('modal-active')
    })
}
openEnvelopeModal()


function renderEnvelopes() {
    if (!localStorage.getItem('envelopes')) return
    document.querySelectorAll('.envelope').forEach(env => env.remove())
    JSON.parse(localStorage.getItem('envelopes')).forEach(env => {

        const category = env.category
        const goal = env.goal
        const id = env.id
        const total = env.total
        const remaining = goal - total
        const progress = Math.round((total / goal) * 100)
        console.log('progress: ',progress)

        envelopes.insertAdjacentHTML('afterbegin', `
        <div class="modal-envelope modal">
            <div><svg class="close-modal" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></div>
            <h2 class="modal-heading">${category}</h2>
                <input type="number" placeholder="Amount" class="add-env-input" required />
                <input class="env-confirm-btn" value="CONFIRM" type="button" />
            </div>
        </div>
            <div class="envelope" data-id="${id}">
            <div><svg class="trash-envelope" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg></div>
                <h3 class="envelope-title">${category}</h3>
                <p class="envelope-total">Saved: <span>${currencyFormatter.format(total)}</span></p>
                <p class="envelope-goal">Goal: ${currencyFormatter.format(goal)}</p>
                <p class="envelope-left">Remaining: ${currencyFormatter.format(remaining)}</p>
                <div class="envelope-progress"></div>
            `)
            const progressBar = document.querySelector('.envelope-progress')
            progressBar.style.backgroundImage = `linear-gradient(to right, var(--color-primary) 0% ${progress}%, var(--color-accent) ${progress}% ${progress}%)`
            
        modalEnvelopes.classList.remove('modal-active')

        if(total >= goal){
            const envelope = document.querySelector('.envelope')
            const remainingPara = envelope.querySelector('.envelope-left')
            envelope.style.color = 'white'
            envelope.style.backgroundColor = 'var(--color-primary)'
            remainingPara.textContent = "You've reached the goal! 💰"
        }
        removeEnvelope()
        closeEnvelopeModal()
    })
}
renderEnvelopes()


function addEnvelope(){

    addCategoryButton.addEventListener('click', () => {
        let envelopesArr = []
    
        if (localStorage.getItem('envelopes')) {
            envelopesArr = JSON.parse(localStorage.getItem('envelopes'))
        }
        envelopesArr.push({ 'category': categoryInput.value, 'goal': goalInput.value, 'total': 0, 'id': Math.random() })
        localStorage.setItem('envelopes', JSON.stringify(envelopesArr))
        document.querySelector('#category').value = ''
        document.querySelector('#goal').value = ''
        renderEnvelopes()
        removeEnvelope()
        closeEnvelopeModal()
    })
}
addEnvelope()


function removeEnvelope(){
    let envelopesArr = []

    const trash = document.querySelectorAll('.trash-envelope')
    trash.forEach(trash => trash.addEventListener('click', (e) =>{
        const clickedEnv = e.target.closest('.envelope')

        JSON.parse(localStorage.getItem('envelopes')).forEach(env => {
            console.log(env)
            console.log(clickedEnv.dataset.id)
            
            if(+clickedEnv.dataset.id !== +env.id){
                envelopesArr.push(env)
            }
            console.log(envelopesArr)
            localStorage.setItem('envelopes', JSON.stringify(envelopesArr))
         
        })
        renderEnvelopes()
    }))
}
removeEnvelope()


function closeEnvelopeModal(){
    document.querySelectorAll('.envelope').forEach(env => env.addEventListener('click', (e) => {
        const clickedEnv = e.target
        const modal = clickedEnv.previousElementSibling
        if(modal){
            modal.style.display = 'flex'
            const envInput = modal.querySelector('.add-env-input')
            const confirm = modal.querySelector('.env-confirm-btn')
            const envelopes = JSON.parse(localStorage.envelopes)
            const envelopeID = +clickedEnv.dataset.id
            
            confirm.addEventListener('click', () => {
            envelopes.forEach(env => {
                if(env.id === envelopeID){
                    env.total = env.total + +envInput.value
                }
            })
            localStorage.setItem('envelopes', JSON.stringify(envelopes))
            renderEnvelopes()
            modal.style.display = 'none'
        })
        const closeBtn = modal.querySelector('.close-modal')
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none'
        })
    }
    }))
}


hamburger.addEventListener('click', (e) => { 
    if(e.target.closest('.hamburger')){
        mobileNav.classList.toggle('mobile-active')
        label.classList.toggle('label-active')
        label1.classList.toggle('label1-active')
        label2.classList.toggle('label2-active')
    }
})


