    document.addEventListener('DOMContentLoaded', function() {
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

        // Initialize maps
        let mainMap, deviceMap, vehicleMap;
        
        // Initialize main map
        if (mainMapEl) {
            mainMap = L.map('map').setView([-1.2921, 36.8219], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mainMap);
            
            // Add sample markers
            L.marker([-1.2921, 36.8219]).addTo(mainMap)
                .bindPopup('Security Office')
                .openPopup();
            
            L.marker([-1.2915, 36.8205]).addTo(mainMap)
                .bindPopup('Library')
                .openPopup();
            
            L.marker([-1.2930, 36.8225]).addTo(mainMap)
                .bindPopup('Dormitory A');
        }

        // Mobile menu toggle
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });

        // Navigation between pages
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                
                // Hide all pages
                pages.forEach(page => {
                    page.classList.remove('active');
                });
                
                // Show selected page
                document.getElementById(pageId).classList.add('active');
                
                // Close mobile menu if open
                mobileMenu.classList.add('hidden');
                
                // Initialize map for the page if needed
                if (pageId === 'track-device' && !deviceMap) {
                    deviceMapEl.style.display = 'block';
                    deviceMap = L.map('deviceMap').setView([-1.2921, 36.8219], 15);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(deviceMap);
                }
                
                if (pageId === 'track-vehicle' && !vehicleMap) {
                    vehicleMapEl.style.display = 'block';
                    vehicleMap = L.map('vehicleMap').setView([-1.2921, 36.8219], 15);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(vehicleMap);
                }
            });
        });

        // Device search form
        if (deviceSearchForm) {
            deviceSearchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const searchType = document.getElementById('searchType').value;
                const searchValue = document.getElementById('searchValue').value;
                
                // Simulate search
                simulateDeviceSearch(searchType, searchValue);
            });
        }

        // Vehicle search form
        if (vehicleSearchForm) {
            vehicleSearchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const searchType = document.getElementById('vehicleSearchType').value;
                const searchValue = document.getElementById('vehicleSearchValue').value;
                
                // Simulate search
                simulateVehicleSearch(searchType, searchValue);
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
                    simulateDeviceSearch(searchType, searchValue);
                } else {
                    document.getElementById('vehicleSearchType').value = searchType;
                    document.getElementById('vehicleSearchValue').value = searchValue;
                    simulateVehicleSearch(searchType, searchValue);
                }
            });
        });

        // Track device button
        if (trackDeviceBtn) {
            trackDeviceBtn.addEventListener('click', function() {
                deviceMapEl.style.display = 'block';
                deviceDetails.classList.add('fade-in');
                
                if (deviceMap) {
                    deviceMap.setView([-1.2921, 36.8219], 18);
                    L.marker([-1.2921, 36.8219]).addTo(deviceMap)
                        .bindPopup('iPhone 12 Pro<br>Library, Floor 2')
                        .openPopup();
                }
            });
        }

        // Track vehicle button
        if (trackVehicleBtn) {
            trackVehicleBtn.addEventListener('click', function() {
                vehicleMapEl.style.display = 'block';
                vehicleDetails.classList.add('fade-in');
                
                if (vehicleMap) {
                    vehicleMap.setView([-1.2915, 36.8205], 18);
                    L.marker([-1.2915, 36.8205]).addTo(vehicleMap)
                        .bindPopup('Toyota RAV4<br>Faculty Parking Lot')
                        .openPopup();
                }
            });
        }

        // Simulate device search
        function simulateDeviceSearch(type, value) {
            // Show loading state
            deviceSearchResults.innerHTML = `
                <div class="text-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h4 class="text-xl font-semibold text-gray-800 mb-2">Searching for device...</h4>
                    <p class="text-gray-600 max-w-md mx-auto">Searching by ${type} for "${value}"</p>
                </div>
            `;
            
            // Simulate API delay
            setTimeout(() => {
                deviceSearchResults.style.display = 'none';
                deviceDetails.classList.remove('hidden');
                deviceDetails.classList.add('fade-in');
                
                // Scroll to details
                deviceDetails.scrollIntoView({ behavior: 'smooth' });
            }, 1500);
        }

        // Simulate vehicle search
        function simulateVehicleSearch(type, value) {
            // Show loading state
            vehicleSearchResults.innerHTML = `
                <div class="text-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <h4 class="text-xl font-semibold text-gray-800 mb-2">Searching for vehicle...</h4>
                    <p class="text-gray-600 max-w-md mx-auto">Searching by ${type} for "${value}"</p>
                </div>
            `;
            
            // Simulate API delay
            setTimeout(() => {
                vehicleSearchResults.style.display = 'none';
                vehicleDetails.classList.remove('hidden');
                vehicleDetails.classList.add('fade-in');
                
                // Scroll to details
                vehicleDetails.scrollIntoView({ behavior: 'smooth' });
            }, 1500);
        }

        // Notifications button
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', function() {
                alert('You have 3 new notifications');
            });
        }
    });
    function toggleModal(id) {
    const modal = document.getElementById(id);
    if (modal.classList.contains('hidden')) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    } else {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }
