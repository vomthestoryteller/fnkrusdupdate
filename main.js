
let timelineData = [];

document.addEventListener('DOMContentLoaded', () => {
    const files = ['nuke.json', 'katana.json', 'mari.json'];
    const timestamp = new Date().getTime();
    
    Promise.all(files.map(file => fetch(`${file}?t=${timestamp}`).then(res => res.json())))
        .then(results => {
            timelineData = results.flat().sort((a, b) => new Date(a.date) - new Date(b.date));
            renderTimeline(timelineData, 'all');
        })
        .catch(err => console.error("Error loading JSON files:", err));
});

window.filterTimeline = function(product) {
    if (product === 'all') {
        renderTimeline(timelineData, 'all');
    } else {
        // Redirect to specific pages if not on index.html, but main.js is for index.html mainly.
        // If we are on index.html and user clicks a filter button (which might be links in the new design)
        // Check if the button is a link or a filter action.
        // Based on previous HTML edits, buttons have onclick="filterTimeline('product')".
        // But the user wants separate pages. 
        // The HTML I wrote for index.html has buttons that call filterTimeline OR redirect.
        // Let's check index.html again.
        
        // Wait, the user said "nuke를 한번 누르면 사실상 index와 같은 내용이 불러와지고, 한번 더 눌러야 nuke만 필터되게 만들지 마세요."
        // This implies the user is navigating to nuke.html and sees "all" data first.
        // So nuke.html should load ONLY nuke data.
        
        // For index.html, filtering behavior:
        renderTimeline(timelineData, product);
    }
};
