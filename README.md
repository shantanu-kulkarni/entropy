# Entropy Explorer

A desktop application for exploring the Entropy testnet blockchain. Built with Tauri, React, and TypeScript.

## Features

- **Real-time Blockchain Data**: Connect to the Entropy testnet and view live block data
- **Block Search**: Search for specific blocks by number, hash, or address
- **Network Analytics**: View network statistics, transaction volumes, and block production
- **Theme Toggle**: Switch between monochrome and colored themes
- **Favorites**: Save and manage your favorite blocks
- **Chain Surfing**: Discover random blocks from the blockchain

## Technology Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Desktop**: Tauri (Rust + Web Technologies)
- **Blockchain**: Polkadot.js API for Entropy testnet
- **Styling**: shadcn/ui components with retro aesthetic

## Development

### Prerequisites

- Node.js (v18 or higher)
- Rust (latest stable)
- Tauri CLI

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run tauri dev
   ```

### Building

```bash
npm run tauri build
```

## Network Connection

The application connects to the Entropy testnet at:
- **WebSocket**: `wss://testnet.entropy.xyz`
- **HTTP**: `https://testnet.entropy.xyz`

## License

This project is part of the Entropy ecosystem.
