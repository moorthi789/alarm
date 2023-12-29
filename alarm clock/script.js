let alarms = [];

document.addEventListener('DOMContentLoaded', function() {
    populateTimezones();
    document.getElementById('set-alarm-btn').addEventListener('click', setAlarm);
    document.getElementById('stop-alarm-btn').addEventListener('click', stopAlarm);
    document.getElementById('snooze-alarm-btn').addEventListener('click', snoozeAlarm);
    setInterval(updateCurrentTime, 1000);
    setInterval(checkAlarms, 1000);
});

function populateTimezones() {
    const timezoneSelect = document.getElementById('alarm-timezone');
    const timezones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Calcutta']; // Add more timezones as needed
    timezones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz;
        option.textContent = tz;
        timezoneSelect.appendChild(option);
    });
}

function updateCurrentTime() {
    const timeDisplay = document.getElementById('time');
    const now = new Date();
    let selectedTimezone = document.getElementById('alarm-timezone').value;
    if (selectedTimezone === 'local') {
        selectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    timeDisplay.textContent = now.toLocaleTimeString('en-US', { timeZone: selectedTimezone });
}

function setAlarm() {
    const time = document.getElementById('alarm-time').value;
    const label = document.getElementById('alarm-label').value || 'Alarm';
    const repeat = document.getElementById('alarm-repeat').value;
    let timezone = document.getElementById('alarm-timezone').value;
    if (timezone === 'local') {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    const alarm = { time, label, repeat, timezone, active: true };
    alarms.push(alarm);
    displayAlarms();
}

function displayAlarms() {
    const list = document.getElementById('alarm-list');
    list.innerHTML = '';
    alarms.forEach((alarm, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${alarm.label} - ${alarm.time} - Repeat: ${alarm.repeat} - Timezone: ${alarm.timezone}`;

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-alarm-btn';
        deleteBtn.onclick = function() { deleteAlarm(index); };
        
        listItem.appendChild(deleteBtn);
        list.appendChild(listItem);
    });
}

function deleteAlarm(index) {
    alarms.splice(index, 1);
    displayAlarms(); // Refresh the alarm list
}

function checkAlarms() {
    const now = new Date();
    alarms.forEach(alarm => {
        const alarmTime = new Date();
        alarmTime.setTime(now.getTime());
        const [hours, minutes] = alarm.time.split(':');
        alarmTime.setHours(hours, minutes, 0, 0);

        if (alarm.active && now.getHours() === alarmTime.getHours() && now.getMinutes() === alarmTime.getMinutes()) {
            playAlarmSound();
            alarm.active = false; // Prevents continuous triggering
        }
    });
}

function playAlarmSound() {
    const alarmSound = document.getElementById('alarm-sound');
    alarmSound.play();
    document.getElementById('stop-alarm-btn').style.display = 'block';
    document.getElementById('snooze-alarm-btn').style.display = 'block';
}

function stopAlarm() {
    const alarmSound = document.getElementById('alarm-sound');
    alarmSound.pause();
    alarmSound.currentTime = 0;
    document.getElementById('stop-alarm-btn').style.display = 'none';
    document.getElementById('snooze-alarm-btn').style.display = 'none';
}

function snoozeAlarm() {
    stopAlarm();
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    const snoozeTime = now.toLocaleTimeString().substring(0, 5);
    
    const alarm = { time: snoozeTime, label: 'Snooze', repeat: 'none', timezone: 'UTC', active: true };
    alarms.push(alarm);
    displayAlarms();
}
