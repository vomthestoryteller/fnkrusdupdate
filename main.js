
let timelineData = [];

document.addEventListener('DOMContentLoaded', () => {
    const files = ['nuke.json', 'katana.json', 'mari.json'];
    
    Promise.all(files.map(file => fetch(file).then(res => res.json())))
        .then(results => {
            // Flatten the array of arrays into a single array
            timelineData = results.flat().sort((a, b) => new Date(a.date) - new Date(b.date));
            renderTimeline('all');
        })
        .catch(err => console.error("Error loading JSON files:", err));
});

function renderTimeline(filter) {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    // Reset container with wires
    container.innerHTML = `
        <div class="timeline-wire"></div>
        <div class="timeline-wire-active"></div>
    `;

    const filteredData = filter === 'all' 
        ? timelineData 
        : timelineData.filter(item => item.product === filter);

    let currentYear = null;

    filteredData.forEach((item, index) => {
        const dateObj = new Date(item.date);
        const itemYear = dateObj.getFullYear();
        const isRightAligned = index % 2 === 0;
        
        let yearToShow = "";
        if (itemYear !== currentYear) {
            yearToShow = itemYear;
            currentYear = itemYear;
        }

        const itemHTML = item.featured 
            ? generateFeaturedHTML(item, isRightAligned, yearToShow) 
            : generateStandardHTML(item, isRightAligned, yearToShow);
            
        container.insertAdjacentHTML('beforeend', itemHTML);
    });

    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.classList.contains(`filter-btn-${filter}`)) {
            btn.classList.add('active');
        } else if (filter === 'all' && btn.classList.contains('filter-btn-all')) {
            btn.classList.add('active');
        }
    });
}

function renderIcon(icon, product) {
    if (icon.includes('/') || icon.includes('.')) {
        return `<img src="${icon}" alt="${product} icon" class="w-6 h-6 object-contain">`;
    }
    return `<span class="material-symbols-outlined text-${product} text-xl">${icon}</span>`;
}

function renderStatusBadge(status) {
    if (!status || status === 'Hidden') return '';
    const colorClass = status === 'Beta' ? 'bg-nuke text-black' : 'bg-white text-black';
    return `<div class="absolute top-4 right-4 ${colorClass} text-xs font-bold px-2 py-1 rounded shadow-sm">${status.toUpperCase()}</div>`;
}

function generateStandardHTML(item, isRightAligned, year) {
    const cardSideClasses = isRightAligned 
        ? 'md:w-5/12 order-2 md:order-1 flex justify-end pr-16 relative right-aligned' 
        : 'md:w-5/12 order-2 md:order-2 flex justify-start pl-16 relative left-aligned';
    const yearSideClasses = isRightAligned
        ? 'md:w-5/12 order-1 md:order-2 pl-16 flex items-center'
        : 'md:w-5/12 order-1 md:order-1 pr-16 flex justify-end items-center';

    const linkHtml = item.link ? `
        <a href="${item.link}" target="_blank" class="block mt-4 text-xs font-medium text-${item.product} hover:text-white transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">open_in_new</span>
            Release Notes
        </a>
    ` : '';

    return `
        <div class="relative flex flex-col md:flex-row items-center justify-between py-24 group transition-opacity duration-500">
            ${!isRightAligned ? `<div class="${yearSideClasses}"><span class="year-marker">${year}</span></div>` : ''}
            <div class="${cardSideClasses}">
                <div class="node-connector"></div>
                <div class="w-full max-w-md card-base card-${item.product} p-8 rounded-xl relative">
                    <div class="flex items-start justify-between mb-6">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded bg-${item.product}/10 border border-${item.product}/20 flex items-center justify-center">
                                ${renderIcon(item.icon, item.product)}
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-white tracking-tight">${item.product.charAt(0).toUpperCase() + item.product.slice(1)} <span class="text-${item.product} font-mono text-sm ml-1 opacity-80">${item.version}</span></h3>
                            </div>
                        </div>
                        <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-gray-800 px-2 py-1 rounded bg-[#0f0f0f]">${item.quarter}</span>
                    </div>
                    <h4 class="text-lg font-medium text-gray-200 mb-2">${item.title}</h4>
                    <p class="text-gray-400 text-sm leading-relaxed mb-4">${item.description}</p>
                    <div class="flex gap-2">
                        ${item.tags.map(tag => `<span class="px-2 py-1 text-[10px] uppercase font-mono bg-gray-900 border border-gray-800 text-gray-400 rounded">${tag}</span>`).join('')}
                    </div>
                    ${linkHtml}
                </div>
            </div>
            <div class="milestone-dot text-${item.product}"></div>
            ${isRightAligned ? `<div class="${yearSideClasses}"><span class="year-marker">${year}</span></div>` : ''}
        </div>
    `;
}

