// 等待DOM加載完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化地圖，設置中心點為沖繩那霸市
    const map = L.map('map').setView([26.2124, 127.6809], 9);

    // 添加OpenStreetMap圖層
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // 定義行程中的主要景點
    const locations = [
        // 第一天
        {name: '那霸機場', coords: [26.2051, 127.6455], day: 1, description: '行程起點，租車地點'},
        {name: '國際通', coords: [26.2144, 127.6797], day: 1, description: '沖繩最著名的購物街，長約1.6公里'},
        {name: '首里城', coords: [26.2171, 127.7190], day: 1, description: '琉球王國的政治中心，融合了中國和日本的建築風格'},
        
        // 第二天
        {name: '殘波岬', coords: [26.4414, 127.7181], day: 2, description: '位於讀谷村的美麗海岬，有白色燈塔和壯觀的海蝕地形'},
        {name: '美麗海水族館', coords: [26.6939, 127.8780], day: 2, description: '沖繩最著名的景點之一，擁有世界最大的水族箱之一「黑潮之海」'},
        {name: '名護市', coords: [26.5914, 127.9773], day: 2, description: '第二天住宿地點'},
        
        // 第三天
        {name: '古宇利大橋', coords: [26.7042, 128.0153], day: 3, description: '連接本島與古宇利島的橋樑，全長約2公里'},
        {name: '古宇利島', coords: [26.7172, 128.0172], day: 3, description: '被稱為「心形島」的美麗小島，有絕美海灘'},
        {name: '備瀨福木林道', coords: [26.6611, 127.8802], day: 3, description: '由300年以上歷史的福木樹所形成的綠色隧道'},
        
        // 第四天
        {name: '萬座毛', coords: [26.4985, 127.8545], day: 4, description: '位於恩納村的著名景點，有象鼻狀的海蝕岩石和壯觀的懸崖海景'},
        {name: '恩納村', coords: [26.4502, 127.8270], day: 4, description: '沖繩著名的度假區，有美麗的海灘和度假酒店'},
        {name: '和平祈念公園', coords: [26.0958, 127.7066], day: 4, description: '位於沖繩南部的糸滿市，紀念二戰沖繩戰役的犧牲者'},
        
        // 第五天
        {name: '波上宮', coords: [26.2233, 127.6663], day: 5, description: '那霸市區最重要的神社，建於海邊的懸崖上'},
        {name: '新都心', coords: [26.2259, 127.6975], day: 5, description: '那霸市的現代購物區，有大型商場和各種商店'}        
    ];

    // 定義每天行程的顏色
    const dayColors = {
        1: '#FF5252', // 紅色
        2: '#FF9800', // 橙色
        3: '#4CAF50', // 綠色
        4: '#2196F3', // 藍色
        5: '#9C27B0'  // 紫色
    };

    // 為每個景點添加標記
    const dayMarkers = {};
    
    locations.forEach(location => {
        // 創建自定義圖標
        const icon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${dayColors[location.day]}; color: white; padding: 5px; border-radius: 50%; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; font-weight: bold;">${location.day}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        // 添加標記
        const marker = L.marker(location.coords, {icon: icon}).addTo(map);
        
        // 添加彈出信息
        marker.bindPopup(`<strong>${location.name}</strong><br>第${location.day}天<br>${location.description}`);
        
        // 將標記添加到對應天數的數組中
        if (!dayMarkers[location.day]) {
            dayMarkers[location.day] = [];
        }
        dayMarkers[location.day].push(marker);
    });

    // 為每天的行程創建路線
    for (let day = 1; day <= 5; day++) {
        if (dayMarkers[day] && dayMarkers[day].length > 1) {
            const dayCoords = dayMarkers[day].map(marker => marker.getLatLng());
            
            // 創建路線
            const polyline = L.polyline(dayCoords, {
                color: dayColors[day],
                weight: 3,
                opacity: 0.7,
                dashArray: '10, 10'
            }).addTo(map);
            
            // 添加路線彈出信息
            polyline.bindPopup(`第${day}天行程路線`);
        }
    }

    // 添加圖例
    const legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'info legend');
        div.style.backgroundColor = 'white';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        div.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
        
        div.innerHTML = '<h4 style="margin-top: 0; margin-bottom: 10px; text-align: center;">行程圖例</h4>';
        
        for (let day = 1; day <= 5; day++) {
            div.innerHTML += 
                `<div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <div style="background-color: ${dayColors[day]}; width: 20px; height: 20px; border-radius: 50%; margin-right: 10px;"></div>
                    <span>第${day}天</span>
                </div>`;
        }
        
        return div;
    };
    
    legend.addTo(map);

    // 平滑滾動效果
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });
});