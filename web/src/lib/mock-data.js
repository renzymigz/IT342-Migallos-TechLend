export const categories = [
  "All Categories",
  "Microcontrollers",
  "Networking",
  "Sensors & Modules",
  "Computing",
  "Peripherals",
  "Cables & Adapters",
]

export const mockEquipment = [
  {
    id: "1",
    propertyTag: "ARD-001",
    name: "Arduino Mega 2560",
    category: "Microcontrollers",
    status: "available",
    description:
      "The Arduino Mega 2560 is a microcontroller board based on the ATmega2560. It has 54 digital I/O pins, 16 analog inputs, 4 UARTs, and a 16 MHz crystal oscillator.",
    specs: [
      "Processor: ATmega2560 @ 16 MHz",
      "Flash Memory: 256 KB",
      "SRAM: 8 KB",
      "Digital I/O Pins: 54",
      "Analog Input Pins: 16",
      "Operating Voltage: 5V",
    ],
  },
  {
    id: "2",
    propertyTag: "ARD-002",
    name: "Arduino Uno R3",
    category: "Microcontrollers",
    status: "available",
    description:
      "The Arduino Uno R3 is the most popular and widely used Arduino board, perfect for beginners and experienced makers alike.",
    specs: [
      "Processor: ATmega328P @ 16 MHz",
      "Flash Memory: 32 KB",
      "Digital I/O Pins: 14",
      "Analog Input Pins: 6",
    ],
  },
  {
    id: "3",
    propertyTag: "RPI-001",
    name: "Raspberry Pi 4 Model B",
    category: "Computing",
    status: "borrowed",
    description:
      "Powerful single-board computer with a quad-core ARM Cortex-A72 processor. Supports dual 4K displays, USB 3.0, and wireless networking.",
    specs: [
      "Processor: Broadcom BCM2711, Cortex-A72 @ 1.5GHz",
      "RAM: 4 GB LPDDR4",
      "Connectivity: Dual-band Wi-Fi, Bluetooth 5.0",
      "Ports: 2x USB 3.0, 2x USB 2.0, 2x micro-HDMI",
    ],
    currentBorrower: "Ana Santos",
  },
  {
    id: "4",
    propertyTag: "RPI-002",
    name: "Raspberry Pi 5",
    category: "Computing",
    status: "available",
    description:
      "Latest generation single-board computer with the BCM2712 processor, PCIe 2.0, and significantly improved performance.",
    specs: [
      "Processor: Broadcom BCM2712, Cortex-A76 @ 2.4GHz",
      "RAM: 8 GB LPDDR4X",
      "Ports: 2x USB 3.0, 2x USB 2.0, 2x micro-HDMI",
    ],
  },
  {
    id: "5",
    propertyTag: "NET-001",
    name: "Cisco Catalyst 2960",
    category: "Networking",
    status: "available",
    description:
      "Enterprise-class fixed-configuration Fast Ethernet and Gigabit Ethernet switch for branch-office and lab environments.",
    specs: [
      "Ports: 24x 10/100 Fast Ethernet + 2x GbE Uplink",
      "Switching Capacity: 16 Gbps",
      "VLAN Support: 255 VLANs",
    ],
  },
  {
    id: "6",
    propertyTag: "NET-002",
    name: "TP-Link Managed Switch",
    category: "Networking",
    status: "reserved",
    description:
      "Managed Gigabit Ethernet switch with VLAN support, QoS, and web-based management for teaching network administration.",
    specs: [
      "Ports: 16x 10/100/1000 Gigabit Ethernet",
      "Switching Capacity: 32 Gbps",
      "QoS: L2/L3/L4 Traffic Classification",
    ],
  },
  {
    id: "7",
    propertyTag: "SEN-001",
    name: "DHT22 Temperature Sensor",
    category: "Sensors & Modules",
    status: "available",
    description:
      "Digital temperature and humidity sensor with high accuracy and wide measurement range.",
    specs: [
      "Temperature Range: -40 to 80°C (±0.5°C)",
      "Humidity Range: 0-100% RH (±2%)",
      "Operating Voltage: 3.3-5V DC",
    ],
  },
  {
    id: "8",
    propertyTag: "SEN-002",
    name: "Ultrasonic Sensor HC-SR04",
    category: "Sensors & Modules",
    status: "available",
    description:
      "Ultrasonic distance sensor using sonar for non-contact range detection, widely used in robotics and automation.",
    specs: [
      "Measuring Range: 2 cm - 400 cm",
      "Accuracy: ±3mm",
      "Operating Voltage: 5V DC",
    ],
  },
  {
    id: "9",
    propertyTag: "PER-001",
    name: 'Dell 24" Monitor',
    category: "Peripherals",
    status: "borrowed",
    description:
      "24-inch Full HD IPS display with anti-glare coating and adjustable tilt stand, suitable for general lab use.",
    specs: [
      'Panel: 24" IPS, Anti-Glare',
      "Resolution: 1920 x 1080 (Full HD)",
      "Ports: HDMI, VGA, DisplayPort",
    ],
    currentBorrower: "Ana Santos",
  },
  {
    id: "10",
    propertyTag: "PER-002",
    name: "Logitech Webcam C920",
    category: "Peripherals",
    status: "available",
    description:
      "HD Pro Webcam delivering crisp Full HD 1080p video with dual stereo mics and autofocus.",
    specs: [
      "Video: 1080p / 30fps",
      "Lens: Full HD glass",
      "Microphone: Dual stereo",
    ],
  },
  {
    id: "11",
    propertyTag: "CAB-001",
    name: "HDMI Cable 2m",
    category: "Cables & Adapters",
    status: "available",
    description:
      "High-speed HDMI 2.0 cable, 2 meters long. Supports 4K video at 60Hz.",
    specs: [
      "Standard: HDMI 2.0",
      "Length: 2 meters",
      "Max Resolution: 4K @ 60Hz",
    ],
  },
  {
    id: "12",
    propertyTag: "MCU-001",
    name: "ESP32 DevKit",
    category: "Microcontrollers",
    status: "maintenance",
    description:
      "Development board based on the Espressif ESP32 with integrated Wi-Fi and Bluetooth for IoT applications.",
    specs: [
      "Processor: Xtensa Dual-Core LX6 @ 240 MHz",
      "RAM: 520 KB SRAM",
      "Connectivity: Wi-Fi 802.11 b/g/n, Bluetooth 4.2 + BLE",
    ],
  },
]

