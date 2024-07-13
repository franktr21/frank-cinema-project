var dateScreen = document.querySelector('.date-container');
var seatScreen = document.querySelector('.seat-container');

var reserveButton = document.getElementById('reserve-button');
var backButton = document.getElementById('back-button');

var dateSelection = document.querySelector('.date-selection');

var moreText = document.querySelector('.more');
var threeDots = document.querySelector('.three-dots');
var readMoreButton = document.querySelector('#read-more');
var lessButton = document.querySelector('#less');

var seatRowOneLeftHTML = document.querySelector('#seat-row-one>.seat-row:first-child');
var seatRowOneRightHTML = document.querySelector('#seat-row-one>.seat-row:last-child');

var seatRowTwoLeftHTML = document.querySelector('#seat-row-two>.seat-row:first-child');
var seatRowTwoRightHTML = document.querySelector('#seat-row-two>.seat-row:last-child');

var seatRowThreeHTML = document.querySelector("#seat-row-three");
var seatRowFourHTML = document.querySelector("#seat-row-four");
var seatRowFiveHTML = document.querySelector("#seat-row-five");
var seatRowSixHTML = document.querySelector("#seat-row-six");

var seatSelectedNameHTML = document.getElementById('selected-seats-name');
var totalPriceHTML = document.getElementById('total-price');
var buyButton = document.getElementById('buy-button');
var modalHTML = document.querySelector('.modal');
var yesButtonHTML = document.querySelector('.modal #yes-button');
var noButtonHTML = document.querySelector('.modal #no-button');

reserveButton.addEventListener("click", function () {
    dateScreen.classList.add('d-none');
    seatScreen.classList.remove('d-none');
});

backButton.addEventListener("click", function (event) {
    if (selectedSeats.length) {
        modalHTML.style.display = 'block';
    } else {
        handleBackToDateSelection();
    }
});

yesButtonHTML.addEventListener("click", handleBackToDateSelection);
noButtonHTML.addEventListener("click", function () {
    modalHTML.style.display = 'none';
});

function handleBackToDateSelection() {
    dateScreen.classList.remove('d-none');
    seatScreen.classList.add('d-none');

    var selectSeatsHTML = document.querySelectorAll('.selected');
    for (var i = 0; i < selectSeatsHTML.length; i++) {
        selectSeatsHTML[i].classList.remove('selected');
    }
    selectedSeats = [];

    generateSeatNameAndPrice();
    modalHTML.style.display = 'none';
}

var slots = [
    { id: "slot_1", date: "Thu 21", time: "10:00" },
    { id: "slot_2", date: "Thu 21", time: "12:00" },
    { id: "slot_3", date: "Thu 21", time: "14:30" },
    { id: "slot_4", date: "Thu 21", time: "16:00" },
    { id: "slot_5", date: "Thu 21", time: "18:00" },
    { id: "slot_1", date: "Thu 21", time: "10:00" },
    { id: "slot_2", date: "Thu 21", time: "12:00" },
    { id: "slot_3", date: "Thu 21", time: "14:30" },
    { id: "slot_4", date: "Thu 21", time: "16:00" },
    { id: "slot_5", date: "Thu 21", time: "18:00" }
];

for (var i = 0; i < slots.length; i++) {
    var slotContainer = document.createElement('div');
    var dateContainer = document.createElement('div');
    dateContainer.classList.add('date');
    dateContainer.draggable = "true";
    var date = document.createElement('div');
    date.innerHTML = slots[i].date;
    if (i == 1 || i == 3) {
        slotContainer.classList.add('up-one');
    }
    if (i == 2) {
        dateContainer.classList.add('active');
        slotContainer.classList.add('up-two');
    }
    var timeContainer = document.createElement('div');
    timeContainer.classList.add('time');
    var time = document.createElement('div');
    time.textContent = slots[i].time;

    slotContainer.appendChild(dateContainer);
    slotContainer.appendChild(timeContainer);
    dateContainer.appendChild(date);
    timeContainer.appendChild(time);

    dateSelection.appendChild(slotContainer);
}

readMoreButton.onclick = function () {
    moreText.style.display = 'inline';
    threeDots.style.display = 'none';
    readMoreButton.style.display = 'none';
    lessButton.style.display = 'inline';
};

lessButton.onclick = function () {
    moreText.style.display = 'none';
    threeDots.style.display = 'inline';
    readMoreButton.style.display = 'inline';
    lessButton.style.display = 'none';
};

var selectedSeats = [];

function generateSeatNameAndPrice() {
    seatSelectedNameHTML.innerHTML = "";
    totalPriceHTML.innerHTML = "";
    var vipSeats = [];

    if (selectedSeats.length === 0) {
        seatSelectedNameHTML.innerHTML = 'Please select a seat';
        totalPriceHTML.innerHTML = '0';
        return;
    }

    // Sort selected seats by their ids
    selectedSeats.sort((a, b) => parseInt(a.id.replace('seat_', '')) - parseInt(b.id.replace('seat_', '')));

    // Group adjacent seats
    var groupedSeats = [];
    var start = parseInt(selectedSeats[0].id.replace('seat_', ''));
    var end = start;

    for (var i = 1; i < selectedSeats.length; i++) {
        var currentSeat = selectedSeats[i];
        var previousSeat = selectedSeats[i - 1];
        var currentSeatId = parseInt(currentSeat.id.replace('seat_', ''));
        var previousSeatId = parseInt(previousSeat.id.replace('seat_', ''));

        if (currentSeatId === previousSeatId + 1) {
            end = currentSeatId;
        } else {
            groupedSeats.push(start === end ? start : `${start}-${end}`);
            start = currentSeatId;
            end = start;
        }

        if (currentSeat.isVip === 'true') {
            vipSeats.push(currentSeatId);
        }
    }
    groupedSeats.push(start === end ? start : `${start}-${end}`); // Add the last group

    seatSelectedNameHTML.innerHTML = groupedSeats.join(", ");
    totalPriceHTML.innerHTML = selectedSeats.reduce((sum, seat) => sum + +seat.price, 0);

    if (vipSeats.length > 0) {
        seatSelectedNameHTML.innerHTML += "<br>VIP Seats: " + vipSeats.join(", ");
    }
}


