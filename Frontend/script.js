document.addEventListener('DOMContentLoaded', function () {
    const BASE_API = 'http://127.0.0.1:8000';
  
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
  
    let mainMap, deviceMap, vehicleMap;
    let deviceMarker, vehicleMarker;
  
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/location/');
    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      const { id, type, latitude, longitude } = data;
      if (type === 'device') updateDeviceMarker(id, latitude, longitude);
      else if (type === 'vehicle') updateVehicleMarker(id, latitude, longitude);
    };
  
    if (mainMapEl) {
      mainMap = L.map('map').setView([-1.2921, 36.8219], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mainMap);
      L.marker([-1.2921, 36.8219]).addTo(mainMap).bindPopup('Security Office').openPopup();
      L.marker([-1.2915, 36.8205]).addTo(mainMap).bindPopup('Library').openPopup();
      L.marker([-1.2930, 36.8225]).addTo(mainMap).bindPopup('Dormitory A');
    }
  
    mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const pageId = this.getAttribute('data-page');
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        mobileMenu.classList.add('hidden');
  
        if (pageId === 'track-device' && !deviceMap) {
          deviceMapEl.style.display = 'block';
          deviceMap = L.map('deviceMap').setView([-1.2921, 36.8219], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(deviceMap);
        }
        if (pageId === 'track-vehicle' && !vehicleMap) {
          vehicleMapEl.style.display = 'block';
          vehicleMap = L.map('vehicleMap').setView([-1.2921, 36.8219], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(vehicleMap);
        }
  
        if (pageId === 'dashboard') {
          loadDevices();
          loadVehicles();
        }
      });
    });
  
    if (deviceSearchForm) {
      deviceSearchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const searchType = document.getElementById('searchType').value;
        const searchValue = document.getElementById('searchValue').value;
        fetch(`${BASE_API}/api/devices/search/?type=${searchType}&value=${searchValue}`)
          .then(res => res.json())
          .then(data => {
            const device = data[0];
            updateDeviceMarker(device.id, device.last_latitude, device.last_longitude);
            deviceMapEl.style.display = 'block';
            deviceDetails.classList.remove('hidden');
          });
      });
    }
  
    if (vehicleSearchForm) {
      vehicleSearchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const searchType = document.getElementById('vehicleSearchType').value;
        const searchValue = document.getElementById('vehicleSearchValue').value;
        fetch(`${BASE_API}/api/vehicles/search/?type=${searchType}&value=${searchValue}`)
          .then(res => res.json())
          .then(data => {
            const vehicle = data[0];
            updateVehicleMarker(vehicle.id, vehicle.last_latitude, vehicle.last_longitude);
            vehicleMapEl.style.display = 'block';
            vehicleDetails.classList.remove('hidden');
          });
      });
    }
  
    quickSearchBtns.forEach(btn => {
      btn.addEventListener('click', function () {
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
  
    if (trackDeviceBtn) {
      trackDeviceBtn.addEventListener('click', function () {
        deviceMapEl.style.display = 'block';
        deviceDetails.classList.add('fade-in');
      });
    }
  
    if (trackVehicleBtn) {
      trackVehicleBtn.addEventListener('click', function () {
        vehicleMapEl.style.display = 'block';
        vehicleDetails.classList.add('fade-in');
      });
    }
  
    if (notificationsBtn) {
      notificationsBtn.addEventListener('click', function () {
        alert('You have 3 new notifications');
      });
    }
  
    const deviceForm = document.getElementById("registerDeviceForm");
    if (deviceForm) {
      deviceForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const payload = {
          owner_name: this[0].value,
          phone_number: this[1].value,
          serial_number: this[2].value,
          imei: this[3].value,
          mac_address: this[4].value,
          device_type: this[5].value,
        };
        fetch(`${BASE_API}/api/devices/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).then(res => {
          if (res.ok) {
            alert("Device registered successfully");
            toggleModal("registerDeviceModal");
            this.reset();
          } else {
            alert("Device registration failed");
          }
        });
      });
    }
  
    const vehicleForm = document.getElementById("registerVehicleForm");
    if (vehicleForm) {
      vehicleForm.addEventListener("submit", function (e) {
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
        fetch(`${BASE_API}/api/vehicles/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).then(res => {
          if (res.ok) {
            alert("Vehicle registered successfully");
            toggleModal("registerVehicleModal");
            this.reset();
          } else {
            alert("Vehicle registration failed");
          }
        });
      });
    }
  });
  
  function toggleModal(id) {
    const modal = document.getElementById(id);
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
  }
  
  function updateDeviceMarker(id, lat, lng) {
    if (!deviceMap) return;
    if (deviceMarker) {
      deviceMarker.setLatLng([lat, lng]);
    } else {
      deviceMarker = L.marker([lat, lng]).addTo(deviceMap);
    }
  }
  
  function updateVehicleMarker(id, lat, lng) {
    if (!vehicleMap) return;
    if (vehicleMarker) {
      vehicleMarker.setLatLng([lat, lng]);
    } else {
      vehicleMarker = L.marker([lat, lng]).addTo(vehicleMap);
    }
  }
  
  function loadDevices() {
    const BASE_API = 'http://127.0.0.1:8000';
    fetch(`${BASE_API}/api/devices/`)
      .then(res => res.json())
      .then(devices => {
        const deviceList = document.getElementById('deviceList');
        if (!deviceList) return;
        deviceList.innerHTML = '';
        devices.forEach(device => {
          const card = document.createElement('div');
          card.className = 'bg-white p-4 rounded-lg shadow-md';
          card.innerHTML = `
            <h4 class="font-bold text-lg text-gray-800">${device.device_type}</h4>
            <p class="text-gray-600 text-sm">Owner: ${device.owner_name}</p>
            <p class="text-gray-600 text-sm">Phone: ${device.phone_number}</p>
            <p class="text-gray-600 text-sm">IMEI: ${device.imei}</p>
            <p class="text-gray-600 text-sm">Location: ${device.last_latitude}, ${device.last_longitude}</p>
          `;
          deviceList.appendChild(card);
        });
      });
  }
  
  function loadVehicles() {
    const BASE_API = 'http://127.0.0.1:8000';
    fetch(`${BASE_API}/api/vehicles/`)
      .then(res => res.json())
      .then(vehicles => {
        const vehicleList = document.getElementById('vehicleList');
        if (!vehicleList) return;
        vehicleList.innerHTML = '';
        vehicles.forEach(vehicle => {
          const card = document.createElement('div');
          card.className = 'bg-white p-4 rounded-lg shadow-md';
          card.innerHTML = `
            <h4 class="font-bold text-lg text-gray-800">${vehicle.make_model}</h4>
            <p class="text-gray-600 text-sm">Plate: ${vehicle.license_plate}</p>
            <p class="text-gray-600 text-sm">Owner: ${vehicle.owner_name}</p>
            <p class="text-gray-600 text-sm">Color: ${vehicle.color}</p>
            <p class="text-gray-600 text-sm">Location: ${vehicle.last_latitude}, ${vehicle.last_longitude}</p>
          `;
          vehicleList.appendChild(card);
        });
      });
  }
  