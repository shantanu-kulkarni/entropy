# Entropy Explorer - Component Architecture

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components (shadcn/ui)
│   └── features/              # Feature-specific components
│       ├── Header.tsx         # App header with logo and controls
│       ├── NetworkStats.tsx   # Network statistics cards
│       ├── QuickActions.tsx   # Quick action buttons
│       ├── MainTabs.tsx       # Main tab container
│       ├── Footer.tsx         # App footer
│       └── tabs/              # Individual tab components
│           ├── ExploreTab.tsx
│           ├── SearchTab.tsx
│           ├── ValidatorsTab.tsx
│           ├── AnalyticsTab.tsx
│           ├── FavoritesTab.tsx
│           └── SettingsTab.tsx
├── layout/
│   └── Home.tsx               # Main layout component
├── types/
│   └── index.ts               # TypeScript type definitions
├── constants/
│   └── index.ts               # Application constants
└── App.tsx                    # Root component with routing
```

## 🏗️ Architecture Overview

### **Component Hierarchy**
```
App.tsx
├── SplashScreen (route: "/")
└── Home.tsx (route: "/home")
    ├── Header
    ├── NetworkStats
    ├── QuickActions
    ├── MainTabs
    │   ├── ExploreTab
    │   ├── SearchTab
    │   ├── ValidatorsTab
    │   ├── AnalyticsTab
    │   ├── FavoritesTab
    │   └── SettingsTab
    └── Footer
```

### **Key Features**

#### **1. Modular Components**
- Each feature is isolated in its own component
- Clear separation of concerns
- Easy to test and maintain
- Reusable across different parts of the app

#### **2. Type Safety**
- All interfaces defined in `/types/index.ts`
- Strong TypeScript typing throughout
- Consistent data structures

#### **3. Constants Management**
- All static data in `/constants/index.ts`
- Easy to modify and maintain
- Centralized configuration

#### **4. Layout Structure**
- `/layout/Home.tsx` orchestrates all features
- Clean separation between layout and features
- Easy to add new layouts in the future

## 🔧 Component Details

### **Layout Components**
- **Home.tsx**: Main layout that manages state and orchestrates all features
- **Header.tsx**: App header with theme switching and connection status
- **Footer.tsx**: App footer with version and connection info

### **Feature Components**
- **NetworkStats.tsx**: Displays network statistics in cards
- **QuickActions.tsx**: Quick action buttons for navigation
- **MainTabs.tsx**: Tab container that manages all tab content

### **Tab Components**
- **ExploreTab.tsx**: Latest blocks and chain discovery
- **SearchTab.tsx**: Blockchain search functionality
- **ValidatorsTab.tsx**: Network validator information
- **AnalyticsTab.tsx**: Network analytics and charts
- **FavoritesTab.tsx**: Favorite blocks management
- **SettingsTab.tsx**: App settings and configuration

## 🎨 Styling

### **Theme System**
- Multiple themes: Monochrome, Retro, Light, Dark
- CSS classes applied based on theme selection
- Consistent styling across all components

### **Retro Aesthetics**
- Press Start 2P font for 8-bit feel
- Custom scrollbars and animations
- Glowing effects and hover states
- AOL-era inspired design elements

## 🚀 Benefits of This Structure

1. **Maintainability**: Easy to find and modify specific features
2. **Scalability**: Simple to add new features or modify existing ones
3. **Testability**: Each component can be tested in isolation
4. **Reusability**: Components can be reused across different parts of the app
5. **Performance**: Better code splitting and lazy loading opportunities
6. **Team Collaboration**: Multiple developers can work on different components simultaneously

## 🔄 State Management

- Local state managed within each component
- Props passed down from parent to child
- Callback functions for child-to-parent communication
- Clean data flow from Home.tsx down to individual components

## 📝 Adding New Features

1. Create new component in `/components/features/`
2. Add types to `/types/index.ts` if needed
3. Add constants to `/constants/index.ts` if needed
4. Import and use in appropriate parent component
5. Update this README if structure changes

This architecture provides a solid foundation for building and maintaining a complex blockchain explorer application while keeping the code organized and easy to understand. 