// Global Map and Marker Variables
let mainMap, deviceMap, vehicleMap;
const deviceMarkers = {};
const vehicleMarkers = {};
let socket = null;
let currentActiveVehicleId = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 5000; // 5 seconds

document.addEventListener('DOMContentLoaded', function () {
    const BASE_API = 'http://127.0.0.1:8000';
  
    // DOM Elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const notificationsBtn = document.getElementById('notificationsBtn');
    const deviceSearchForm = document.getElementById('deviceSearchForm');
    const vehicleSearchForm = document.getElementById('vehicleSearchForm');
    const quickSearchBtns = document.querySelectorAll('.quick-search-btn');
    const trackDeviceBtn = document.getElementById('trackDeviceBtn');
    const trackVehicleBtn = document.getElementById('trackVehicleBtn');
    const deviceDetails = document.getElementById('deviceDetails');
    const vehicleDetails = document.getElementById('vehicleDetails');
    const deviceSearchResults = document.getElementById('deviceSearchResults');
    const vehicleSearchResults = document.getElementById('vehicleSearchResults');
    const deviceMapEl = document.getElementById('deviceMap');
    const vehicleMapEl = document.getElementById('vehicleMap');
    const mainMapEl = document.getElementById('map');

    // Initialize WebSocket connection
    function initWebSocket() {
        try {
             // Close existing connection if it exists
            if (socket) {
                socket.close();
            }
            socket = new WebSocket('ws://127.0.0.1:8000/ws/location/');
            
            socket.onopen = function() {
                console.log('WebSocket connection established');
                reconnectAttempts = 0; // Reset attempts on successful connection
            };
            
            socket.onmessage = function(event) {
                try {
                    const data = JSON.parse(event.data);
                    // Validate data structure
                    if (!data.id || !data.type || data.latitude === undefined || data.longitude === undefined) {
                        throw new Error('Invalid message format');
                    }
                    
                    if (data.type === 'device') {
                        updateDeviceMarker(data.id, data.latitude, data.longitude);
                    } else if (data.type === 'vehicle') {
                        updateVehicleMarker(data.id, data.latitude, data.longitude);
                    }
                } catch (error) {
                    console.error('Error processing WebSocket message:', error, event.data);
                }
            };
            
            socket.onerror = function(error) {
                console.error('WebSocket error:', error);
            };
            
            socket.onclose = function() {
                console.log('WebSocket connection closed - attempting reconnect...');
                setTimeout(initWebSocket, 5000);
            };
        } catch (error) {
            console.error('WebSocket initialization error:', error);
            setTimeout(initWebSocket, 10000);
        }
    }

    // Initialize main map
    function initMainMap() {
        if (!mainMapEl) return;
        
        try {
            mainMap = L.map('map').setView([-1.2921, 36.8219], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mainMap);
            
            // Add static markers
            L.marker([-1.2921, 36.8219]).addTo(mainMap)
                .bindPopup('Security Office').openPopup();
            L.marker([-1.2915, 36.8205]).addTo(mainMap)
                .bindPopup('Library');
            L.marker([-1.2930, 36.8225]).addTo(mainMap)
                .bindPopup('Dormitory A');
        } catch (error) {
            console.error('Error initializing main map:', error);
        }
    }

    // Initialize device map with proper error handling
    function initDeviceMap() {
        if (!deviceMapEl) return;
        
        try {
            // Show map container first
            deviceMapEl.style.display = 'block';
            
            // Small delay to ensure DOM is updated
            setTimeout(() => {
                if (!deviceMap) {
                    deviceMap = L.map('deviceMap').setView([-1.2921, 36.8219], 15);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors'
                    }).addTo(deviceMap);
                    
                    // Force map to recalculate size
                    setTimeout(() => {
                        if (deviceMap) deviceMap.invalidateSize();
                    }, 100);
                    
                    console.log('Device map initialized');
                }
            }, 50);
        } catch (error) {
            console.error('Error initializing device map:', error);
        }
    }

    // Initialize vehicle map with proper error handling
    function initVehicleMap() {
        if (!vehicleMapEl) return;
        
        try {
            // Show map container first
            vehicleMapEl.style.display = 'block';
            
            // Small delay to ensure DOM is updated
            setTimeout(() => {
                if (!vehicleMap) {
                    vehicleMap = L.map('vehicleMap').setView([-1.2921, 36.8219], 15);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors'
                    }).addTo(vehicleMap);
                    
                    // Force map to recalculate size
                    setTimeout(() => {
                        if (vehicleMap) vehicleMap.invalidateSize();
                    }, 100);
                    
                    console.log('Vehicle map initialized');
                }
            }, 50);
        } catch (error) {
            console.error('Error initializing vehicle map:', error);
        }
    }

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

    // Navigation handling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            // Hide all pages and show selected one
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
            mobileMenu.classList.add('hidden');
  
            // Initialize maps when needed
            if (pageId === 'track-device' && !deviceMap) {
                initDeviceMap();
            }
            
            if (pageId === 'track-vehicle' && !vehicleMap) {
                initVehicleMap();
            }
  
            // Load data for dashboard
            if (pageId === 'dashboard') {
                loadDevices();
                loadVehicles();
            }
        });
    });

    // Device search form
    if (deviceSearchForm) {
        deviceSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchType = document.getElementById('searchType').value;
            const searchValue = document.getElementById('searchValue').value;
            
            // Ensure device map is initialized
            if (!deviceMap) {
                initDeviceMap();
            }

            fetch(`${BASE_API}/api/devices/search/?type=${searchType}&value=${searchValue}`)
                .then(res => {
                    if (!res.ok) throw new Error('Search failed');
                    return res.json();
                })
                .then(data => {
                    if (data && data.length > 0) {
                        const device = data[0];
                        updateDeviceMarker(device.id, device.last_latitude, device.last_longitude);
                        deviceMapEl.style.display = 'block';
                        deviceDetails.classList.remove('hidden');
                        // Ensure map is properly displayed
                        setTimeout(() => {
                            if (deviceMap) deviceMap.invalidateSize();
                        }, 100);
                    } else {
                        alert('No devices found matching your search');
                    }
                })
                .catch(error => {
                    console.error('Device search error:', error);
                    alert('Error searching for devices. Please check console for details.');
                });
        });
    }

    // Vehicle search form
    if (vehicleSearchForm) {
        vehicleSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchType = document.getElementById('vehicleSearchType').value;
            const searchValue = document.getElementById('vehicleSearchValue').value;
            
            // Ensure vehicle map is initialized
            if (!vehicleMap) {
                initVehicleMap();
            }

            fetch(`${BASE_API}/api/vehicles/search/?type=${searchType}&value=${searchValue}`)
                .then(res => {
                    if (!res.ok) throw new Error('Search failed');
                    return res.json();
                })
                .then(data => {
                    if (data && data.length > 0) {
                        const vehicle = data[0];
                        currentActiveVehicleId = vehicle.id;
                        updateVehicleMarker(vehicle.id, vehicle.last_latitude, vehicle.last_longitude);
                        vehicleMapEl.style.display = 'block';
                        vehicleDetails.classList.remove('hidden');
                        // Ensure map is properly displayed
                        setTimeout(() => {
                            if (vehicleMap) vehicleMap.invalidateSize();
                        }, 100);
                    } else {
                        alert('No vehicles found matching your search');
                    }
                })
                .catch(error => {
                    console.error('Vehicle search error:', error);
                    alert('Error searching for vehicles. Please check console for details.');
                });
        });
    }

    // Quick search buttons
    quickSearchBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const searchType = this.getAttribute('data-type');
            const searchValue = this.getAttribute('data-value');
            
            if (this.closest('#track-device')) {
                document.getElementById('searchType').value = searchType;
                document.getElementById('searchValue').value = searchValue;
            } else {
                document.getElementById('vehicleSearchType').value = searchType;
                document.getElementById('vehicleSearchValue').value = searchValue;
            }
        });
    });

    // Track device button
    if (trackDeviceBtn) {
        trackDeviceBtn.addEventListener('click', function() {
            if (deviceMapEl) {
                deviceMapEl.style.display = 'block';
                deviceDetails.classList.add('fade-in');
                setTimeout(() => {
                    if (deviceMap) deviceMap.invalidateSize();
                }, 100);
            }
        });
    }

    // Track vehicle button
    if (trackVehicleBtn) {
        trackVehicleBtn.addEventListener('click', function() {
            if (vehicleMapEl) {
                vehicleMapEl.style.display = 'block';
                vehicleDetails.classList.add('fade-in');
                setTimeout(() => {
                    if (vehicleMap) vehicleMap.invalidateSize();
                }, 100);
            }
        });
    }

    // Notifications button
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function() {
            alert('You have 3 new notifications');
        });
    }

    // Device registration form
    const deviceForm = document.getElementById("registerDeviceForm");
    if (deviceForm) {
        deviceForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const payload = {
                owner_name: this[0].value,
                phone_number: this[1].value,
                serial_number: this[2].value,
                imei: this[3].value,
                mac_address: this[4].value,
                device_type: this[5].value,
            };
            
            try {
                const res = await fetch(`${BASE_API}/api/devices/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
        
                if (res.ok) {
                    alert("✅ Device registered successfully");
                    toggleModal("registerDeviceModal");
                    deviceForm.reset();
                    loadDevices();
                } else {
                    const errorData = await res.json();
                    console.error("❌ Error:", errorData);
                    alert("❌ Error: " + JSON.stringify(errorData, null, 2));
                }
            } catch (err) {
                console.error("❌ Network Error:", err);
                alert("❌ Failed to reach server.");
            }
        });
    }

    // Vehicle registration form
    const vehicleForm = document.getElementById("registerVehicleForm");
    if (vehicleForm) {
        vehicleForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const payload = {
                owner_name: this[0].value,
                phone_number: this[1].value,
                license_plate: this[2].value,
                make_model: this[3].value,
                color: this[4].value,
                year: this[5].value,
                rfid_tag: this[6].value
            };
            
            try {
                const res = await fetch(`${BASE_API}/api/vehicles/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                
                if (res.ok) {
                    alert("✅ Vehicle registered successfully");
                    toggleModal("registerVehicleModal");
                    this.reset();
                    loadVehicles();
                } else {
                    const errorData = await res.json();
                    console.error("❌ Error:", errorData);
                    alert("❌ Error: " + JSON.stringify(errorData, null, 2));
                }
            } catch (error) {
                console.error("❌ Network Error:", error);
                alert("❌ Failed to reach server.");
            }
        });
    }
    
    // Initialize maps and WebSocket connection
    initMainMap();
    initWebSocket();
});

function toggleModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.toggle('hidden');
        modal.classList.toggle('flex');
    }
}

function updateDeviceMarker(id, lat, lng) {
    // Validate coordinates
    if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
        console.error('Invalid coordinates:', lat, lng);
        return;
    }

    // Ensure map exists
    if (!deviceMap) {
        console.warn('Device map not initialized - initializing now');
        initDeviceMap();
        if (!deviceMap) return;
    }

    try {
        if (!deviceMarkers[id]) {
            deviceMarkers[id] = L.marker([lat, lng], {
                icon: L.divIcon({
                    className: 'device-marker',
                    html: `<div class="device-marker-icon">${id}</div>`,
                    iconSize: [30, 30]
                })
            }).addTo(deviceMap)
            .bindPopup(`Device ${id}<br>Last update: ${new Date().toLocaleTimeString()}`);
        } else {
            deviceMarkers[id].setLatLng([lat, lng]);
            deviceMarkers[id].setPopupContent(`Device ${id}<br>Last update: ${new Date().toLocaleTimeString()}`);
        }
        
        deviceMap.setView([lat, lng], 15);
    } catch (error) {
        console.error('Error updating device marker:', error);
    }
}

function updateVehicleMarker(id, lat, lng) {
    // Validate coordinates
    if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
        console.error('Invalid coordinates:', lat, lng);
        return;
    }

    // Ensure map exists
    if (!vehicleMap) {
        console.warn('Vehicle map not initialized - initializing now');
        initVehicleMap();
        if (!vehicleMap) return;
    }

    try {
        if (!vehicleMarkers[id]) {
            vehicleMarkers[id] = L.marker([lat, lng], {
                icon: L.divIcon({
                    className: 'vehicle-marker',
                    html: `<div class="vehicle-marker-icon">${id}</div>`,
                    iconSize: [30, 30]
                })
            }).addTo(vehicleMap)
            .bindPopup(`Vehicle ${id}<br>Last update: ${new Date().toLocaleTimeString()}`);
        } else {
            vehicleMarkers[id].setLatLng([lat, lng]);
            vehicleMarkers[id].setPopupContent(`Vehicle ${id}<br>Last update: ${new Date().toLocaleTimeString()}`);
        }
        
        vehicleMap.setView([lat, lng], 15);
    } catch (error) {
        console.error('Error updating vehicle marker:', error);
    }
}

