import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { DraggableItem, RowConfig, DropZoneConfig, GameState, LedgerSideConfig } from './types';
import { LEVELS } from './constants';
import { FileQuestion, CheckCircle2, Award, GripVertical, ChevronRight, BookOpen, ArrowLeft, Play, User, Trophy, Send, Loader2, Home, ArrowRight, ZoomOut, ZoomIn, RotateCcw, MessageCircle, GripHorizontal, Maximize2, Minimize2 } from 'lucide-react';
import confetti from 'canvas-confetti';

// Reverted to executable Web App URL because /library/ URLs cannot receive POST requests
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyDkx8Ilow9slV-gbMEL2VV4UCdMvwDrtD6fTD_zdlrwAZuKeOQ-M38reizxvGh_9fzWw/exec";

type ViewState = 'welcome' | 'selection' | 'game';

type StatementSection = NonNullable<(typeof LEVELS)[number]['statementSections']>[number];

const EMPTY_STATEMENT_SECTIONS: StatementSection[] = [];

const getStatementSectionRows = (structure: RowConfig[], section?: StatementSection): RowConfig[] => {
  if (!section) return structure;
  const startIndex = structure.findIndex(row => row.id === section.startRowId);
  const endIndex = structure.findIndex(row => row.id === section.endRowId);
  if (startIndex < 0 || endIndex < startIndex) return structure;
  return structure.slice(startIndex, endIndex + 1);
};

const getStatementLabels = (structure: RowConfig[]): string[] => {
  const seenGroups = new Set<string>();

  return structure
    .flatMap(row => [...row.zones, ...Object.values(row.columnZones || {})])
    .flatMap(zone => {
      if (zone.expectedLabels.length === 0) return [];
      if (!zone.group) return zone.expectedLabels;
      if (seenGroups.has(zone.group)) return [];

      seenGroups.add(zone.group);
      return zone.expectedLabels;
    });
};

const makeDraggableItems = (labels: string[], level: number, key: string): DraggableItem[] =>
  labels.map((label, index) => ({
    id: `item-${key}-${index}-${label.replace(/\s/g, '')}-${level}`,
    label,
    isClone: false
  })).sort(() => Math.random() - 0.5);

