# SENTINEL NDR Lab Setup

## Network Topology

- Internet source: 5G phone tethered to Windows host.
- Windows host shares internet via Mobile Hotspot.
- Hotspot SSID: SENTINEL-LAB.
- Hotspot subnet: 192.168.137.0/24.
- Windows host hotspot IP: 192.168.137.1.

## VM Configuration

- Use VirtualBox or VMware.
- Set VM Network Adapter to Bridged.
- Bridge to Microsoft Wi-Fi Direct Virtual Adapter (hotspot-facing).
- VMs should receive DHCP addresses in 192.168.137.x.

## Sensor Placement

- Run Scapy sensor on Windows host only.
- Capture adapter typically appears as Wi-Fi 2 or Local Area Connection* X.
- Discover exact adapter name with:

```powershell
Get-NetAdapter
```

## Service Endpoints

- Backend: http://192.168.137.1:5000
- Frontend: http://192.168.137.1:3000

Any device connected to the hotspot can open the frontend URL.

## Phase Flow

1. Phase 1: Frontend mock-data prototype.
2. Phase 2: Backend API + sensor ingest.
3. Phase 3: HDT model training and live scoring.
4. Phase 4: Controlled attack evaluation.
5. Phase 5: Dissertation write-up and demonstration evidence.