function updateBuyButtonStatus() {
    buyButton.disabled = selectedSeats.length === 0;
}

function handleSeatClick(event) {
    var available = event.target.dataset.available;
    var id = event.target.dataset.id;
    var isVip = event.target.dataset.isVip;
    var price = event.target.dataset.price;

    if (available === 'true') {
        var seatIndex = selectedSeats.findIndex(function (seat) {
            return seat.id === id;
        });

        if (seatIndex !== -1) {
            event.target.classList.remove('selected');
            selectedSeats.splice(seatIndex, 1);
        } else {
            event.target.classList.add('selected');
            var newSeat = { id: id, isVip: isVip, price: price };
            selectedSeats.push(newSeat);
        }

        generateSeatNameAndPrice();
    } else {
        event.target.classList.add('shake');
        setTimeout(function () {
            event.target.classList.remove('shake');
        }, 500);
    }
}

function generateSeats(rowData, seatRowHTML) {
    for (var i = 0; i < rowData.length; i++) {
        var currentSeat = rowData[i];

        var seat = document.createElement('div');
        seat.classList.add('seat');
        seat.dataset.available = currentSeat.available;
        seat.dataset.id = currentSeat.id;
        seat.dataset.isVip = currentSeat.isVip;
        seat.dataset.price = currentSeat.price;

        if (!currentSeat.available) {
            seat.classList.add('unavailable');
        } else {
            seat.classList.add('available');
        }

        seat.addEventListener('click', handleSeatClick);
        seat.innerHTML = `<svg width="30" height="22" viewBox="0 0 30 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 4C0 2.89543 0.89543 2 2 2H4C5.10457 2 6 2.89543 6 4V14C6 15.1046 6.89543 16 8 16H22C23.1046 16 24 15.1046 24 14V4C24 2.89543 24.8954 2 26 2H28C29.1046 2 30 2.89543 30 4V17C30 19.7614 27.7614 22 25 22H5C2.23858 22 0 19.7614 0 17V4Z" fill="#D9D9D9"></path>
            <path d="M7 3C7 1.34315 8.34315 0 10 0H20C21.6569 0 23 1.34315 23 3V14C23 14.5523 22.5523 15 22 15H8C7.44772 15 7 14.5523 7 14V3Z" fill="#D9D9D9"></path>
        </svg>`;

        seatRowHTML.appendChild(seat);
    }
}

generateSeats(seat_row_one.slice(0, seat_row_one.length / 2), seatRowOneLeftHTML);
generateSeats(seat_row_one.slice(seat_row_one.length / 2), seatRowOneRightHTML);

generateSeats(seat_row_two.slice(0, seat_row_two.length / 2), seatRowTwoLeftHTML);
generateSeats(seat_row_two.slice(seat_row_two.length / 2), seatRowTwoRightHTML);

generateSeats(seat_row_three, seatRowThreeHTML);
generateSeats(seat_row_four, seatRowFourHTML);
generateSeats(seat_row_five, seatRowFiveHTML);
generateSeats(seat_row_six, seatRowSixHTML);

var dates = document.querySelectorAll('.date-selection>div');

function clearClass() {
    for (var i = 0; i < dates.length; i++) {
        dates[i].classList = "";
    }
}

function handleScroll() {
    clearClass();
    var itemWidth = 75;
    var scrollLeft = dateSelection.scrollLeft;
    var currentItem = Math.floor(scrollLeft / itemWidth);
    
    var upOne = currentItem + 2;
    var upOneAnother = currentItem + 4;
    var upTwo = currentItem + 3;

    for (var i = 0; i < dates.length; i++) {
        dates[i].querySelectorAll('.date-item').forEach(function(item) {
            item.classList.remove('up-one', 'up-two');
        });
    }

    if (upOne >= 0 && upOne < dates.length) {
        dates[upOne].classList.add('up-one');
    }
    if (upOneAnother >= 0 && upOneAnother < dates.length) {
        dates[upOneAnother].classList.add('up-one');
    }
    if (upTwo >= 0 && upTwo < dates.length) {
        dates[upTwo].classList.add('up-two');
    }
}

dateSelection.addEventListener('scroll', handleScroll);
dateSelection.addEventListener('touchmove', handleScroll);

var nextButton = document.getElementById('next-button');
var prevButton = document.getElementById('prev-button');

nextButton.addEventListener('click', function() {
    dateSelection.scrollBy({ left: 100, behavior: 'smooth' });
});

prevButton.addEventListener('click', function() {
    dateSelection.scrollBy({ left: -100, behavior: 'smooth' });
});
