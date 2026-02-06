
document.addEventListener('DOMContentLoaded', () => {
    const timestamp = new Date().getTime();
    fetch(`nuke.json?t=${timestamp}`)
        .then(res => res.json())
        .then(data => {
            const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
            renderTimeline(sortedData, 'nuke');
        })
        .catch(err => console.error("Error loading Nuke JSON:", err));
});
