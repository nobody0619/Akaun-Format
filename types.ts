import React from 'react';

export interface DraggableItem {
  id: string; // Unique instance ID
  label: string; // The display text
  isClone?: boolean; // If true, this was created as a penalty
}

export interface DropZoneConfig {
  id: string;
  expectedLabels: string[];
  widthClass?: string; // e.g. "w-1/4", "w-3/4"
  placeholder?: string;
  group?: string; // For interchangeable items
  customStyle?: React.CSSProperties; // New: For absolute positioning in graphs
}

export interface LedgerSideConfig {
  date: string;
  zone?: DropZoneConfig; // The interactive item/label
  staticLabel?: string; // If not interactive, just text
  col1: string; // Partner A Amount
  col2: string; // Partner B Amount
}

export interface RowConfig {
  id: string;
  // Standard Financial Statement Props
  zones: DropZoneConfig[]; 
  displayNumber: string; 
  indent?: number; 
  isHeader?: boolean; 
  isTotal?: boolean; 
  hasBottomBorder?: boolean; 
  columnIndex: 0 | 1 | 2; 
  isSpacer?: boolean; 
  isItalic?: boolean; 
  isUnderlined?: boolean; 
  columnZones?: { [key: number]: DropZoneConfig }; 
  
  // Ledger (Level 8) Props
  ledgerLeft?: LedgerSideConfig;
  ledgerRight?: LedgerSideConfig;

  // Formula (Level 10) Props
  formulaTitle?: string;
  formulaMultiplier?: string;
  formulaCustomLayout?: {
    top: (number | string)[]; // Indices of zones array OR static strings
    bottom: (number | string)[];
  };
}

export interface LevelConfig {
  title: string;
  subtitle: string;
  labels: string[];
  structure: RowConfig[]; // Used for statement/ledger
  graphZones?: DropZoneConfig[]; // Used for graph layout
  layoutType: 'statement' | 'ledger' | 'graph' | 'formula'; 
}

export interface GameState {
  placedItems: Record<string, string>; 
  slotStatus: Record<string, 'neutral' | 'correct' | 'wrong'>;
  availableItems: DraggableItem[];
  selectedItemId: string | null;
  completed: boolean;
  isVictoryDelayed: boolean;
  mistakeCount: number; // Added for scoring
  score: number; // Added for scoring
  levelIndex: number; // Added to prevent stale state submissions
}