const Header = ({ 
  currentLevel, 
  studentName, 
  onBack,
  contentZoom,
  onZoomOut,
  onZoomIn,
  onZoomReset
}: { 
  currentLevel: number, 
  studentName: string, 
  onBack: () => void,
  contentZoom: number,
  onZoomOut: () => void,
  onZoomIn: () => void,
  onZoomReset: () => void
}) => (
  <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white p-4 md:p-6 shadow-xl z-20 relative border-b border-slate-700">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white"
          title="Back to Menu"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 tracking-tight">
            <span className="text-yellow-500">纪老师会计Format训练网</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-medium">Player: <span className="text-white">{studentName}</span></p>
        </div>
      </div>
      
      <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-center md:text-right flex-grow">
           <span className="text-xs text-slate-400 uppercase tracking-widest block">Current Level</span>
           <span className="font-bold text-yellow-400">{LEVELS[currentLevel].title}</span>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-lg p-1 flex items-center justify-center gap-1" aria-label="Page zoom controls">
          <button
            type="button"
            onClick={onZoomOut}
            disabled={contentZoom <= 0.4}
            className="w-9 h-9 flex items-center justify-center rounded-md text-slate-200 hover:bg-white/10 hover:text-white disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="w-12 text-center text-xs font-bold text-white tabular-nums">
            {Math.round(contentZoom * 100)}%
          </span>
          <button
            type="button"
            onClick={onZoomReset}
            disabled={contentZoom === 1}
            className="w-9 h-9 flex items-center justify-center rounded-md text-slate-200 hover:bg-white/10 hover:text-white disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
            title="Reset zoom"
            aria-label="Reset zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onZoomIn}
            disabled={contentZoom >= 1.5}
            className="w-9 h-9 flex items-center justify-center rounded-md text-slate-200 hover:bg-white/10 hover:text-white disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);


const TuitionContact = () => (
  <footer className="order-last shrink-0 w-full bg-gray-900 text-white border-t border-gray-700 px-4 py-3">
    <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
      <span className="font-bold text-xs sm:text-sm whitespace-nowrap">补会计就找纪老师</span>
      <a
        href="https://wa.me/60167312519"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 hover:bg-green-700 text-white rounded-md px-3 py-2 flex items-center gap-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors"
        aria-label="WhatsApp 纪老师 016-731 2519"
      >
        <MessageCircle className="w-4 h-4" />
        <span>016-731 2519</span>
      </a>
    </div>
  </footer>
);

const WelcomeScreen = ({ onStart }: { onStart: (name: string) => void }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onStart(name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center p-4">
      <TuitionContact />
      <div className="bg-white max-w-md w-full my-auto rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-indigo-600 p-8 text-center">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">纪老师会计Format训练网</h1>
          <p className="text-indigo-100">Enter your name to begin practice</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Student Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none transition-all font-semibold text-gray-800"
                placeholder="Ex: Mr Kee"
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={!name.trim()}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group mb-4"
          >
            Start Learning <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};

const LevelSelection = ({ 
  studentName, 
  onSelectLevel 
}: { 
  studentName: string, 
  onSelectLevel: (idx: number) => void 
}) => {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col">
      <TuitionContact />
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {studentName}</h1>
            <p className="text-gray-500 mt-2">Select a topic to practice today.</p>
          </div>
          <div className="hidden md:block">
            <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">{LEVELS.length} Levels Available</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {LEVELS.map((level, idx) => (
            <div 
              key={idx}
              onClick={() => onSelectLevel(idx)}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl border border-gray-200 hover:border-indigo-500 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen className="w-24 h-24 text-indigo-900" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{level.title}</h3>
                </div>
                <p className="text-gray-500 text-sm mb-6 pl-12 line-clamp-2">{level.subtitle}</p>
                <div className="pl-12">
                   <span className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 group-hover:translate-x-2 transition-transform">
                     Start Practice <Play className="w-4 h-4 fill-current" />
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<ViewState>('welcome');
  const [studentName, setStudentName] = useState('');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [contentZoom, setContentZoom] = useState(1);
  const [mobilePoolHeight, setMobilePoolHeight] = useState(35);
  const mobilePoolResizeRef = useRef<{ startY: number; startHeight: number } | null>(null);

  const startMobilePoolResize = (event: React.PointerEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 1024) return;
    mobilePoolResizeRef.current = {
      startY: event.clientY,
      startHeight: mobilePoolHeight
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveMobilePoolResize = (event: React.PointerEvent<HTMLDivElement>) => {
    const resizeState = mobilePoolResizeRef.current;
    if (!resizeState) return;

    const heightChange = ((resizeState.startY - event.clientY) / window.innerHeight) * 100;
    setMobilePoolHeight(Math.min(82, Math.max(18, resizeState.startHeight + heightChange)));
  };

  const stopMobilePoolResize = (event: React.PointerEvent<HTMLDivElement>) => {
    mobilePoolResizeRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  
  // Scoring State
  const [startTime, setStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // Prevent duplicate submissions
  const hasSubmittedRef = useRef(false);

  // Quiz Queue State (For Formula Mode)
  const [quizQueue, setQuizQueue] = useState<number[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false); // New state for manual progression
  const [currentStatementSection, setCurrentStatementSection] = useState(0);

  const [gameState, setGameState] = useState<GameState>({
    placedItems: {},
    slotStatus: {},
    availableItems: [],
    selectedItemId: null,
    completed: false,
    isVictoryDelayed: false,
    mistakeCount: 0,
    score: 0,
    levelIndex: -1 // Initial value
  });

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const activeLevelConfig = LEVELS[currentLevel];
  const activeStructure = activeLevelConfig.structure;
  const activeLabels = activeLevelConfig.labels;
  const activeSubtitle = activeLevelConfig.subtitle;
  const layoutType = activeLevelConfig.layoutType;
  const graphZones = activeLevelConfig.graphZones;
  const ledgerColumns = activeLevelConfig.ledgerColumns || 'double';
  const ledgerHeaders = activeLevelConfig.ledgerHeaders || ['Sarah', 'Helmi'];
  const ledgerDateHeader = activeLevelConfig.ledgerDateHeader || 'Tarikh';
  const isTAccount = activeLevelConfig.ledgerVariant === 't-account';
  const ledgerSections = activeLevelConfig.ledgerSections || [];
  const statementSections = activeLevelConfig.statementSections || EMPTY_STATEMENT_SECTIONS;
  const isSectionedStatement = layoutType === 'statement' && statementSections.length > 0;
  const currentStatementSectionConfig = statementSections[currentStatementSection];
  const activeStatementStructure = useMemo(
    () => isSectionedStatement
      ? getStatementSectionRows(activeStructure, currentStatementSectionConfig)
      : activeStructure,
    [activeStructure, currentStatementSectionConfig, isSectionedStatement]
  );
  const underlinedItemLabels = useMemo(
    () => new Set(
      activeStructure
        .filter(row => row.underlineLabel)
        .flatMap(row => [
          ...row.zones.flatMap(zone => zone.expectedLabels),
          ...Object.values(row.columnZones || {}).flatMap(zone => zone.expectedLabels)
        ])
    ),
    [activeStructure]
  );

  useEffect(() => {
    if (view !== 'game') return;

    // Reset submission lock
    hasSubmittedRef.current = false;

    setGameState({
      placedItems: {},
      slotStatus: {},
      availableItems: [],
      selectedItemId: null,
      completed: false,
      isVictoryDelayed: false,
      mistakeCount: 0,
      score: 0,
      levelIndex: currentLevel // Set correct level index to validate submission
    });
    setStartTime(Date.now());
    setScoreSubmitted(false);
    setIsSubmitting(false);
    setShowNextButton(false);
    setCurrentStatementSection(0);
    
    // For Formula mode, shuffle questions
    if (layoutType === 'formula') {
        const indices = activeStructure.map((_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        setQuizQueue(indices);
        setCurrentQuizIndex(0);
    }

    const initialStatementRows = isSectionedStatement
      ? getStatementSectionRows(activeStructure, statementSections[0])
      : activeStructure;
    const labelsForPool = isSectionedStatement
      ? getStatementLabels(initialStatementRows)
      : activeLabels;
    const items = makeDraggableItems(labelsForPool, currentLevel, isSectionedStatement ? 'section-0' : 'full');

    setGameState(prev => ({
      ...prev,
      availableItems: items,
    }));
  }, [currentLevel, activeLabels, view, layoutType, activeStructure, isSectionedStatement, statementSections]);

  // Effect to check question completion for Formula Mode
  useEffect(() => {
    if (layoutType !== 'formula') return;
    if (gameState.completed) return;
    if (quizQueue.length === 0) return;
    if (showNextButton) return; // Already showing button

    const currentQuestionIdx = quizQueue[currentQuizIndex];
    const currentRow = activeStructure[currentQuestionIdx];
    
    // Check if all zones in current row are filled correctly
    const allZonesFilled = currentRow.zones
        .filter(z => z.expectedLabels.length > 0)
        .every(z => gameState.placedItems[z.id]);
    
    if (allZonesFilled) {
        setShowNextButton(true);
    }
  }, [gameState.placedItems, layoutType, quizQueue, currentQuizIndex, activeStructure, gameState.completed, showNextButton]);

  const handleNextQuestion = () => {
      setShowNextButton(false);
      setGameState(prev => ({
          ...prev,
          placedItems: {},
          slotStatus: {}
      }));

      if (currentQuizIndex < quizQueue.length - 1) {
          setCurrentQuizIndex(prev => prev + 1);
      } else {
          // Quiz finished
          setGameState(prev => ({ ...prev, isVictoryDelayed: true }));
          setTimeout(() => {
              setGameState(prev => ({ ...prev, completed: true }));
              triggerConfetti();
          }, 500);
      }
  };

  const handleNextStatementSection = () => {
    const nextSectionIndex = currentStatementSection + 1;
    const nextSection = statementSections[nextSectionIndex];
    if (!nextSection) return;

    const nextRows = getStatementSectionRows(activeStructure, nextSection);
    const nextItems = makeDraggableItems(
      getStatementLabels(nextRows),
      currentLevel,
      `section-${nextSectionIndex}`
    );

    setCurrentStatementSection(nextSectionIndex);
    setShowNextButton(false);
    setGameState(prev => ({
      ...prev,
      placedItems: {},
      slotStatus: {},
      availableItems: nextItems,
      selectedItemId: null,
      isVictoryDelayed: false
    }));
  };

  useEffect(() => {
    if (view !== 'game') return;
    if (layoutType === 'formula') return; 

    const allZones: DropZoneConfig[] = [];
    if (layoutType === 'statement') {
      activeStatementStructure.forEach(row => {
        allZones.push(...row.zones);
        if (row.columnZones) allZones.push(...Object.values(row.columnZones));
      });
    } else if (layoutType === 'ledger') {
       activeStructure.forEach(row => {
        if (row.ledgerLeft?.zone) allZones.push(row.ledgerLeft.zone);
        if (row.ledgerRight?.zone) allZones.push(row.ledgerRight.zone);
      });
    } else if (layoutType === 'graph' && graphZones) {
       allZones.push(...graphZones);
    }

    const totalZones = allZones.filter(z => z.expectedLabels.length > 0).length;
    if (totalZones === 0) return;

    const filledCorrectly = Object.keys(gameState.placedItems).length;
    
    if (filledCorrectly === totalZones && !gameState.isVictoryDelayed && !gameState.completed) {
      if (isSectionedStatement && currentStatementSection < statementSections.length - 1) {
        if (!showNextButton) setShowNextButton(true);
      } else {
        setGameState(prev => ({ ...prev, isVictoryDelayed: true }));
      }
    }
  }, [
    gameState.placedItems,
    gameState.completed,
    gameState.isVictoryDelayed,
    activeStatementStructure,
    activeStructure,
    view,
    layoutType,
    graphZones,
    isSectionedStatement,
    currentStatementSection,
    statementSections.length,
    showNextButton
  ]);

  useEffect(() => {
    if (gameState.isVictoryDelayed && !gameState.completed) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, completed: true }));
        triggerConfetti();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState.isVictoryDelayed, gameState.completed]);

  // Reliable Auto-Submit when completed becomes true
  useEffect(() => {
    // Only submit if we are completed, haven't submitted this session, 
    // AND the game state belongs to the current level (preventing stale state submissions)
    if (gameState.completed && !hasSubmittedRef.current && gameState.levelIndex === currentLevel) {
        hasSubmittedRef.current = true;
        
        const submit = async () => {
            setIsSubmitting(true);
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            
            const payload = {
                name: studentName,
                levelId: (currentLevel + 1).toString(),
                score: gameState.score || 0,
                time: timeSpent
            };
            
            console.log("Submitting score...", payload);

            try {
                await fetch(APPS_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify(payload)
                });
                console.log("Submission sent (opaque response)");
                setScoreSubmitted(true);
            } catch (error) {
                console.error("Submission error:", error);
            } finally {
                setIsSubmitting(false);
            }
        };

        submit();
    }
  }, [gameState.completed, gameState.score, gameState.levelIndex, startTime, studentName, currentLevel]);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#22c55e', '#fbbf24'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#22c55e', '#fbbf24'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const handleDragStart = (e: React.DragEvent, item: DraggableItem) => {
    if (gameState.completed) return;
    setDraggedItemId(item.id);
    setGameState(prev => ({ ...prev, selectedItemId: item.id }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const attemptMove = useCallback((zone: DropZoneConfig, itemId: string) => {
    if (gameState.completed) return;
    if (gameState.placedItems[zone.id]) return; 

    const selectedItem = gameState.availableItems.find(i => i.id === itemId);
    if (!selectedItem) return;

    const isCorrectLabel = zone.expectedLabels.includes(selectedItem.label);
    let isValid = isCorrectLabel;

    if (isValid && zone.group) {
      const allZones: DropZoneConfig[] = [];
      if (layoutType === 'statement') {
          activeStatementStructure.forEach(row => {
            allZones.push(...row.zones);
            if (row.columnZones) allZones.push(...Object.values(row.columnZones));
          });
      } else if (layoutType === 'formula') {
          activeStructure.forEach(row => {
            allZones.push(...row.zones);
            if (row.columnZones) allZones.push(...Object.values(row.columnZones));
          });
      } else if (layoutType === 'ledger') {
          activeStructure.forEach(row => {
            if (row.ledgerLeft?.zone) allZones.push(row.ledgerLeft.zone);
            if (row.ledgerRight?.zone) allZones.push(row.ledgerRight.zone);
          });
      } else if (layoutType === 'graph' && graphZones) {
          allZones.push(...graphZones);
      }
      
      const allGroupZones = allZones.filter(z => z.group === zone.group && z.id !== zone.id);
      const labelsUsedInGroup = allGroupZones
        .map(z => gameState.placedItems[z.id])
        .filter(Boolean);

      if (labelsUsedInGroup.includes(selectedItem.label)) {
        isValid = false;
      }
    }

    if (isValid) {
      handleCorrectMove(zone, selectedItem);
    } else {
      handleWrongMove(zone.id, selectedItem);
    }
    
    setDraggedItemId(null);
  }, [gameState.availableItems, gameState.placedItems, gameState.completed, activeStructure, activeStatementStructure, layoutType, graphZones]);

  const handleCorrectMove = (zone: DropZoneConfig, item: DraggableItem) => {
    setGameState(prev => {
        const points = item.isClone ? 1 : 2;
        const label = item.label;
        const isFormula = layoutType === 'formula';
        
        // 1. Calculate Excess Items
        // Count how many items with this label exist in the pool (excluding the one just dragged)
        const remainingItemsCount = prev.availableItems.filter(i => i.id !== item.id && i.label === label).length;

        // 2. Calculate Remaining Slots that need this label
        // (Logic to count how many OTHER empty slots specifically need this label)
        const allZones: DropZoneConfig[] = [];
         if (layoutType === 'statement') {
            activeStatementStructure.forEach(row => {
                allZones.push(...row.zones);
                if (row.columnZones) allZones.push(...Object.values(row.columnZones));
            });
        } else if (layoutType === 'formula') {
            activeStructure.forEach(row => {
                allZones.push(...row.zones);
                if (row.columnZones) allZones.push(...Object.values(row.columnZones));
            });
        } else if (layoutType === 'ledger') {
            activeStructure.forEach(row => {
                if (row.ledgerLeft?.zone) allZones.push(row.ledgerLeft.zone);
                if (row.ledgerRight?.zone) allZones.push(row.ledgerRight.zone);
            });
        } else if (layoutType === 'graph' && graphZones) {
            allZones.push(...graphZones);
        }

        // We simulate the current zone being filled to check availability for OTHERS
        const simulatedPlacedItems = { ...prev.placedItems, [zone.id]: label };
        
        let remainingSlotsCount = 0;
        allZones.forEach(z => {
            if (z.id === zone.id) return; // Ignore current zone
            if (simulatedPlacedItems[z.id]) return; // Ignore already filled zones

            if (z.expectedLabels.includes(label)) {
                if (z.group) {
                     // For groups, if the label is already used elsewhere in the group, this slot can't take it.
                     const groupZones = allZones.filter(gz => gz.group === z.group && gz.id !== z.id);
                     const labelsInGroup = groupZones.map(gz => simulatedPlacedItems[gz.id]).filter(Boolean);
                     if (!labelsInGroup.includes(label)) {
                         remainingSlotsCount++;
                     }
                } else {
                    remainingSlotsCount++;
                }
            }
        });

        // 3. Determine if we need to "Burn" this entry (clear slot to allow more inputs)
        // If we have more items than slots, we must clear the slot after 1s to allow the user to 'use up' the extras.
        // NOTE: Formula mode usually has infinite items, so we skip this logic for it.
        // UPDATED: Enabled for ledgers too (removed layoutType !== 'ledger' check) so penalties/clones disappear correctly.
        // We rely on exact pool counts in constants.ts to prevent valid items from disappearing.
        const isExcess = !isFormula && (remainingItemsCount > remainingSlotsCount);

        const scorePoints = isExcess ? 0 : (item.isClone ? 1 : 2);

        if (isExcess) {
            // Schedule the slot to clear after 1 second
            setTimeout(() => {
                setGameState(curr => {
                    // Only clear if it's still marked as correct (prevent race conditions)
                    if (curr.slotStatus[zone.id] === 'correct') {
                        const newPlaced = { ...curr.placedItems };
                        delete newPlaced[zone.id];
                        return {
                            ...curr,
                            placedItems: newPlaced,
                            slotStatus: { ...curr.slotStatus, [zone.id]: 'neutral' }
                        };
                    }
                    return curr;
                });
            }, 1000);
        }

        // 4. Update State
        // Remove only the dragged item IF NOT FORMULA MODE
        // For Formula mode, we keep the item in availableItems to act as an infinite pool
        let newAvailableItems = prev.availableItems;
        if (!isFormula) {
            newAvailableItems = prev.availableItems.filter(i => i.id !== item.id);
        }

        return {
          ...prev,
          score: (prev.score || 0) + scorePoints,
          placedItems: { ...prev.placedItems, [zone.id]: item.label },
          slotStatus: { ...prev.slotStatus, [zone.id]: 'correct' as const },
          selectedItemId: null,
          availableItems: newAvailableItems
        };
    });
  };

  const handleWrongMove = (zoneId: string, item: DraggableItem) => {
    // 1. Immediately show wrong state
    setGameState(prev => ({
      ...prev,
      score: Math.max(0, (prev.score || 0) - 1),
      slotStatus: { ...prev.slotStatus, [zoneId]: 'wrong' },
      selectedItemId: null,
      mistakeCount: prev.mistakeCount + 1
    }));

    if (layoutType === 'formula') {
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            slotStatus: { ...prev.slotStatus, [zoneId]: 'neutral' }
          }));
        }, 1000);
        return;
    }

    // 2. Add penalty clones
    const clones: DraggableItem[] = [
      { id: `${item.id}-c1-${Date.now()}`, label: item.label, isClone: true },
      { id: `${item.id}-c2-${Date.now()}`, label: item.label, isClone: true }
    ];

    setGameState(prev => ({
      ...prev,
      availableItems: [...prev.availableItems, ...clones].sort(() => Math.random() - 0.5)
    }));

    // 3. Reset to neutral after 1 second, BUT ONLY IF IT'S STILL 'WRONG'
    // This fixes the bug where a quick correct answer would be overwritten by this timeout
    setTimeout(() => {
      setGameState(prev => {
        if (prev.slotStatus[zoneId] === 'wrong') {
             return {
                ...prev,
                slotStatus: { ...prev.slotStatus, [zoneId]: 'neutral' }
             };
        }
        return prev;
      });
    }, 1000);
  };

  const renderZone = (zone: DropZoneConfig, idx: number, row: RowConfig | null, isLedger = false) => {
      if (zone.expectedLabels.length === 0 && !zone.placeholder) {
         // Pure spacer or invalid zone
         return <div key={zone.id} className={`${zone.widthClass} flex-shrink-0`}></div>;
      }

      // Check for Static Text Mode
      if (zone.isStaticText) {
          return (
             <div key={zone.id} className={`${zone.widthClass} flex-shrink-0 flex items-center whitespace-pre text-gray-800 font-semibold text-sm`}>
                {zone.placeholder || zone.expectedLabels[0]}
             </div>
          );
      }
      
      // Static placeholder logic (e.g. "2" in formula)
      if (zone.expectedLabels.length === 0 && zone.placeholder) {
          return (
             <div key={zone.id} className={`${zone.widthClass} flex-shrink-0 text-center text-gray-800 font-bold text-xl`}>
                {zone.placeholder}
             </div>
          );
      }

      const status = gameState.slotStatus[zone.id] || 'neutral';
      const content = gameState.placedItems[zone.id];
      
      let bgClass = "bg-slate-100 border-slate-200";
      if (status === 'correct') bgClass = "bg-emerald-50 border-emerald-300 text-emerald-900";
      if (status === 'wrong') bgClass = "bg-rose-50 border-rose-300 animate-shake";
      if (status === 'neutral' && !content) {
        bgClass = gameState.selectedItemId 
          ? "bg-indigo-50 border-indigo-300 border-dashed animate-pulse" 
          : "bg-gray-50 border-gray-300 border-dashed hover:border-gray-400";
      }
      
      const textStyle = (row?.isHeader && !isLedger) ? "font-bold text-gray-900" : "text-gray-800";
      const style = zone.customStyle || {};
      const isAbsolute = !!zone.customStyle;

      return (
        <div 
          key={zone.id}
          onClick={() => gameState.selectedItemId && attemptMove(zone, gameState.selectedItemId)}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
          onDrop={(e) => { e.preventDefault(); if (draggedItemId) attemptMove(zone, draggedItemId); }}
          style={style}
          className={`
            ${isAbsolute ? 'absolute shadow-lg z-10 h-8 sm:h-10 lg:h-12 px-1 sm:px-2' : 'relative h-12 px-2'}
            flex items-center justify-center rounded-md select-none transition-all duration-200 border-2
            ${isAbsolute && !content ? 'opacity-70 sm:opacity-90 lg:opacity-100' : 'opacity-100'}
            ${bgClass} ${textStyle} ${zone.widthClass} shadow-sm cursor-pointer
          `}
        >
          {content ? (
            <span className={`flex items-center ${isAbsolute ? 'gap-1 text-[9px] sm:text-[11px] lg:text-sm' : 'gap-2'} w-full justify-center animate-in fade-in zoom-in duration-200 whitespace-nowrap overflow-hidden font-semibold ${row?.underlineLabel && !isLedger ? 'underline decoration-2 underline-offset-4' : ''}`}>
              {content}
              {status === 'correct' && <CheckCircle2 className={`${isAbsolute ? 'w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5' : 'w-5 h-5'} text-emerald-600 flex-shrink-0`} />}
            </span>
          ) : (
            <span className={`text-gray-400 ${isAbsolute ? 'text-[8px] sm:text-[10px] lg:text-xs' : 'text-xs'} font-medium w-full text-center tracking-wide uppercase`}>
               {status === 'wrong' ? "Incorrect" : (gameState.selectedItemId ? "Drop Here" : "")}
            </span>
          )}
        </div>
      );
  };

  const renderFormula = (row: RowConfig) => {
    if (!row) return null;

    const renderLayoutPart = (part: number | string) => {
      if (typeof part === 'string') {
        return <div key={`txt-${part}`} className="text-2xl font-bold text-gray-600 px-2">{part}</div>;
      }
      return renderZone(row.zones[part], part, row);
    };

    const renderDefault = () => (
      <>
         {/* Numerator */}
         <div className="w-full flex justify-center">
            {renderZone(row.zones[0], 0, row)}
         </div>
         {/* Divider Line */}
         <div className="w-full h-[3px] bg-gray-800 rounded-full my-1"></div>
         {/* Denominator */}
         <div className="w-full flex justify-center">
            {renderZone(row.zones[1], 1, row)}
         </div>
      </>
    );

    const renderCustom = () => (
      <>
         {/* Numerator */}
         <div className="w-full flex justify-center items-center gap-2">
            {row.formulaCustomLayout?.top.map(renderLayoutPart)}
         </div>
         {/* Divider Line */}
         <div className="w-full h-[3px] bg-gray-800 rounded-full my-1"></div>
         {/* Denominator */}
         <div className="w-full flex justify-center items-center gap-2">
            {row.formulaCustomLayout?.bottom.map(renderLayoutPart)}
         </div>
      </>
    );

    return (
        <div className="flex flex-col items-center justify-center h-full w-full py-12 animate-in slide-in-from-right duration-500">
            <div className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-8">
                Question {currentQuizIndex + 1} of {activeStructure.length}
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-8 bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
                {/* Left Side: Title */}
                <div className="bg-amber-100/50 border border-amber-200 text-amber-900 px-8 py-6 rounded-xl shadow-sm min-w-[280px] text-center self-stretch flex items-center justify-center">
                    <h3 className="text-xl md:text-2xl font-bold leading-relaxed">{row.formulaTitle}</h3>
                </div>

                <div className="text-3xl font-bold text-gray-400 hidden md:block">=</div>
                <div className="text-3xl font-bold text-gray-400 md:hidden rotate-90">=</div>

                {/* Right Side: Equation */}
                <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-xl shadow-sm flex flex-row items-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                        {row.formulaCustomLayout ? renderCustom() : renderDefault()}
                    </div>
                    
                    {row.formulaMultiplier && (
                       <div className="text-xl font-bold text-gray-700 ml-2 font-mono whitespace-nowrap">
                           {row.formulaMultiplier}
                       </div>
                    )}
                </div>
            </div>

            {/* Manual Next Button */}
            {showNextButton && (
                <button 
                    onClick={handleNextQuestion}
                    className="mt-12 px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-2 animate-bounce"
                >
                    {currentQuizIndex < activeStructure.length - 1 ? (
                        <>Next Question <ArrowRight className="w-5 h-5" /></>
                    ) : (
                        <>Finish Quiz <CheckCircle2 className="w-5 h-5" /></>
                    )}
                </button>
            )}
        </div>
    );
  };

  const renderStatementRow = (row: RowConfig, previousRowHasBottomBorder = false) => {
    const showRedLine = row.hasBottomBorder;
    const showDoubleLine = row.isTotal;
    const indentClass = row.indent === 1 ? "pl-8" : "";
    
    return (
      <tr key={row.id} className="min-h-[3.5rem] even:bg-slate-50/70 hover:bg-indigo-50/60 transition-colors group">
        <td className="py-3 pr-4 w-3/5 pl-2 align-middle">
          <div className={`flex items-center gap-2 ${indentClass} h-full border-b border-transparent group-hover:border-slate-200`}>
            {row.zones.map((zone, idx) => renderZone(zone, idx, row))}
          </div>
        </td>

        {[0, 1, 2].map((colIdx) => {
           const customZone = row.columnZones?.[colIdx];
           const isLastColumn = colIdx === 2;
           const isActiveTotalColumn = row.columnIndex === colIdx && showDoubleLine;
           const needsTotalTopLine = isActiveTotalColumn && !previousRowHasBottomBorder;
           return (
             <td key={colIdx} className={`
               w-[13%] align-middle px-0 py-0 relative
               ${!isLastColumn ? 'border-r border-gray-100' : ''}
               ${needsTotalTopLine ? 'border-t border-gray-900' : ''}
             `}>
               <div className="flex items-center justify-end w-full h-12 px-2">
                  {customZone ? (
                     renderZone(customZone, 0, { ...row, isHeader: true, isUnderlined: false })
                  ) : (
                    <div className={`
                        w-full text-right font-mono-numbers text-lg text-gray-900 tracking-tight
                        ${row.columnIndex === colIdx && showRedLine ? "border-b border-gray-800" : ""}
                        ${isActiveTotalColumn ? "border-b-4 border-double border-gray-900" : ""}
                    `}>
                      {colIdx === row.columnIndex ? row.displayNumber : ""}
                    </div>
                  )}
               </div>
             </td>
           );
        })}
      </tr>
    );
  };

  const renderLedgerRow = (row: RowConfig) => {
    const isTotal = row.isTotal;
    const amountClasses = isTotal 
      ? "border-t border-gray-900 border-b-4 border-double border-gray-900 font-bold bg-white" 
      : ""; 
    const cellText = "text-right font-mono-numbers text-gray-800 text-sm p-1";
    const borderRight = "border-r border-gray-200";
    const borderRightThick = "border-r border-gray-900"; 
    
    // Determine Col Span based on ledger type
    const isSingleCol = ledgerColumns === 'single';

    const renderSide = (sideConfig?: LedgerSideConfig, isRight?: boolean) => {
      if (!sideConfig) return null;
      const cellDivider = isTAccount ? '' : borderRight;
      const amountDivider = isTAccount
        ? (!isRight && isSingleCol ? borderRightThick : '')
        : borderRight;
      const secondAmountDivider = isTAccount
        ? (!isRight ? borderRightThick : '')
        : (isRight ? '' : borderRightThick);
      if (isTotal) {
         return (
           <>
             <td className="bg-transparent border-r border-transparent"></td>
             <td className="bg-transparent border-r border-transparent"></td>
             <td className={`${amountClasses} ${cellText} ${amountDivider}`}>{sideConfig.col1}</td>
             {!isSingleCol && (
                 <td className={`${amountClasses} ${cellText} ${secondAmountDivider}`}>{sideConfig.col2}</td>
             )}
           </>
         );
      }
      return (
        <>
          <td className={`p-1 text-gray-500 text-xs font-mono text-center leading-tight whitespace-pre-line w-[10%] ${cellDivider}`}>{sideConfig.date}</td>
          <td className={`p-1 w-[50%] ${cellDivider}`}>
            {sideConfig.zone 
              ? renderZone(sideConfig.zone, 0, null, true) 
              : <div className="h-10 flex items-center px-2 font-semibold text-gray-700 text-sm">{sideConfig.staticLabel}</div>
            }
          </td>
          <td className={`${amountClasses} ${cellText} ${amountDivider}`}>{sideConfig.col1}</td>
          {!isSingleCol && (
            <td className={`${amountClasses} ${cellText} ${secondAmountDivider}`}>{sideConfig.col2}</td>
          )}
        </>
      );
    };

    return (
      <tr key={row.id} className={`${isTotal ? 'h-8' : 'hover:bg-slate-50'}`}>
        {renderSide(row.ledgerLeft, false)}
        {renderSide(row.ledgerRight, true)}
      </tr>
    );
  };

  const renderGraph = () => {
    if (!graphZones) return null;

    return (
      <div className="relative w-full max-w-5xl mx-auto aspect-[4/3] bg-white rounded-lg shadow-inner border border-gray-200 overflow-hidden">
        <svg viewBox="0 0 800 600" className="w-full h-full absolute inset-0 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="minor-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0f2fe" strokeWidth="1" />
            </pattern>
            <pattern id="major-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect width="80" height="80" fill="url(#minor-grid)" />
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#bae6fd" strokeWidth="1.5" />
            </pattern>
            <marker id="axis-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#111827" />
            </marker>
            <marker id="guide-arrow" markerWidth="9" markerHeight="9" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#f97316" />
            </marker>
          </defs>

          <rect width="800" height="600" fill="#ffffff" />
          <rect x="90" y="40" width="660" height="480" fill="url(#major-grid)" />

          {/* Loss and profit regions */}
          <polygon points="90,440 90,520 310,360" fill="rgba(248, 113, 113, 0.30)" />
          <polygon points="310,360 640,120 640,240" fill="rgba(96, 165, 250, 0.30)" />

          {/* Axes */}
          <line x1="90" y1="520" x2="90" y2="42" stroke="#111827" strokeWidth="3" markerEnd="url(#axis-arrow)" />
          <line x1="90" y1="520" x2="752" y2="520" stroke="#111827" strokeWidth="3" markerEnd="url(#axis-arrow)" />

          {/* Scale ticks and values */}
          {[0, 1, 2, 3, 4, 5].map((value) => {
            const x = 90 + value * 110;
            return (
              <g key={`x-tick-${value}`}>
                <line x1={x} y1="520" x2={x} y2="527" stroke="#475569" strokeWidth="1.5" />
                <text x={x} y="544" textAnchor="middle" fontSize="13" fill="#475569">{value}</text>
              </g>
            );
          })}
          {[5, 10, 15, 20, 25].map((value) => {
            const y = 520 - (value / 5) * 80;
            return (
              <g key={`y-tick-${value}`}>
                <line x1="83" y1={y} x2="90" y2={y} stroke="#475569" strokeWidth="1.5" />
                <text x="76" y={y + 4} textAnchor="end" fontSize="13" fill="#475569">{value}</text>
              </g>
            );
          })}

          {/* Financial lines */}
          <line x1="90" y1="440" x2="640" y2="440" stroke="#475569" strokeWidth="3" />
          <line x1="90" y1="440" x2="640" y2="240" stroke="#1f2937" strokeWidth="3.5" />
          <line x1="90" y1="520" x2="640" y2="120" stroke="#111827" strokeWidth="3.5" />

          {/* Break-even guides */}
          <line x1="90" y1="360" x2="310" y2="360" stroke="#ef4444" strokeWidth="2" strokeDasharray="7 7" />
          <line x1="310" y1="360" x2="310" y2="520" stroke="#ef4444" strokeWidth="2" strokeDasharray="7 7" />
          <circle cx="310" cy="360" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />

          {/* One short guide keeps the break-even slot unambiguous */}
          <path d="M 236 330 L 300 355" fill="none" stroke="#f97316" strokeWidth="2.5" markerEnd="url(#guide-arrow)" />
        </svg>
        {graphZones.map((zone, idx) => renderZone(zone, idx, null))}
      </div>
    );
  };

  if (view === 'welcome') {
    return <WelcomeScreen onStart={(name) => { setStudentName(name); setView('selection'); }} />;
  }
  
  if (view === 'selection') {
    return (
      <LevelSelection 
        studentName={studentName} 
        onSelectLevel={(idx) => { setCurrentLevel(idx); setView('game'); }} 
      />
    );
  }

  const isSingleCol = ledgerColumns === 'single';
  const headerCol1 = ledgerHeaders[0];
  const headerCol2 = ledgerHeaders[1];

  const renderLedgerTable = (rows: RowConfig[]) => (
    <table className={`w-full text-sm border-collapse min-w-[800px] ${isTAccount ? "max-w-5xl mx-auto border-t-2 border-gray-900 table-fixed" : ""}`}>
      {isTAccount && (
        isSingleCol ? (
          <colgroup>
            <col className="w-[10%]" />
            <col className="w-[32%]" />
            <col className="w-[8%]" />
            <col className="w-[10%]" />
            <col className="w-[32%]" />
            <col className="w-[8%]" />
          </colgroup>
        ) : (
          <colgroup>
            <col className="w-[8%]" />
            <col className="w-[26%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[26%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
          </colgroup>
        )
      )}
      <thead className={isTAccount ? "bg-white" : "bg-indigo-50 border-b-2 border-indigo-100"}>
        {!isTAccount && (
          <tr>
            <th colSpan={isSingleCol ? 3 : 4} className="py-2 border-r border-gray-900 text-center font-bold text-indigo-900 uppercase tracking-wider">Debit</th>
            <th colSpan={isSingleCol ? 3 : 4} className="py-2 text-center font-bold text-indigo-900 uppercase tracking-wider">Credit</th>
          </tr>
        )}
        <tr className="text-xs text-gray-500 uppercase tracking-wider">
          <th className={`p-2 ${isTAccount ? '' : 'border-r border-gray-200'}`}>{ledgerDateHeader}</th>
          <th className={`p-2 w-1/4 ${isTAccount ? '' : 'border-r border-gray-200'}`}>Butiran</th>
          <th className={`p-2 ${isTAccount ? (isSingleCol ? 'border-r border-gray-900' : '') : `border-r ${isSingleCol ? 'border-gray-900' : 'border-gray-200'}`}`}>{headerCol1}</th>
          {!isSingleCol && <th className="p-2 border-r border-gray-900">{headerCol2}</th>}
          <th className={`p-2 ${isTAccount ? '' : 'border-r border-gray-200'}`}>{ledgerDateHeader}</th>
          <th className={`p-2 w-1/4 ${isTAccount ? '' : 'border-r border-gray-200'}`}>Butiran</th>
          <th className={`p-2 ${isTAccount ? '' : (isSingleCol ? '' : 'border-r border-gray-200')}`}>{headerCol1}</th>
          {!isSingleCol && <th className="p-2">{headerCol2}</th>}
        </tr>
      </thead>
      <tbody>{rows.map(renderLedgerRow)}</tbody>
    </table>
  );

  const renderLedgerExcerpt = (rows: RowConfig[]) => (
    <table className="w-full max-w-3xl mx-auto text-sm border-collapse min-w-[560px] border-t-2 border-gray-900 table-fixed">
      <colgroup>
        <col className="w-[84%]" />
        <col className="w-[16%]" />
      </colgroup>
      <thead>
        <tr className="text-xs text-gray-500 uppercase tracking-wider">
          <th className="p-2 text-left">Butiran</th>
          <th className="p-2 text-right">RM</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => {
          const side = row.ledgerLeft;
          if (!side) return null;
          return (
            <tr key={row.id} className="hover:bg-slate-50">
              <td className="p-1">
                {side.zone
                  ? renderZone(side.zone, 0, null, true)
                  : <div className="h-10 flex items-center px-2 font-semibold text-gray-700 text-sm">{side.staticLabel}</div>
                }
              </td>
              <td className="p-3 text-right font-mono-numbers text-gray-800 border-b border-gray-900">{side.col1}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-200 select-none font-sans">
      <TuitionContact />
      <Header
        currentLevel={currentLevel}
        studentName={studentName}
        onBack={() => setView('selection')}
        contentZoom={contentZoom}
        onZoomOut={() => setContentZoom(value => Math.max(0.4, Number((value - 0.1).toFixed(1))))}
        onZoomIn={() => setContentZoom(value => Math.min(1.5, Number((value + 0.1).toFixed(1))))}
        onZoomReset={() => setContentZoom(1)}
      />

      <main
        className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full"
        style={{ zoom: contentZoom }}
      >
        <div className="flex-grow bg-white shadow-2xl rounded-lg overflow-hidden relative min-h-[600px] flex flex-col">
          <div className="text-center pt-8 pb-4 bg-white border-b border-gray-100 px-4">
            <h2 className="font-extrabold text-xl md:text-2xl uppercase tracking-widest text-gray-900 mb-1">
              {activeLevelConfig.title}
            </h2>
             <div className="flex items-center justify-center gap-4 mt-2">
                 <div className="flex items-center gap-1 text-sm font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                    <Trophy className="w-4 h-4" /> Score: {gameState.score || 0}
                 </div>
                 {layoutType === 'formula' && (
                     <div className="flex items-center gap-1 text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                        <FileQuestion className="w-4 h-4" /> Q: {currentQuizIndex + 1}/{activeStructure.length}
                     </div>
                 )}
             </div>
          </div>

          <div className="overflow-x-auto p-4 md:p-8 flex-grow">
            {activeSubtitle && (
              <h3 className="text-center font-bold text-sm md:text-lg uppercase text-gray-900 mb-3 whitespace-nowrap">
                {activeSubtitle}
              </h3>
            )}
            {layoutType === 'statement' ? (
              <>
                {isSectionedStatement && currentStatementSectionConfig && (
                  <div className="min-w-[700px] mb-3 flex items-center justify-between gap-4 border-b border-indigo-200 pb-3">
                    <h4 className="font-bold text-indigo-900 text-sm md:text-base">
                      {currentStatementSectionConfig.title}
                    </h4>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-md whitespace-nowrap">
                      Section {currentStatementSection + 1} / {statementSections.length}
                    </span>
                  </div>
                )}
                <table className="w-full text-sm md:text-base border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-black">
                      <th className="text-left py-4 pl-4 font-semibold text-gray-400 uppercase text-xs tracking-wider"></th>
                      <th className="text-right py-4 px-2 font-bold text-gray-800 w-[13%]">RM</th>
                      <th className="text-right py-4 px-2 font-bold text-gray-800 w-[13%]">RM</th>
                      <th className="text-right py-4 px-2 font-bold text-gray-800 w-[13%]">RM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeStatementStructure.map((row, idx) => renderStatementRow(row, idx > 0 && !!activeStatementStructure[idx - 1].hasBottomBorder))}
                  </tbody>
                </table>
                {isSectionedStatement && showNextButton && (
                  <div className="min-w-[700px] flex justify-end mt-6">
                    <button
                      onClick={handleNextStatementSection}
                      className="px-5 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      Next Section <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : layoutType === 'ledger' ? (
              ledgerSections.length > 0 ? (
                <div className="min-w-[800px] max-w-5xl mx-auto space-y-10">
                  {ledgerSections.map(section => {
                    const sectionRows = getStatementSectionRows(activeStructure, section);
                    return (
                      <section key={section.startRowId}>
                        <h4 className="text-center font-bold text-base md:text-lg text-gray-900 mb-2">
                          {section.title}
                        </h4>
                        {section.variant === 'statement-excerpt'
                          ? renderLedgerExcerpt(sectionRows)
                          : renderLedgerTable(sectionRows)
                        }
                      </section>
                    );
                  })}
                </div>
              ) : (
                renderLedgerTable(activeStructure)
              )
            ) : layoutType === 'formula' ? (
                // Render only the current formula based on queue
                renderFormula(activeStructure[quizQueue[currentQuizIndex]])
            ) : (
              renderGraph()
            )}
          </div>

          {gameState.completed && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50 flex-col animate-in fade-in duration-700">
              <div className="bg-green-100 p-6 rounded-full mb-6 animate-bounce shadow-inner">
                 <Award className="w-16 h-16 text-green-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight text-center">
                 Congratulations {studentName},<br/>you have mastered {activeLevelConfig.title}!
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-6 py-2 mb-8 mt-4">
                 <p className="text-yellow-800 font-bold text-2xl">Final Score: {gameState.score}</p>
                 <p className="text-xs text-yellow-600 text-center">Mistakes: {gameState.mistakeCount}</p>
              </div>
              
              <div className="mb-6">
                {isSubmitting ? (
                   <div className="flex items-center gap-2 text-indigo-600 font-bold">
                      <Loader2 className="w-5 h-5 animate-spin" /> Submitting Score...
                   </div>
                ) : scoreSubmitted ? (
                   <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full border border-green-200">
                      <CheckCircle2 className="w-5 h-5" /> Score Submitted Successfully
                   </div>
                ) : (
                   <div className="flex items-center gap-2 text-red-500 font-bold">
                       Submission Failed (Will retry automatically)
                   </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setView('selection')} 
                  className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 shadow-xl transition-all flex items-center gap-2 font-bold"
                >
                  <Home className="w-5 h-5" /> Back to Menu
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className="lg:w-80 flex-shrink-0 flex flex-col h-[var(--mobile-pool-height)] lg:h-[calc(100vh-2rem)] sticky bottom-0 lg:top-4 z-30"
          style={{ '--mobile-pool-height': `${mobilePoolHeight}vh` } as React.CSSProperties}
        >
          <div className="bg-white rounded-t-xl lg:rounded-xl shadow-2xl lg:shadow-xl border-t lg:border border-gray-200 flex flex-col h-full overflow-hidden ring-1 ring-black/5">
            <div
              className="lg:hidden h-6 flex-shrink-0 flex items-center justify-center bg-gray-100 border-b border-gray-200 cursor-ns-resize touch-none"
              onPointerDown={startMobilePoolResize}
              onPointerMove={moveMobilePoolResize}
              onPointerUp={stopMobilePoolResize}
              onPointerCancel={stopMobilePoolResize}
              role="separator"
              aria-label="Drag to resize items panel"
              title="Drag to resize items panel"
            >
              <GripHorizontal className="w-7 h-4 text-gray-500" />
            </div>
            <div className="p-3 md:p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center gap-2">
              <h3 className="font-bold text-gray-700 flex items-center gap-2 min-w-0">
                <FileQuestion className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span className="truncate">Items Pool</span>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{gameState.availableItems.length}</span>
              </h3>
              <div className="lg:hidden flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setMobilePoolHeight(18)}
                  className="w-9 h-9 inline-flex items-center justify-center text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md"
                  aria-label="Shrink items panel"
                  title="Shrink items panel"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMobilePoolHeight(82)}
                  className="w-9 h-9 inline-flex items-center justify-center text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md"
                  aria-label="Expand items panel"
                  title="Expand items panel"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50/50">
              <div className="flex flex-col gap-2">
                {gameState.availableItems.map((item) => {
                  const isSelected = gameState.selectedItemId === item.id;
                  const isDragging = draggedItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onClick={() => !gameState.completed && setGameState(p => ({ ...p, selectedItemId: p.selectedItemId === item.id ? null : item.id }))}
                      className={`
                        w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 border-l-4 cursor-grab active:cursor-grabbing select-none flex justify-between items-center group
                        ${isSelected 
                          ? 'bg-indigo-600 text-white border-l-indigo-800 shadow-md scale-[1.02]' 
                          : 'bg-white text-gray-700 border-l-indigo-500 border-y border-r border-gray-200 hover:shadow-md hover:-translate-y-0.5'
                        }
                        ${isDragging ? 'opacity-40 grayscale' : 'opacity-100'}
                      `}
                    >
                      <span className={`truncate mr-2 ${underlinedItemLabels.has(item.label) ? 'underline decoration-2 underline-offset-4' : ''}`}>{item.label}</span>
                      {item.isClone ? (
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-200 font-bold uppercase tracking-wider">Penalty</span>
                      ) : (
                        <GripVertical className={`w-4 h-4 ${isSelected ? 'text-indigo-200' : 'text-gray-300 group-hover:text-indigo-400'}`}/>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}