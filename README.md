# 🌐 IoT Hub Control Dashboard

<div align="center">

![IoT Hub Control](https://img.shields.io/badge/IoT-Hub%20Control-blue?style=for-the-badge&logo=react)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)

**A modern real-time IoT dashboard for monitoring sensors and controlling devices via MQTT**

[Features](#-features) • [Quick Start](#-quick-start) • [MQTT Setup](#-mqtt-setup) • [Demo](#-demo)

---

</div>

## ✨ Features

### 🌡️ **Smart Environmental Monitoring**
- 📊 **Real-time temperature & humidity tracking**
- 📈 **Interactive charts with historical data**
- 🎯 **Smart level indicators** (Cold, Cool, Normal, Warm, Hot)
- 📱 **24-hour trends and averages**

### 💡 **Intelligent Device Control**
- 🔄 **Real-time LED on/off control**
- 🎚️ **Smooth brightness adjustment (0-100%)**
- ⚡ **Instant status feedback**
- 🕒 **Last activity timestamps**

### 🚀 **Advanced MQTT Integration**
- 🔗 **WebSocket-based real-time communication**
- 🛡️ **Secure connection support (WSS)**
- 🔄 **Auto-reconnection with error handling**
- ⚙️ **Configurable QoS levels**

### 🎛️ **Flexible Topic Configuration**
- 📝 **Customizable MQTT topic structure**
- 💾 **Persistent settings with local storage**
- 🔧 **Easy setup for different IoT devices**
- 🎯 **Organized topic hierarchy**

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- An MQTT broker (HiveMQ, Mosquitto, etc.)
- IoT devices publishing sensor data

### Installation

```bash
# Clone the repository
git clone https://github.com/haadziqf/iot-hub-control-dashboard.git
cd iot-hub-control-dashboard

# Install dependencies
npm install

# (Optional) Configure custom login credentials
cp .env.example .env
# Edit .env with your preferred username/password

# Start development server
npm run dev
```

### First Steps
1. 🌐 Open http://localhost:5173
2. 👤 Login with default credentials (admin/iot2024) or your custom ones
3. ⚙️ Configure your MQTT broker in Settings  
4. 📊 Start monitoring your IoT devices!

### 🔐 Security Configuration

### Login Credentials
The dashboard uses configurable login credentials:

**Default**: `admin` / `iot2024`

**Custom Setup**:
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your preferences
VITE_LOGIN_USERNAME=yourusername  
VITE_LOGIN_PASSWORD=yourpassword
```

### MQTT Configuration  
You can pre-configure MQTT broker settings:

```bash
# MQTT Broker defaults in .env
VITE_MQTT_PROTOCOL=wss://
VITE_MQTT_HOST=your-broker.com
VITE_MQTT_PORT=8081  
VITE_MQTT_PATH=/mqtt
VITE_MQTT_USERNAME=your_username
VITE_MQTT_PASSWORD=your_password
```

> ⚠️ **Security Note**: For production deployment, always change default credentials and use strong passwords. Never commit `.env` files to version control.

## 📡 MQTT Setup

### Broker Configuration
| Field | Description | Example |
|-------|-------------|---------|
| Protocol | Connection type | `wss://` (secure) or `ws://` |
| Host | Broker hostname | `broker.hivemq.com` |
| Port | WebSocket port | `8084` (WSS) or `8083` (WS) |
| Path | WebSocket path | `/mqtt` |
| Username | Your credentials | (leave empty for public brokers) |
| Password | Your credentials | (leave empty for public brokers) |

### 📋 Topic Structure

#### 🌡️ Sensor Topics
```bash
haadziq/suhu          # Temperature (°C)
haadziq/kelembapan    # Humidity (%)
haadziq/sensor_data   # Complete JSON data
```

#### 💡 LED Control Topics
```bash
haadziq/led1/command  # Send commands
haadziq/led1/status   # Receive status updates
```

## 📨 Message Formats

### Temperature & Humidity
```json
// Individual values
Topic: "haadziq/suhu"
Payload: "25.4"

// Complete data
Topic: "haadziq/sensor_data" 
Payload: {
  "temperature": 25.4,
  "humidity": 65.2,
  "timestamp": "2025-11-15T10:30:00Z"
}
```

### LED Control
```json
// Boolean format (default)
Topic: "haadziq/led1/command"
Payload: "true"    // Turn ON
Payload: "false"   // Turn OFF

// Numeric format
Topic: "haadziq/led1/command"
Payload: "1"       // Turn ON
Payload: "0"       // Turn OFF

// Alternative formats (also supported)
Payload: "on"/"off"

// JSON format (backward compatibility)
Topic: "haadziq/led1/command"
Payload: {"status": true}
```

## 🛠️ Technology Stack

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with dark theme
- **MQTT**: MQTT.js with WebSocket support  
- **Charts**: Recharts for data visualization
- **Build**: Vite for fast development

## 📁 Project Structure

```
📦 iot-hub-control/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 🏠 Dashboard.tsx
│   │   ├── ⚙️ Settings.tsx
│   │   ├── 🔌 ConnectionCard.tsx
│   │   ├── 📝 TopicSettingsCard.tsx
│   │   ├── 📊 Chart.tsx
│   │   └── 💡 LEDControlCard.tsx
│   ├── 🔧 types.ts
│   ├── 📱 App.tsx
│   └── 🚀 main.tsx
├── 📋 package.json
└── ⚡ vite.config.ts
```

## 🤝 Contributing

We love contributions! Here's how to get started:

1. 🍴 **Fork** the repository
2. 🌿 **Create** your feature branch: `git checkout -b feature/amazing-feature`
3. 💾 **Commit** your changes: `git commit -m 'Add amazing feature'`
4. 📤 **Push** to the branch: `git push origin feature/amazing-feature`
5. 🔄 **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Show Your Support

If this project helped you, please give it a ⭐ star!

---

<div align="center">

**Built with ❤️ for the IoT community**

[Report Bug](https://github.com/yourusername/iot-hub-control/issues) • [Request Feature](https://github.com/yourusername/iot-hub-control/issues) • [Discussions](https://github.com/yourusername/iot-hub-control/discussions)

</div>