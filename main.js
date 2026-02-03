
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

function renderStatusBadge(status, product) {
    if (!status || status === 'Hidden') return '';
    const colorClass = status === 'Beta' ? `bg-${product} text-black` : 'bg-gray-200 text-gray-800';
    return `<div class="absolute top-4 right-4 ${colorClass} text-xs font-bold px-2 py-1 rounded shadow-sm">${status.toUpperCase()}</div>`;
}

function generateStandardHTML(item, isRightAligned, year) {
    const cardSideClasses = isRightAligned 
        ? 'md:w-5/12 order-2 md:order-1 flex justify-center md:justify-end px-4 md:pl-0 md:pr-8 relative right-aligned' 
        : 'md:w-5/12 order-2 md:order-2 flex justify-center md:justify-start px-4 md:pr-0 md:pl-8 relative left-aligned';
    const yearSideClasses = isRightAligned
        ? 'md:w-5/12 order-1 md:order-2 pl-8 flex items-center'
        : 'md:w-5/12 order-1 md:order-1 pr-8 flex justify-end items-center';

    const linkHtml = item.link ? `
        <a href="${item.link}" target="_blank" class="block mt-4 text-xs font-medium text-${item.product} hover:text-black transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">open_in_new</span>
            Release Notes
        </a>
    ` : '';

    return `
        <div class="relative flex flex-col md:flex-row items-center justify-between py-12 gap-6 md:gap-0 group transition-opacity duration-500">
            ${!isRightAligned ? `<div class="${yearSideClasses}"><span class="year-marker">${year}</span></div>` : ''}
            <div class="${cardSideClasses}">
                <div class="node-connector"></div>
                <div class="w-full max-w-2xl card-base card-${item.product} p-8 rounded-xl relative">
                    <div class="flex items-start justify-between mb-6">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded bg-${item.product}/10 border border-${item.product}/20 flex items-center justify-center">
                                ${renderIcon(item.icon, item.product)}
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-gray-900 tracking-tight">${item.product.charAt(0).toUpperCase() + item.product.slice(1)} <span class="text-version-highlight font-mono text-sm ml-1 opacity-80">${item.version}</span></h3>
                            </div>
                        </div>
                        <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-gray-200 px-2 py-1 rounded bg-gray-50">${item.quarter}</span>
                    </div>
                    <h4 class="text-lg font-medium text-gray-800 mb-2">${item.title}</h4>
                    <p class="text-gray-600 text-sm leading-relaxed mb-4">${item.description}</p>
                    <div class="flex flex-wrap gap-2">
                        ${item.tags.map(tag => `<span class="px-2 py-1 text-[10px] uppercase font-mono bg-gray-100 border border-gray-200 text-gray-500 rounded">${tag}</span>`).join('')}
                    </div>
                    ${linkHtml}
                </div>
            </div>
            <div class="milestone-dot text-${item.product}"></div>
            ${isRightAligned ? `<div class="${yearSideClasses}"><span class="year-marker">${year}</span></div>` : ''}
        </div>
    `;
}

function getProductColor(product) {
    const colors = {
        'nuke': '245, 176, 38',
        'katana': '227, 227, 0',
        'mari': '196, 60, 60'
    };
    return colors[product] || '245, 176, 38';
}

function getProductHexColor(product) {
     const colors = {
        'nuke': '#f5b026',
        'katana': '#e3e300',
        'mari': '#c43c3c'
    };
    return colors[product] || '#f5b026';
}

function generateFeaturedHTML(item, isRightAligned, year) {
    const cardSideClasses = isRightAligned 
        ? 'md:w-5/12 order-2 md:order-1 flex justify-center md:justify-end px-4 md:pl-0 md:pr-8 relative right-aligned' 
        : 'md:w-5/12 order-2 md:order-2 flex justify-center md:justify-start px-4 md:pr-0 md:pl-8 relative left-aligned';
    
    const yearSideClasses = isRightAligned
        ? 'md:w-5/12 order-1 md:order-2 pl-8 flex items-center'
        : 'md:w-5/12 order-1 md:order-1 pr-8 flex justify-end items-center';

    const product = item.product;
    const productName = product.charAt(0).toUpperCase() + product.slice(1);
    const rgb = getProductColor(product);
    const hex = getProductHexColor(product);

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

    // Handle image if it exists, otherwise placeholder or skip
    // The previous code had item.content wrapping the image.
    // If image is empty string in JSON, we might want to handle it, but for now assuming updated JSONs will be populated or handled gracefully.
    const imageSrc = item.image || 'https://via.placeholder.com/800x400';
    const imageHtml = item.content 
        ? `<a href="${item.content}" target="_blank" class="block w-full h-full cursor-pointer group-image-link relative">
             <img alt="${item.title}" class="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" src="${imageSrc}"/>
             <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div class="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                     <span class="material-symbols-outlined text-white text-6xl ml-[-1px] opacity-90">play_arrow</span>
                 </div>
             </div>
           </a>`
        : `<img alt="${item.title}" class="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" src="${imageSrc}"/>`;

    return `
        <div class="relative flex flex-col md:flex-row items-center justify-between py-12 gap-6 md:gap-0 group transition-opacity duration-500">
            ${!isRightAligned ? `<div class="${yearSideClasses}"><span class="year-marker text-${product} opacity-50">${year}</span></div>` : ''}
            <div class="milestone-dot text-${product}" style="box-shadow: 0 0 20px rgba(${rgb},0.5); border-color: ${hex};"></div>
            <div class="${cardSideClasses}">
                <div class="node-connector bg-${product}" style="width: 64px;"></div>
                <div class="w-full max-w-2xl card-base bg-white border-${product}/30 rounded-xl relative overflow-hidden group-hover:border-${product}/60 transition-colors shadow-[0_4px_20px_-5px_rgba(${rgb},0.1)] card-${product}">
                    <div class="h-64 relative bg-gray-100 border-b border-black/5 overflow-hidden">
                        ${imageHtml}
                        ${renderStatusBadge(item.status, product)}
                    </div>
                    <div class="p-8">
                        <div class="flex items-start justify-between mb-6">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded bg-${product}/10 border border-${product}/30 flex items-center justify-center shadow-[0_0_15px_rgba(${rgb},0.2)]">
                                    ${renderIcon(item.icon, product)}
                                </div>
                                <div>
                                    <h3 class="text-2xl font-bold text-gray-900 tracking-tight">${productName} <span class="text-version-highlight font-mono text-lg ml-1">${item.version}</span></h3>
                                </div>
                            </div>
                            <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-gray-200 px-2 py-1 rounded bg-gray-50">${item.quarter}</span>
                        </div>
                        <h4 class="text-xl font-bold text-gray-900 mb-3">${item.title}</h4>
                        <p class="text-gray-600 text-sm leading-relaxed mb-6">${item.description}</p>
                        <div class="flex flex-wrap gap-2 mb-6">
                            ${item.tags.map(tag => `<span class="px-2 py-1 text-[10px] uppercase font-mono bg-gray-100 border border-gray-200 text-gray-500 rounded">${tag}</span>`).join('')}
                        </div>
                        ${linkHtml}
                    </div>
                </div>
            </div>
            ${isRightAligned ? `<div class="${yearSideClasses}"><span class="year-marker text-${product} opacity-50">${year}</span></div>` : ''}
        </div>
    `;
}

window.filterTimeline = function(product) {
    renderTimeline(product);
};
