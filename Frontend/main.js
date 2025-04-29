function loadDevices() {
    fetch('/api/devices/')
      .then(res => res.json())
      .then(devices => {
        const deviceList = document.getElementById('deviceList');
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
      })
      .catch(err => console.error('Error loading devices:', err));
  }
  
  function loadVehicles() {
    fetch('/api/vehicles/')
      .then(res => res.json())
      .then(vehicles => {
        const vehicleList = document.getElementById('vehicleList');
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
      })
      .catch(err => console.error('Error loading vehicles:', err));
  }
  