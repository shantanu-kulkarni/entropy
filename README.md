# Entropy App 🚀

A nostalgic AOL-era desktop application for exploring the Entropy testnet blockchain. Built with modern technologies while evoking the charm of early internet browsing experiences.

![Entropy App](public/image.png)

## �� Project Overview

**Entropy** is a desktop application that connects to the Entropy testnet blockchain, providing an interactive interface for exploring blockchain data with a retro aesthetic. The application combines modern blockchain technology with a nostalgic browsing experience, allowing users to casually explore the network without knowing what they'll discover next.

This project was built as part of the **Entropy Product Engineering interview process** - a take-home assignment focused on demonstrating product thinking, creativity, and technical implementation skills.

### 🎯 Assignment Context

> *"At Entropy we're building the next iteration of the internet. We want to change how people interact with the web in a way that harkens back to the days of AOL. A time when browsing the web really meant casually looking around without knowing what you'd find!"*

**Assignment Requirements:**
- Build a desktop app (Tauri preferred, Electron acceptable)
- Connect to Entropy testnet (`wss://testnet.entropy.xyz`)
- Utilize blockchain data in an interactive way
- Showcase product and creative skills
- Make it something users would care about and find joy in using
- Host on GitHub with Loom video demonstration

**Time Constraint:** 6 hours maximum

## ✨ Features

### 🔗 **Blockchain Integration**
- **Real-time Connection**: Live connection to Entropy testnet via WebSocket
- **Network Statistics**: Live hashrate, validator count, transaction volume, block time
- **Block Exploration**: Browse and search through blockchain data
- **Address Lookup**: Search and view account information

### 🎨 **Nostalgic User Experience**
- **AOL-era Design**: Retro aesthetic inspired by early internet browsing
- **Casual Exploration**: "Surf the chain" functionality for random discovery
- **Theme System**: Toggle between monochrome and colored themes
- **Smooth Animations**: GSAP-powered transitions and micro-interactions
- **Interactive Elements**: Glowing buttons, hover effects, and retro styling

### 📊 **Interactive Analytics & Search**
- **Network Analytics**: Block production charts, transaction volume, network utilization
- **Advanced Search**: Search by block number, hash, or address
- **Time-based Filtering**: View data across different time ranges (24h, 7d, 30d)
- **Interactive Charts**: Hover tooltips and real-time data visualization
- **Search History**: Persistent search history with quick access

### ⚡ **Performance & Optimization**
- **Component Optimization**: React.memo, useCallback, useMemo for reduced re-renders
- **Efficient Data Fetching**: Smart caching and real-time updates
- **Smooth Transitions**: Optimized animations and state management

## 🛠 Technology Stack

### **Frontend**
- **React 19** with TypeScript for type safety
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for modern component library
- **GSAP** for advanced animations

### **Desktop Framework**
- **Tauri** (Rust + Web Technologies) for cross-platform desktop apps
- **Rust** for native performance and security
- **WebView** for rendering the React application

### **Blockchain**
- **Polkadot.js API** for Substrate blockchain interaction
- **WebSocket** connection to Entropy testnet (`wss://testnet.entropy.xyz`)

### **Development Tools**
- **Vite** for fast development and building
- **TypeScript** for type safety and better DX
- **ESLint** and **Prettier** for code quality

## 🏗 Architecture

```
src/
├── components/
│   ├── ui/           # Reusable UI components (shadcn/ui)
│   └── features/     # Feature-specific components
│       ├── Header.tsx
│       ├── NetworkStats.tsx
│       ├── QuickActions.tsx
│       ├── Footer.tsx
│       ├── MainTabs.tsx
│       └── tabs/     # Tab-specific components
│           ├── SearchTab.tsx
│           └── AnalyticsTab.tsx
├── layout/
│   └── Home.tsx      # Main layout component
├── contexts/
│   └── TransitionContext.tsx  # Global transition state
├── hooks/
│   └── use-mobile.ts
├── lib/
│   └── utils.ts      # Utility functions
├── types/
│   └── index.ts      # TypeScript interfaces
└── constants/
    └── index.ts      # Application constants
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Rust** (latest stable version)
- **Tauri CLI** (`cargo install tauri-cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shantanu-kulkarni/entropy.git
   cd entropy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run tauri dev
   ```

### Building for Production

```bash
# Build for current platform
npm run tauri build

# Build for specific platform
npm run tauri build -- --target x86_64-apple-darwin  # macOS
npm run tauri build -- --target x86_64-unknown-linux-gnu  # Linux
npm run tauri build -- --target x86_64-pc-windows-msvc  # Windows
```

## 🌐 Network Configuration

The application connects to the Entropy testnet:

- **WebSocket Endpoint**: `wss://testnet.entropy.xyz`
- **Port 9933**: HTTP RPC
- **Port 9944**: WebSocket RPC

### Data Sources

- **Real Data**: Validator count, block numbers, transaction counts
- **Simulated Data**: Charts and analytics (for demonstration purposes)
- **Update Frequency**: Every 10 seconds for network statistics

## 🎨 Design System

### AOL-Era Inspiration
- **Retro Aesthetic**: Inspired by early internet browsing experiences
- **Casual Exploration**: "Surf the chain" functionality for random discovery
- **Nostalgic Elements**: Glowing buttons, retro gradients, vintage typography

### Themes
- **Monochrome**: Black and white aesthetic with grayscale filter
- **Colored**: Full color experience with retro gradients

