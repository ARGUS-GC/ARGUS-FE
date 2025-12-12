# ARCUS-FE
Frontend
<div align="center">

# 🖥️ ARGUS-FE: The Visual Cortex

### Interactive Monitoring Dashboard for ARGUS System

**"Visualize Hazards, Control Robots, Ensure Safety"**

[![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=for-the-badge&logo=react&logoColor=black)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)]()
[![MQTT](https://img.shields.io/badge/MQTT-Client-660066?style=for-the-badge&logo=mqtt&logoColor=white)]()

<br>

<p align="center">
  <b>ARGUS-FE</b> is a React-based single page application (SPA) that provides real-time situational awareness.<br>
  Operators can monitor CCTV feeds, check thermal status, and remotely control guard robots.
</p>

<br>

</div>

---

## 🏗️ UI Component Architecture

The dashboard is structured into modular components for efficient data rendering.

```mermaid
graph TD
    %% Style Definitions
    classDef page fill:#2E8B57,stroke:#333,stroke-width:0px,color:white;
    classDef container fill:#4682B4,stroke:#333,stroke-width:0px,color:white;
    classDef component fill:#20B2AA,stroke:#333,stroke-width:0px,color:white;
    classDef api fill:#FFA500,stroke:#333,stroke-width:0px,color:white;

    %% Main Page
    App["📱 App.js (Main Layout)"]
    
    %% Containers
    subgraph Video_Section ["🎥 Video Monitoring"]
        CCTV["FixedCCTVCard\n(Live MJPEG Stream)"]
    end

    subgraph Robot_Section ["🤖 Robot Control"]
        Status["RobotStatusPanel\n(Battery/Loc)"]
        Command["RobotCommandPanel\n(MQTT Action)"]
    end
    
    subgraph Data_Section ["📊 Data & Logs"]
        Thermal["ThermalDetectionPanel\n(Temp Graph)"]
        Logs["IncidentPhotoArchive\n(Hazard History)"]
    end

    %% Data Flow
    API[("Backend API\n(Axios)")]
    MQTT[("MQTT Broker\n(Paho-MQTT)")]

    App --> CCTV
    App --> Status
    App --> Command
    App --> Thermal
    App --> Logs

    %% Connections
    CCTV <--> API
    Logs <--> API
    Command -.-> MQTT
    Status <--> API

    %% Styles
    class App page;
    class Video_Section,Robot_Section,Data_Section container;
    class CCTV,Status,Command,Thermal,Logs component;
    class API,MQTT api;