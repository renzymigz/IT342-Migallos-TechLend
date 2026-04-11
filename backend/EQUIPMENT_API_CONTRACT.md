# Equipment API Contract (Updated)

This document reflects the currently implemented backend endpoints for equipment models and physical equipment items.

Base path: `/api/v1`
Format: JSON unless otherwise specified
Authentication: Bearer token required for all endpoints below

## Enums

### EquipmentCategory
- `MICROCONTROLLERS`
- `COMPUTERS_AND_LAPTOPS`
- `PERIPHERALS`
- `NETWORKING`
- `SENSORS_AND_MODULES`
- `CABLES_AND_ADAPTERS`
- `ROBOTICS`
- `AR_VR`
- `AUDIO_VISUAL`
- `TOOLS_AND_TESTING`
- `STORAGE_DEVICES`
- `OTHERS`

### EquipmentItemStatus
- `AVAILABLE`
- `RESERVED`
- `BORROWED`
- `MAINTENANCE`
- `LOST`

## 1) Get Equipment Catalog (Browsing Models)

- URL: `/equipment-models`
- Method: `GET`
- Access: Any authenticated user

### Response
```json
{
  "success": true,
  "data": [
    {
      "modelId": "<uuid>",
      "category": "COMPUTERS_AND_LAPTOPS",
      "name": "Asus Zephyrus G14",
      "description": "16GB RAM, RTX 3060",
      "imageUrl": "https://server.com/images/asus.jpg",
      "availableCount": 3,
      "physicalItems": null
    }
  ],
  "error": null,
  "timestamp": "2026-02-28T10:30:00Z"
}
```

## 2) Admin List Equipment Models (with Physical Items)

- URL: `/admin/equipment-models`
- Method: `GET`
- Access: `ADMIN` only

### Response
```json
{
  "success": true,
  "data": [
    {
      "modelId": "<uuid>",
      "category": "MICROCONTROLLERS",
      "name": "Arduino Uno R3",
      "description": "ATmega328P board",
      "imageUrl": "/uploads/equipment-models/<uuid>/arduino.jpg",
      "availableCount": 2,
      "physicalItems": [
        {
          "equipmentId": "<uuid>",
          "modelId": "<uuid>",
          "propertyTag": "CIT-ARD-001",
          "status": "AVAILABLE",
          "borrowerName": null
        }
      ]
    }
  ],
  "error": null,
  "timestamp": "2026-02-28T10:30:00Z"
}
```

## 3) Create Equipment Model

- URL: `/admin/equipment-models`
- Method: `POST`
- Access: `ADMIN` only

### Request
```json
{
  "category": "COMPUTERS_AND_LAPTOPS",
  "name": "Asus Zephyrus G14",
  "description": "16GB RAM, RTX 3060, 512GB SSD"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "modelId": "<uuid>",
    "category": "COMPUTERS_AND_LAPTOPS",
    "name": "Asus Zephyrus G14",
    "description": "16GB RAM, RTX 3060, 512GB SSD",
    "imageUrl": null,
    "availableCount": 0,
    "physicalItems": []
  },
  "error": null,
  "timestamp": "2026-02-28T10:30:00Z"
}
```

## 4) Upload Catalog Image

- URL: `/admin/equipment-models/{modelId}/upload-image`
- Method: `POST`
- Content-Type: `multipart/form-data`
- Access: `ADMIN` only

### Request
- `file`: binary image file

### Response
```json
{
  "success": true,
  "data": {
    "image_url": "/uploads/equipment-models/<modelId>/image_name.jpg"
  },
  "error": null,
  "timestamp": "2026-02-28T10:30:00Z"
}
```

## 5) Register Physical Equipment Items

- URL: `/admin/equipment-models/{modelId}/items`
- Method: `POST`
- Access: `ADMIN` only

### Request
```json
{
  "items": [
    { "propertyTag": "CIT-LAP-001" },
    { "propertyTag": "CIT-LAP-002" }
  ]
}
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "equipmentId": "<uuid>",
      "modelId": "<uuid>",
      "propertyTag": "CIT-LAP-001",
      "status": "AVAILABLE",
      "borrowerName": null
    }
  ],
  "error": null,
  "timestamp": "2026-02-28T10:30:00Z"
}
```

## 6) Update Physical Item Status

- URL: `/admin/equipment-models/items/{equipmentId}/status`
- Method: `PATCH`
- Access: `ADMIN` only

### Request
```json
{
  "status": "MAINTENANCE"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "equipmentId": "<uuid>",
    "modelId": "<uuid>",
    "propertyTag": "CIT-LAP-001",
    "status": "MAINTENANCE",
    "borrowerName": null
  },
  "error": null,
  "timestamp": "2026-02-28T10:30:00Z"
}
```
