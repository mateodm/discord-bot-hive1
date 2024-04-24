function formatDate(dateString) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const time = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

    const formattedDate = `${month} ${day} at ${time} UTC`;
    return formattedDate;
}

module.exports = {formatDate}