### Components
- **Retro Buttons**: Glowing effects with hover animations
- **Cards**: Elevated design with subtle shadows
- **Charts**: Interactive data visualization with tooltips
- **Animations**: Smooth transitions and micro-interactions

## 📱 Features in Detail

### Network Statistics
- **Total Blocks**: Real-time block count from blockchain
- **Active Validators**: Live validator count from network
- **Total Transactions**: Transaction count from recent blocks
- **Average Block Time**: Network performance metrics
- **Network Hashrate**: Mining difficulty and network activity

### Search Functionality
- **Block Search**: Search by block number or hash
- **Address Lookup**: Find account information and balances
- **Search History**: Persistent search history with quick access
- **Real-time Results**: Instant search results with loading states

### Analytics Dashboard
- **Block Production**: Timeline charts showing block creation
- **Transaction Volume**: Transaction activity over time
- **Network Utilization**: Network capacity and performance
- **Key Metrics**: TPS, validator distribution, network health

## 🔧 Development

### Project Structure
```
entropy/
├── src/              # React application source
├── src-tauri/        # Tauri backend (Rust)
├── public/           # Static assets
├── components.json   # shadcn/ui configuration
├── tailwind.config.js # Tailwind CSS configuration
└── package.json      # Node.js dependencies
```

### Key Components

#### `Home.tsx` (Main Layout)
- Orchestrates all feature components
- Manages global application state
- Handles theme switching and data fetching

#### `NetworkStats.tsx`
- Displays real-time network statistics
- Optimized with React.memo for performance
- Real-time data from Entropy testnet

#### `AnalyticsTab.tsx`
- Interactive charts and data visualization
- Time-based filtering (24h, 7d, 30d)
- Tooltip integration for detailed information

#### `SearchTab.tsx`
- Blockchain search functionality
- Search history management
- Real-time results with loading states

### Performance Optimizations

- **React.memo**: Prevents unnecessary re-renders
- **useCallback**: Memoizes function references
- **useMemo**: Caches expensive calculations
- **Component Splitting**: Modular architecture for better performance

## 🎯 Process & Decision Making

### What I Prioritized

1. **User Experience First**: Focused on creating an engaging, nostalgic browsing experience that captures the "casual exploration" spirit of early internet
2. **Real Blockchain Integration**: Ensured actual connection to Entropy testnet with real data display
3. **Performance & Polish**: Optimized components and animations for smooth user experience
4. **Product Thinking**: Designed features that users would actually want to use and find joy in

### Key Trade-offs

- **Simulated Analytics**: Used real blockchain data for core features but simulated charts for better UX and demonstration purposes
- **Theme Simplification**: Reduced from 5 themes to 2 (monochrome/colored) to focus on core functionality
- **Feature Scope**: Prioritized core blockchain exploration over advanced features to meet 6-hour constraint
- **Animation Complexity**: Balanced smooth transitions with performance considerations

### Assumptions Made

- **User Familiarity**: Assumed users have basic understanding of blockchain concepts
- **Network Stability**: Assumed Entropy testnet would be available and stable during development
- **Performance Requirements**: Assumed desktop-first experience with modern hardware
- **Design Preferences**: Assumed users would appreciate nostalgic AOL-era aesthetic

### Technical Decisions

- **Tauri over Electron**: Chose Tauri for better performance, smaller bundle size, and Rust backend
- **React + TypeScript**: For type safety and modern development experience
- **shadcn/ui**: For consistent, accessible component library
- **GSAP**: For smooth, performant animations
- **Polkadot.js API**: For Substrate blockchain interaction

## 🚀 Future Evolution

### Short-term Enhancements (1-2 months)
- **Real-time Notifications**: Push notifications for new blocks or significant network events
- **Advanced Search Filters**: Search by transaction type, validator, or time range
- **Export Functionality**: Export search results and analytics data
- **Keyboard Shortcuts**: Power user features for faster navigation

### Medium-term Features (3-6 months)
- **Multi-network Support**: Connect to other Substrate-based networks
- **Custom Dashboards**: User-configurable analytics and metrics
- **Social Features**: Share interesting blocks or transactions
- **Mobile Companion App**: Lightweight mobile version for notifications

### Long-term Vision (6+ months)
- **Decentralized Identity**: Integration with blockchain identity systems
- **NFT Gallery**: Browse and interact with NFTs on the network
- **DeFi Integration**: View and interact with DeFi protocols
- **Community Features**: User-generated content and discussions
- **API for Developers**: Public API for third-party integrations

### Product Strategy
- **User Research**: Conduct user interviews to understand exploration patterns
- **Analytics Integration**: Track user behavior to optimize discovery features
- **Community Building**: Foster a community of blockchain explorers
- **Partnerships**: Collaborate with other blockchain projects and tools

### Core Improvements
The application will focus on **simplifying the user experience** through improved loading splash screens, enhanced real-time notifications, and streamlined navigation. User research and analytics integration will drive data-informed decisions to optimize the casual exploration experience, ensuring users can discover blockchain content effortlessly while maintaining the nostalgic AOL-era charm.

## 📄 License

This project is part of the Entropy ecosystem and is developed for educational and demonstration purposes.
---

**Built with ❤️ using Tauri, React, and the Entropy testnet**

*This project was created as part of the Entropy Product Engineering interview process, demonstrating product thinking, technical skills, and creative approach to blockchain application development.*