function generateFeaturedHTML(item, isRightAligned, year) {
    const yearSideClasses = isRightAligned
        ? 'md:w-5/12 order-1 md:order-2 pl-16 flex items-center'
        : 'md:w-5/12 order-1 md:order-1 pr-16 flex justify-end items-center';

    const linkHtml = item.link ? `
         <a href="${item.link}" target="_blank" class="w-full nuke-btn py-3 rounded text-xs uppercase tracking-wider flex items-center justify-center gap-2 group/btn mt-4 hover:brightness-110 transition-all">
            <span class="material-symbols-outlined text-lg">open_in_new</span>
            Release Notes
        </a>
    ` : `
        <button class="w-full nuke-btn py-3 rounded text-xs uppercase tracking-wider flex items-center justify-center gap-2 group/btn mt-4">
            <span class="material-symbols-outlined text-lg">settings_ethernet</span>
            Deep Dive into Nodes
        </button>
    `;

    const imageHtml = item.content 
        ? `<a href="${item.content}" target="_blank" class="block w-full h-full cursor-pointer group-image-link"><img alt="${item.title}" class="w-full h-full object-cover opacity-60 mix-blend-screen group-hover:scale-105 transition-transform duration-700" src="${item.image}"/></a>`
        : `<img alt="${item.title}" class="w-full h-full object-cover opacity-60 mix-blend-screen group-hover:scale-105 transition-transform duration-700" src="${item.image}"/>`;

    return `
        <div class="relative flex flex-col md:flex-row items-center justify-between py-24 group transition-opacity duration-500">
            ${!isRightAligned ? `<div class="${yearSideClasses}"><span class="year-marker text-nuke opacity-50">${year}</span></div>` : ''}
            <div class="milestone-dot text-nuke" style="box-shadow: 0 0 20px rgba(245,176,38,0.5); border-color: #f5b026;"></div>
            <div class="md:w-5/12 order-2 md:order-2 flex justify-start pl-16 relative left-aligned">
                <div class="node-connector bg-nuke" style="width: 64px;"></div>
                <div class="w-full max-w-xl card-base bg-[#0f0f0f] border-nuke/30 rounded-xl relative overflow-hidden group-hover:border-nuke/60 transition-colors shadow-[0_0_40px_-10px_rgba(245,176,38,0.1)] card-nuke">
                    <div class="h-64 relative bg-[#1a1a1a] border-b border-white/5 overflow-hidden">
                        ${imageHtml}
                        ${renderStatusBadge(item.status)}
                    </div>
                    <div class="p-8">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="w-12 h-12 rounded bg-nuke/10 border border-nuke/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,176,38,0.2)]">
                                ${renderIcon(item.icon, item.product)}
                            </div>
                            <div>
                                <h3 class="text-2xl font-bold text-white tracking-tight">Nuke <span class="text-nuke font-mono text-lg ml-1">${item.version}</span></h3>
                                <span class="text-xs text-gray-500 font-mono">${item.quarter} • USD 22.05</span>
                            </div>
                        </div>
                        <h4 class="text-xl font-bold text-white mb-3">${item.title}</h4>
                        <p class="text-gray-400 text-sm leading-relaxed mb-6">${item.description}</p>
                        ${linkHtml}
                    </div>
                </div>
            </div>
            ${isRightAligned ? `<div class="${yearSideClasses}"><span class="year-marker text-nuke opacity-50">${year}</span></div>` : ''}
        </div>
    `;
}

window.filterTimeline = function(product) {
    renderTimeline(product);
};