async function loadDevices() {
    const BASE_API = 'http://127.0.0.1:8000';
    try {
        const response = await fetch(`${BASE_API}/api/devices/`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const devices = await response.json();
        const deviceList = document.getElementById('deviceList');
        
        if (!deviceList) return;
        deviceList.innerHTML = '';
        
        devices.forEach(device => {
            const card = document.createElement('div');
            card.className = 'bg-white p-4 rounded-lg shadow-md mb-4';
            card.innerHTML = `
                <h4 class="font-bold text-lg text-gray-800">${device.device_type}</h4>
                <p class="text-gray-600 text-sm">Owner: ${device.owner_name}</p>
                <p class="text-gray-600 text-sm">Phone: ${device.phone_number}</p>
                <p class="text-gray-600 text-sm">IMEI: ${device.imei}</p>
                <p class="text-gray-600 text-sm">Location: ${device.last_latitude}, ${device.last_longitude}</p>
                <button class="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 track-device-btn" 
                        data-id="${device.id}">Track</button>
            `;
            deviceList.appendChild(card);
        });
        
        // Add event listeners to track buttons
        document.querySelectorAll('.track-device-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const deviceId = this.getAttribute('data-id');
                const device = devices.find(d => d.id == deviceId);
                if (device) {
                    updateDeviceMarker(device.id, device.last_latitude, device.last_longitude);
                    document.querySelector('[data-page="track-device"]').click();
                }
            });
        });
    } catch (error) {
        console.error('Error loading devices:', error);
        alert('Failed to load devices');
    }
}

