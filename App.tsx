import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DraggableItem, RowConfig, DropZoneConfig, GameState, LedgerSideConfig } from './types';
import { LEVELS } from './constants';
import { FileQuestion, CheckCircle2, Award, GripVertical, ChevronRight, BookOpen, ArrowLeft, Play, User, Trophy, Send, Loader2, Home, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

// Reverted to executable Web App URL because /library/ URLs cannot receive POST requests
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyDkx8Ilow9slV-gbMEL2VV4UCdMvwDrtD6fTD_zdlrwAZuKeOQ-M38reizxvGh_9fzWw/exec";

type ViewState = 'welcome' | 'selection' | 'game';

const Header = ({ 
  currentLevel, 
  studentName, 
  onBack 
}: { 
  currentLevel: number, 
  studentName: string, 
  onBack: () => void 
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
            <span className="text-yellow-500">Mastering Akaun</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-medium">Player: <span className="text-white">{studentName}</span></p>
        </div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-center md:text-right">
         <span className="text-xs text-slate-400 uppercase tracking-widest block">Current Level</span>
         <span className="font-bold text-yellow-400">{LEVELS[currentLevel].title}</span>
      </div>
    </div>
  </div>
);

const WelcomeScreen = ({ onStart }: { onStart: (name: string) => void }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onStart(name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-indigo-600 p-8 text-center">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Prinsip Akaun Master</h1>
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
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
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

    const items: DraggableItem[] = activeLabels.map((label, index) => ({
      id: `item-${index}-${label.replace(/\s/g, '')}-${currentLevel}`,
      label,
      isClone: false,
    })).sort(() => Math.random() - 0.5);

    setGameState(prev => ({
      ...prev,
      availableItems: items,
    }));
  }, [currentLevel, activeLabels, view, layoutType, activeStructure]);

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

  useEffect(() => {
    if (view !== 'game') return;
    if (layoutType === 'formula') return; 

    const allZones: DropZoneConfig[] = [];
    if (layoutType === 'statement') {
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

    const totalZones = allZones.filter(z => z.expectedLabels.length > 0).length;
    if (totalZones === 0) return;

    const filledCorrectly = Object.keys(gameState.placedItems).length;
    
    if (filledCorrectly === totalZones && !gameState.isVictoryDelayed && !gameState.completed) {
      setGameState(prev => ({ ...prev, isVictoryDelayed: true }));
    }
  }, [gameState.placedItems, gameState.completed, gameState.isVictoryDelayed, activeStructure, view, layoutType, graphZones]);

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
      if (layoutType === 'statement' || layoutType === 'formula') {
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
  }, [gameState.availableItems, gameState.placedItems, gameState.completed, activeStructure, layoutType, graphZones]);

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
         if (layoutType === 'statement' || layoutType === 'formula') {
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
            ${isAbsolute ? 'absolute shadow-lg z-10' : 'relative'}
            h-12 flex items-center justify-center rounded-md px-2 select-none transition-all duration-200 border-2
            ${bgClass} ${textStyle} ${zone.widthClass} shadow-sm cursor-pointer
          `}
        >
          {content ? (
            <span className="flex items-center gap-2 w-full justify-center animate-in fade-in zoom-in duration-200 whitespace-nowrap overflow-hidden font-semibold">
              {content}
              {status === 'correct' && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
            </span>
          ) : (
            <span className="text-gray-400 text-xs font-medium w-full text-center tracking-wide uppercase">
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

  const renderStatementRow = (row: RowConfig) => {
    const showRedLine = row.hasBottomBorder;
    const showDoubleLine = row.isTotal;
    const indentClass = row.indent === 1 ? "pl-8" : "";
    
    return (
      <tr key={row.id} className="min-h-[3.5rem] hover:bg-slate-50 transition-colors group">
        <td className="py-3 pr-4 w-3/5 pl-2">
          <div className={`flex items-center gap-2 ${indentClass} h-full border-b border-transparent group-hover:border-slate-200`}>
            {row.zones.map((zone, idx) => renderZone(zone, idx, row))}
          </div>
        </td>

        {[0, 1, 2].map((colIdx) => {
           const customZone = row.columnZones?.[colIdx];
           const isLastColumn = colIdx === 2;
           return (
             <td key={colIdx} className={`w-[13%] align-bottom px-0 py-0 relative ${!isLastColumn ? 'border-r border-gray-100' : ''}`}>
               <div className="flex flex-col justify-end w-full h-full px-2 py-3">
                  {customZone ? (
                     renderZone(customZone, 0, { ...row, isHeader: true, isUnderlined: false })
                  ) : (
                    <div className={`
                        w-full text-right font-mono-numbers text-lg text-gray-900 tracking-tight
                        ${row.columnIndex === colIdx && showRedLine ? "border-b border-gray-800" : ""}
                        ${row.columnIndex === colIdx && showDoubleLine ? "border-b-4 border-double border-gray-900" : ""}
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

    const renderSide = (sideConfig?: LedgerSideConfig, isRight?: boolean) => {
      if (!sideConfig) return null;
      if (isTotal) {
         return (
           <>
             <td className="bg-transparent border-r border-transparent"></td>
             <td className="bg-transparent border-r border-transparent"></td>
             <td className={`${amountClasses} ${cellText} ${borderRight}`}>{sideConfig.col1}</td>
             <td className={`${amountClasses} ${cellText} ${isRight ? '' : borderRightThick}`}>{sideConfig.col2}</td>
           </>
         );
      }
      return (
        <>
          <td className={`p-1 text-gray-500 text-xs font-mono text-center w-[10%] ${borderRight}`}>{sideConfig.date}</td>
          <td className={`p-1 w-[50%] ${borderRight}`}>
            {sideConfig.zone 
              ? renderZone(sideConfig.zone, 0, null, true) 
              : <div className="h-10 flex items-center px-2 font-semibold text-gray-700 text-sm">{sideConfig.staticLabel}</div>
            }
          </td>
          <td className={`${amountClasses} ${cellText} ${borderRight}`}>{sideConfig.col1}</td>
          <td className={`${amountClasses} ${cellText} ${isRight ? '' : borderRightThick}`}>{sideConfig.col2}</td>
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
      // Changed: Removed overflow-hidden to allow labels to bleed out if needed, added padding logic via SVG positioning
      <div className="relative w-full aspect-[4/3] bg-white rounded-lg shadow-inner border border-gray-200">
        <svg viewBox="0 0 800 600" className="w-full h-full absolute inset-0 pointer-events-none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0f2fe" strokeWidth="1"/>
            </pattern>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="black" />
            </marker>
            <marker id="red-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
            </marker>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Main Axes (Shifted Origin to 100, 500) */}
          <line x1="100" y1="500" x2="100" y2="50" stroke="black" strokeWidth="3" markerEnd="url(#arrow)" />
          <line x1="100" y1="500" x2="750" y2="500" stroke="black" strokeWidth="3" markerEnd="url(#arrow)" />
          
          {/* Intersection Point: (400, 275) */}
          
          {/* Areas */}
          {/* Profit Area (Blue): Between Rev and Cost above intersection */}
          <polygon points="400,275 700,50 700,150" fill="rgba(59, 130, 246, 0.2)" stroke="none" />
          {/* Loss Area (Red): Between Rev and Cost below intersection */}
          <polygon points="100,500 100,400 400,275" fill="rgba(239, 68, 68, 0.2)" stroke="none" />
          
          {/* Graph Lines */}
          {/* Fixed Cost (Flat): 100,400 -> 750,400 */}
          <line x1="100" y1="400" x2="700" y2="400" stroke="#374151" strokeWidth="3" />
          
          {/* Total Cost: Starts at Fixed Cost (100, 400) -> Thru (400, 275) -> End (700, 150) */}
          <line x1="100" y1="400" x2="700" y2="150" stroke="#1f2937" strokeWidth="3" />
          
          {/* Total Revenue: Starts at 0 (100, 500) -> Thru (400, 275) -> End (700, 50) */}
          <line x1="100" y1="500" x2="700" y2="50" stroke="#111827" strokeWidth="3" />
          
          {/* Dashed Lines for Intersection */}
          <line x1="400" y1="275" x2="400" y2="500" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="100" y1="275" x2="400" y2="275" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
          <circle cx="400" cy="275" r="4" fill="#ef4444" />

          {/* Arrows */}
          
          {/* 1. Y-Axis Label Pointer (From HTML at 2%,0% -> approx 90,30) */}
          <path d="M 120,50 L 105,40" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#red-arrow)" />

          {/* 2. X-Axis Label Pointer (From HTML at 2%,0% -> approx 700,560) */}
          <path d="M 700,550 L 720,520" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#red-arrow)" />

          {/* 3. TPM Pointer (Left to Intersection) */}
          {/* TPM Box at left:5%, top:35% -> approx x=40, y=210. Intersection is 400,275 */}
          <path d="M 220,230 L 390,270" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#red-arrow)" />

          {/* 4. Untung (Top Mid -> Blue Area) */}
          {/* Box at left:45%, top:15% -> approx x=360, y=90. Area center approx 550, 150 */}
          {/* Updated target to (550, 185) to be solidly in the blue area */}
          <path d="M 450,130 L 550,185" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#red-arrow)" />

          {/* 5. Rugi (Bottom Left -> Red Area) */}
          {/* Box at left:15%, bottom:15% -> approx x=120, y=510. Area center approx 200, 390 */}
          {/* Updated target to (220, 380) to be solidly in the red area */}
          <path d="M 180,500 L 220,380" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#red-arrow)" />

          {/* 6. Jumlah Hasil (Top Right) */}
          <path d="M 720,60 L 680,55" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#red-arrow)" />

          {/* 7. Jumlah Kos (Mid Right) */}
          <path d="M 720,160 L 680,155" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#red-arrow)" />

          {/* 8. Kos Tetap (Bottom Right) */}
          <path d="M 720,440 L 680,405" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#red-arrow)" />

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-200 select-none font-sans">
      <Header currentLevel={currentLevel} studentName={studentName} onBack={() => setView('selection')} />

      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full">
        <div className="flex-grow bg-white shadow-2xl rounded-lg overflow-hidden relative min-h-[600px] flex flex-col">
          <div className="text-center pt-8 pb-4 bg-white border-b border-gray-100 px-4">
            <h2 className="font-extrabold text-xl md:text-2xl uppercase tracking-widest text-gray-900 mb-1">Perniagaan Hakim Berjaya</h2>
            <h3 className="font-semibold text-sm md:text-base text-gray-500 uppercase tracking-wide">{activeSubtitle}</h3>
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
            {layoutType === 'statement' ? (
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
                  {activeStructure.map(renderStatementRow)}
                </tbody>
              </table>
            ) : layoutType === 'ledger' ? (
              <table className="w-full text-sm border-collapse min-w-[800px]">
                <thead className="bg-indigo-50 border-b-2 border-indigo-100">
                  <tr>
                    <th colSpan={4} className="py-2 border-r border-gray-900 text-center font-bold text-indigo-900 uppercase tracking-wider">Debit</th>
                    <th colSpan={4} className="py-2 text-center font-bold text-indigo-900 uppercase tracking-wider">Credit</th>
                  </tr>
                  <tr className="text-xs text-gray-500 uppercase tracking-wider">
                    <th className="p-2 border-r border-gray-200">Tarikh</th>
                    <th className="p-2 border-r border-gray-200 w-1/4">Butiran</th>
                    <th className="p-2 border-r border-gray-200">Sarah</th>
                    <th className="p-2 border-r border-gray-900">Helmi</th>
                    <th className="p-2 border-r border-gray-200">Tarikh</th>
                    <th className="p-2 border-r border-gray-200 w-1/4">Butiran</th>
                    <th className="p-2 border-r border-gray-200">Sarah</th>
                    <th className="p-2">Helmi</th>
                  </tr>
                </thead>
                <tbody>
                  {activeStructure.map(renderLedgerRow)}
                </tbody>
              </table>
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

        <div className="lg:w-80 flex-shrink-0 flex flex-col h-[35vh] lg:h-[calc(100vh-2rem)] sticky bottom-0 lg:top-4 z-30">
          <div className="bg-white rounded-t-xl lg:rounded-xl shadow-2xl lg:shadow-xl border-t lg:border border-gray-200 flex flex-col h-full overflow-hidden ring-1 ring-black/5">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-indigo-500" />
                Items Pool <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full ml-1">{gameState.availableItems.length}</span>
              </h3>
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
                      <span className="truncate mr-2">{item.label}</span>
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