export const mockTransactions = [
  {
    id: "t1",
    borrowerId: "u1",
    borrowerName: "Carlos Mendoza",
    date: "2026-02-20",
    dueDate: "2026-03-06",
    status: "active",
    items: [
      {
        equipmentId: "1",
        equipmentName: "Arduino Mega 2560",
        propertyTag: "ARD-001",
        returned: false,
        itemStatus: "borrowed",
      },
    ],
    borrowerNote: "For IoT capstone project",
    staffRemarks: "",
  },
  {
    id: "t2",
    borrowerId: "u1",
    borrowerName: "Carlos Mendoza",
    date: "2026-01-10",
    dueDate: "2026-01-24",
    status: "completed",
    items: [
      {
        equipmentId: "7",
        equipmentName: "DHT22 Temperature Sensor",
        propertyTag: "SEN-001",
        returned: true,
        condition: "good",
        itemStatus: "returned",
      },
    ],
    borrowerNote: "Sensor testing for thesis prototype",
    staffRemarks: "Returned in good condition",
  },
  {
    id: "t3",
    borrowerId: "u1",
    borrowerName: "Carlos Mendoza",
    date: "2026-03-01",
    dueDate: "2026-03-15",
    status: "pending",
    items: [
      {
        equipmentId: "4",
        equipmentName: "Raspberry Pi 5",
        propertyTag: "RPI-002",
        returned: false,
        itemStatus: "borrowed",
      },
      {
        equipmentId: "11",
        equipmentName: "HDMI Cable 2m",
        propertyTag: "CAB-001",
        returned: false,
        itemStatus: "borrowed",
      },
    ],
    borrowerNote: "Edge computing demo for thesis defense",
    staffRemarks: "",
  },
]