async function loadVehicles() {
    const BASE_API = 'http://127.0.0.1:8000';
    try {
        const response = await fetch(`${BASE_API}/api/vehicles/`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const vehicles = await response.json();
        const vehicleList = document.getElementById('vehicleList');
        
        if (!vehicleList) return;
        vehicleList.innerHTML = '';
        
        vehicles.forEach(vehicle => {
            const card = document.createElement('div');
            card.className = 'bg-white p-4 rounded-lg shadow-md mb-4';
            card.innerHTML = `
                <h4 class="font-bold text-lg text-gray-800">${vehicle.make_model}</h4>
                <p class="text-gray-600 text-sm">Plate: ${vehicle.license_plate}</p>
                <p class="text-gray-600 text-sm">Owner: ${vehicle.owner_name}</p>
                <p class="text-gray-600 text-sm">Color: ${vehicle.color}</p>
                <p class="text-gray-600 text-sm">Location: ${vehicle.last_latitude}, ${vehicle.last_longitude}</p>
                <button class="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 track-vehicle-btn" 
                        data-id="${vehicle.id}">Track</button>
            `;
            vehicleList.appendChild(card);
        });
        
        // Add event listeners to track buttons
        document.querySelectorAll('.track-vehicle-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const vehicleId = this.getAttribute('data-id');
                const vehicle = vehicles.find(v => v.id == vehicleId);
                if (vehicle) {
                    updateVehicleMarker(vehicle.id, vehicle.last_latitude, vehicle.last_longitude);
                    document.querySelector('[data-page="track-vehicle"]').click();
                }
            });
        });
    } catch (error) {
        console.error('Error loading vehicles:', error);
        alert('Failed to load vehicles');
    }
}