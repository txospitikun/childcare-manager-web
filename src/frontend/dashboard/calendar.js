import { getCurrentSelectedChild } from './childrenOperations.js';
import { fetchSleepingEntries } from './sleepingOperations.js';
import { fetchFeedingEntries } from './feedingOperations.js';

const calendarContainer = document.getElementById("calendarElement");
const monthYearDisplay = document.getElementById("month-year");
const previousMonthButton = document.getElementById("previous-month-button");
const nextMonthButton = document.getElementById("next-month-button");
const currentDayTitle = document.getElementById("current-day-title");

let currentDate = new Date();
let today = new Date();
export let selectedDate = new Date();

function updateCalendar() {
    calendarContainer.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    let dateString = currentDate.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });
    dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
    monthYearDisplay.textContent = dateString;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonthDays = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    for (let i = prevMonthLastDate - prevMonthDays + 1; i <= prevMonthLastDate; i++) {
        calendarContainer.appendChild(createCalendarDate(i, "not-current", new Date(year, month - 1, i)));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isToday = date.toDateString() === today.toDateString();
        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
        calendarContainer.appendChild(createCalendarDate(day, isSelected ? "current" : "", date));
        if (isToday && !selectedDate) {
            updateCurrentDayTitle(date);
        }
    }

    const totalDays = prevMonthDays + daysInMonth;
    let nextMonthDays = 35 - totalDays;
    if (nextMonthDays < 0) {
        nextMonthDays = 42 - totalDays;
    }

    for (let i = 1; i <= nextMonthDays; i++) {
        const date = new Date(year, month + 1, i);
        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
        calendarContainer.appendChild(createCalendarDate(i, "not-current", date));
        if (isSelected && date.getMonth() === month + 1) {
            const dateDiv = calendarContainer.lastChild;
            dateDiv.classList.add('current');
        }
    }

    const numRows = Math.ceil((prevMonthDays + daysInMonth + nextMonthDays) / 7);
    calendarContainer.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
}

function createCalendarDate(day, additionalClass, date) {
    const dateDiv = document.createElement("div");
    dateDiv.className = `calendar-date ${additionalClass}`;

    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-date-day";
    dayDiv.textContent = day;

    dateDiv.appendChild(dayDiv);

    dateDiv.addEventListener("click", function () {
        document.querySelectorAll('.calendar-date.current').forEach(el => {
            el.classList.remove('current');
        });
        dateDiv.classList.add('current');

        updateCurrentDayTitle(date);
        selectedDate = date;
        const selectedChildId = getCurrentSelectedChild().dataset.childId;
        fetchFeedingEntries(date, selectedChildId);
        fetchSleepingEntries(date, selectedChildId);
    });

    return dateDiv;
}

function updateCurrentDayTitle(date) {
    const dayOfWeek = date.toLocaleDateString('ro-RO', { weekday: 'long' });
    const dayAndMonth = date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' });
    currentDayTitle.innerHTML = `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}<br>${dayAndMonth.charAt(0).toUpperCase() + dayAndMonth.slice(1)}`;
}

previousMonthButton.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

nextMonthButton.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

updateCalendar();
updateCurrentDayTitle(selectedDate);