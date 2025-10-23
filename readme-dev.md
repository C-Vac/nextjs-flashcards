✦ Here are the instructions for you (GG) to follow to update the project with the planned changes:

   1. Create Type Definitions: Create the file src/types/flashcard.d.ts and add the following content:

    1     // src/types/flashcard.d.ts
    2 
    3     export interface Card {
    4         id?: string | number; // Optional ID from original JSON, index can be fallback
    5         front: string;
    6         back: string;
    7         tags?: string[]; // Make tags optional for broader compatibility
    8     }
    9 
   10     export interface TagScore {
   11         correct: number;
   12         incorrect: number;
   13     }
   14 
   15     export type TagScores = Record<string, TagScore>;
   16 
   17     export interface Deck {
   18         id: string;
   19         name: string;
   20         cards: Card[];
   21         tagScores: TagScores;
   22     }
   23 
   24     export type AllDecks = Record<string, Deck>;
   25 
   26     export type View = 'viewer' | 'stats' | 'manage_decks' | 'settings';
   2. Refactor `NewApp.tsx` - Remove Interfaces: Remove the interface definitions (interface Card, interface TagScore, type TagScores, interface Deck, type AllDecks, 
      type View) from src/components/NewApp.tsx.
   3. Refactor `NewApp.tsx` - Import Types: Add the following import statement at the top of src/components/NewApp.tsx:
   1     import type { Card, TagScore, TagScores, Deck, AllDecks, View } from '@/types/flashcard';
   4. Create `useFlashcardPersistence` Hook: Create the file src/hooks/useFlashcardPersistence.ts and add the following content:

    1     import { useState, useEffect } from 'react';
    2     import { AllDecks, Deck, Card } from '@/types/flashcard';
    3 
    4     // --- LocalStorage Keys ---
    5     const LS_ALL_DECKS_KEY = 'flashcard_allDecks';
    6     const LS_SELECTED_DECK_ID_KEY = 'flashcard_selectedDeckId';
    7 
    8     // --- Helper: Generate Unique ID ---
    9     const generateDeckId = () => `deck_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
   10 
   11     // --- Default Data ---
   12     const createDefaultDeck = (): Deck => ({
   13         id: 'default_deck_1',
   14         name: 'Sample React/Web Dev Deck',
   15         cards: [
   16             { id: 1, front: "What is React?", back: "A JavaScript library for building user interfaces.", tags: ["react", "frontend", "javascript"] },
   17             { id: 2, front: "What is useState?", back: "A React Hook that lets you add state to functional components.", tags: ["react", "hooks"] },
   18             { id: 3, front: "What is Tailwind CSS?", back: "A utility-first CSS framework.", tags: ["css", "frontend", "styling"] },
   19             { id: 4, front: "What is TypeScript?", back: "A typed superset of JavaScript.", tags: ["javascript", "typing"] },
   20             { id: 5, front: "Purpose of useEffect?", back: "To perform side effects in functional components.", tags: ["react", "hooks", "side-effects"] },
   21             { id: 6, front: "What is JSX?", back: "A syntax extension for JavaScript, used with React.", tags: ["react", "javascript"] },
   22             { id: 7, front: "CSS Box Model (Order)", back: "Content, Padding, Border, Margin", tags: ["css", "frontend", "styling"] },
   23             { id: 8, front: "What is 'git clone'?", back: "Command to create a local copy of a remote repository.", tags: ["git", "version-control"] },
   24             { id: 9, front: "What is 'git push'?", back: "Command to upload local repository content to a remote repository.", tags: ["git", "version-control"] },
   25         ],
   26         tagScores: { /* 'strong-tag': { correct: 10, incorrect: 0 } */ } // Example initial score
   27     });
   28 
   29     export const useFlashcardPersistence = () => {
   30         const [allDecks, setAllDecks] = useState<AllDecks>({});
   31         const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
   32 
   33         // Load from localStorage on initial mount
   34         useEffect(() => {
   35             if (typeof window !== 'undefined') {
   36                 const storedDecks = localStorage.getItem(LS_ALL_DECKS_KEY);
   37                 const storedSelectedDeckId = localStorage.getItem(LS_SELECTED_DECK_ID_KEY);
   38 
   39                 if (storedDecks) {
   40                     setAllDecks(JSON.parse(storedDecks));
   41                 } else {
   42                     // Initialize with a default deck if no decks are found
   43                     const defaultDeck = createDefaultDeck();
   44                     setAllDecks({ [defaultDeck.id]: defaultDeck });
   45                     setSelectedDeckId(defaultDeck.id);
   46                 }
   47 
   48                 if (storedSelectedDeckId && JSON.parse(storedDecks || '{}')[storedSelectedDeckId]) {
   49                     setSelectedDeckId(storedSelectedDeckId);
   50                 } else if (Object.keys(JSON.parse(storedDecks || '{}')).length > 0) {
   51                     // If selected ID is invalid, pick the first available deck
   52                     setSelectedDeckId(Object.keys(JSON.parse(storedDecks || '{}'))[0]);
   53                 }
   54             }
   55         }, []);
   56 
   57         // Save allDecks to localStorage whenever it changes
   58         useEffect(() => {
   59             if (typeof window !== 'undefined') {
   60                 localStorage.setItem(LS_ALL_DECKS_KEY, JSON.stringify(allDecks));
   61             }
   62         }, [allDecks]);
   63 
   64         // Save selectedDeckId to localStorage whenever it changes
   65         useEffect(() => {
   66             if (typeof window !== 'undefined') {
   67                 if (selectedDeckId) {
   68                     localStorage.setItem(LS_SELECTED_DECK_ID_KEY, selectedDeckId);
   69                 } else {
   70                     localStorage.removeItem(LS_SELECTED_DECK_ID_KEY);
   71                 }
   72             }
   73         }, [selectedDeckId]);
   74 
   75         return {
   76             allDecks,
   77             setAllDecks,
   78             selectedDeckId,
   79             setSelectedDeckId,
   80             generateDeckId,
   81             createDefaultDeck,
   82         };
   83     };
   5. Refactor `NewApp.tsx` - Remove Persistence Logic: Remove the useState declarations for allDecks and selectedDeckId, and the useEffect hooks related to localStorage
       from src/components/NewApp.tsx. Also remove createDefaultDeck and generateDeckId if they are still present.
   6. Refactor `NewApp.tsx` - Use `useFlashcardPersistence`: In src/components/NewApp.tsx, replace the removed persistence state and effects with:

   1     import { useFlashcardPersistence } from '@/hooks/useFlashcardPersistence';
   2     // ... other imports
   3 
   4     const FlashcardApp: NextPage = () => {
   5         const { allDecks, setAllDecks, selectedDeckId, setSelectedDeckId, generateDeckId, createDefaultDeck } = useFlashcardPersistence();
   6         // ... rest of your state and logic
   7. Create `useDeckManagement` Hook: Create the file src/hooks/useDeckManagement.ts and add the following content:

     1     import { useState, useRef, useCallback } from 'react';
     2     import { AllDecks, Deck, Card, View } from '@/types/flashcard';
     3 
     4     interface UseDeckManagementProps {
     5         allDecks: AllDecks;
     6         setAllDecks: React.Dispatch<React.SetStateAction<AllDecks>>;
     7         selectedDeckId: string | null;
     8         setSelectedDeckId: React.Dispatch<React.SetStateAction<string | null>>;
     9         generateDeckId: () => string;
    10         setView: React.Dispatch<React.SetStateAction<View>>;
    11     }
    12 
    13     interface UseDeckManagementResult {
    14         fileInputRef: React.RefObject<HTMLInputElement>;
    15         editingDeckId: string | null;
    16         tempDeckName: string;
    17         handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    18         handleSelectDeck: (deckId: string) => void;
    19         handleDeleteDeck: (deckId: string) => void;
    20         handleDeckNameEdit: (deckId: string) => void;
    21         handleDeckNameSave: () => void;
    22         handleDeckNameCancel: () => void;
    23         setTempDeckName: React.Dispatch<React.SetStateAction<string>>;
    24     }
    25 
    26     export const useDeckManagement = ({ allDecks, setAllDecks, selectedDeckId, setSelectedDeckId, generateDeckId, setView }: UseDeckManagementProps): 
       UseDeckManagementResult => {
    27         const [editingDeckId, setEditingDeckId] = useState<string | null>(null); // Track which deck name is being edited
    28         const [tempDeckName, setTempDeckName] = useState<string>('');
    29         const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input
    30 
    31         const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    32             const file = event.target.files?.[0];
    33             if (!file) return;
    34 
    35             const reader = new FileReader();
    36             reader.onload = (e) => {
    37                 try {
    38                     const content = e.target?.result;
    39                     if (typeof content !== 'string') throw new Error("Failed to read file content.");
    40 
    41                     const parsedCards: Card[] = JSON.parse(content);
    42 
    43                     // Basic validation
    44                     if (!Array.isArray(parsedCards) || parsedCards.some(card => !card.front || !card.back)) {
    45                         throw new Error("Invalid flashcard JSON format. Each card must have 'front' and 'back' properties.");
    46                     }
    47 
    48                     const newDeckId = generateDeckId();
    49                     const newDeckName = file.name.replace(/\.json$/, '') || `Uploaded Deck ${Object.keys(allDecks).length + 1}`;
    50 
    51                     setAllDecks(prevDecks => ({
    52                         ...prevDecks,
    53                         [newDeckId]: {
    54                             id: newDeckId,
    55                             name: newDeckName,
    56                             cards: parsedCards.map((card, index) => ({ ...card, id: card.id || index + 1 })), // Ensure cards have IDs
    57                             tagScores: {}, // Initialize empty tag scores for new deck
    58                         },
    59                     }));
    60                     setSelectedDeckId(newDeckId);
    61                     setView('viewer'); // Go back to viewer after upload
    62                     alert(`Deck "${newDeckName}" uploaded successfully!`);
    63 
    64                 } catch (error: any) {
    65                     alert(`Error uploading deck: ${error.message}`);
    66                     console.error("File upload error:", error);
    67                 }
    68             };
    69             reader.readAsText(file);
    70             if (fileInputRef.current) {
    71                 fileInputRef.current.value = ''; // Clear the input after upload
    72             }
    73         }, [allDecks, setAllDecks, setSelectedDeckId, setView, generateDeckId]);
    74 
    75         const handleSelectDeck = useCallback((deckId: string) => {
    76             setSelectedDeckId(deckId);
    77             setView('viewer'); // Switch to viewer when a deck is selected
    78         }, [setSelectedDeckId, setView]);
    79 
    80         const handleDeleteDeck = useCallback((deckId: string) => {
    81             if (window.confirm(`Are you sure you want to delete the deck "${allDecks[deckId]?.name}"? This cannot be undone.`)) {
    82                 setAllDecks(prevDecks => {
    83                     const newDecks = { ...prevDecks };
    84                     delete newDecks[deckId];
    85 
    86                     // If the deleted deck was the selected one, select another or null
    87                     if (selectedDeckId === deckId) {
    88                         const remainingDeckIds = Object.keys(newDecks);
    89                         setSelectedDeckId(remainingDeckIds.length > 0 ? remainingDeckIds[0] : null);
    90                     }
    91                     return newDecks;
    92                 });
    93             }
    94         }, [allDecks, setAllDecks, selectedDeckId, setSelectedDeckId]);
    95 
    96         const handleDeckNameEdit = useCallback((deckId: string) => {
    97             setEditingDeckId(deckId);
    98             setTempDeckName(allDecks[deckId]?.name || '');
    99         }, [allDecks]);
   100 
   101         const handleDeckNameSave = useCallback(() => {
   102             if (editingDeckId && tempDeckName.trim() !== '') {
   103                 setAllDecks(prevDecks => ({
   104                     ...prevDecks,
   105                     [editingDeckId]: {
   106                         ...prevDecks[editingDeckId],
   107                         name: tempDeckName.trim(),
   108                     },
   109                 }));
   110                 setEditingDeckId(null);
   111                 setTempDeckName('');
   112             } else {
   113                 alert("Deck name cannot be empty.");
   114             }
   115         }, [editingDeckId, tempDeckName, setAllDecks]);
   116 
   117         const handleDeckNameCancel = useCallback(() => {
   118             setEditingDeckId(null);
   119             setTempDeckName('');
   120         }, []);
   121 
   122         return {
   123             fileInputRef,
   124             editingDeckId,
   125             tempDeckName,
   126             handleFileUpload,
   127             handleSelectDeck,
   128             handleDeleteDeck,
   129             handleDeckNameEdit,
   130             handleDeckNameSave,
   131             handleDeckNameCancel,
   132             setTempDeckName,
   133         };
   134     };
   8. Refactor `NewApp.tsx` - Remove Deck Management Logic and Use Hook:
       * Remove the useState declarations for editingDeckId and tempDeckName.
       * Remove the useRef for fileInputRef.
       * Remove the handleFileUpload, handleSelectDeck, handleDeleteDeck, handleDeckNameEdit, handleDeckNameSave, and handleDeckNameCancel functions.
       * Import and use the useDeckManagement hook:

   1         import { useDeckManagement } from '@/hooks/useDeckManagement';
   2         // ... other imports
   3 
   4         const FlashcardApp: NextPage = () => {
   5             const { allDecks, setAllDecks, selectedDeckId, setSelectedDeckId, generateDeckId, createDefaultDeck } = useFlashcardPersistence();
   6             const { fileInputRef, editingDeckId, tempDeckName, handleFileUpload, handleSelectDeck, handleDeleteDeck, handleDeckNameEdit, handleDeckNameSave, 
     handleDeckNameCancel, setTempDeckName } = useDeckManagement({ allDecks, setAllDecks, selectedDeckId, setSelectedDeckId, generateDeckId, setView });
   7             // ... rest of your state and logic
   9. Update `DEVELOPMENT.md`: The DEVELOPMENT.md file has been created with an initial architectural overview. Review its content and expand upon it as needed, 
      especially regarding the chosen backend technology and detailed AI integration plans.
   10. Update `README.md`: The README.md file has been updated to include a section about AI capabilities and a link to DEVELOPMENT.md. Review and refine this section to 
       accurately reflect the project's new direction.