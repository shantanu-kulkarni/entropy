# Features Architecture

This directory follows a feature-based architecture where each feature is self-contained with its own components, logic, and structure.

## 📁 Structure

```
src/components/features/
├── home/                    # Home feature
│   ├── tabs/               # Tab components for the home feature
│   │   ├── ExploreTab.tsx
│   │   ├── SearchTab.tsx
│   │   ├── ValidatorsTab.tsx
│   │   ├── AnalyticsTab.tsx
│   │   ├── FavoritesTab.tsx
│   │   ├── SettingsTab.tsx
│   │   └── index.ts
│   ├── MainTabs.tsx        # Main tab container
│   ├── NetworkStats.tsx    # Network statistics component
│   ├── QuickActions.tsx    # Quick actions component
│   └── index.ts            # Feature exports
└── README.md               # This file
```

## 🏗️ Feature-Based Architecture

### **Home Feature**
The home feature contains all the main dashboard functionality:

#### **Core Components**
- **`MainTabs.tsx`**: Main tab container that manages all tab content
- **`NetworkStats.tsx`**: Displays network statistics in cards
- **`QuickActions.tsx`**: Quick action buttons for navigation

#### **Tab Components**
- **`ExploreTab.tsx`**: Latest blocks and chain discovery
- **`SearchTab.tsx`**: Blockchain search functionality
- **`ValidatorsTab.tsx`**: Network validator information
- **`AnalyticsTab.tsx`**: Network analytics and charts
- **`FavoritesTab.tsx`**: Favorite blocks management
- **`SettingsTab.tsx`**: App settings and configuration

## 🚀 Benefits

### **1. Organization**
- Each feature is self-contained
- Clear separation of concerns
- Easy to find and modify specific features

### **2. Scalability**
- Easy to add new features
- Simple to modify existing features
- Clear boundaries between features

### **3. Maintainability**
- Feature-specific components are grouped together
- Clear import/export structure
- Easy to understand feature scope

### **4. Reusability**
- Features can be easily reused
- Clear component boundaries
- Modular architecture

## 📝 Adding New Features

To add a new feature:

1. Create a new directory under `src/components/features/`
2. Add feature-specific components
3. Create an `index.ts` file to export components
4. Update this README if needed

### **Example Structure for a New Feature**
```
src/components/features/
├── new-feature/
│   ├── components/
│   │   ├── ComponentA.tsx
│   │   └── ComponentB.tsx
│   ├── hooks/
│   │   └── useNewFeature.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
```

## 🔄 Import/Export Pattern

Each feature exports its components through an `index.ts` file:

```typescript
// src/components/features/home/index.ts
export { MainTabs } from './MainTabs';
export { NetworkStats } from './NetworkStats';
export { QuickActions } from './QuickActions';

// Tab components
export { ExploreTab } from './tabs/ExploreTab';
export { SearchTab } from './tabs/SearchTab';
// ... other exports
```

This allows for clean imports in other parts of the application:

```typescript
import { MainTabs, NetworkStats, QuickActions } from '@/components/features/home';
```

## 🎯 Best Practices

1. **Keep features self-contained**: Each feature should have everything it needs
2. **Use clear naming**: Component and file names should be descriptive
3. **Export through index files**: Always export through index files for clean imports
4. **Document your features**: Keep README files updated
5. **Follow consistent patterns**: Use the same structure across all features

This architecture provides a solid foundation for building and maintaining a complex application while keeping the code organized and easy to understand. 