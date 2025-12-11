import { RowConfig, LevelConfig, DropZoneConfig } from './types';

// --- HELPERS ---

const single = (id: string, label: string, num: string, col: 0|1|2, indent = 0, opts: Partial<RowConfig> = {}): RowConfig => ({
  id,
  zones: [{ id: `${id}_zone`, expectedLabels: [label], widthClass: 'w-full' }],
  displayNumber: num,
  columnIndex: col,
  indent,
  ...opts
});

const operatorRow = (id: string, op: string, label: string, num: string, col: 0|1|2, indent = 0, opts: Partial<RowConfig> = {}): RowConfig => ({
  id,
  zones: [
    { id: `${id}_op`, expectedLabels: [op], widthClass: 'w-20' },
    { id: `${id}_item`, expectedLabels: [label], widthClass: 'flex-1' }
  ],
  displayNumber: num,
  columnIndex: col,
  indent,
  ...opts
});

const swappableRow = (id: string, validLabels: string[], groupName: string, num: string, col: 0|1|2, indent = 0, opts: Partial<RowConfig> = {}): RowConfig => ({
  id,
  zones: [{ id: `${id}_zone`, expectedLabels: validLabels, widthClass: 'w-full', group: groupName }],
  displayNumber: num,
  columnIndex: col,
  indent,
  ...opts
});

const headerRow = (id: string, label: string, opts: Partial<RowConfig> = {}): RowConfig => ({
  id,
  zones: [{ id: `${id}_zone`, expectedLabels: [label], widthClass: 'w-full' }],
  displayNumber: '',
  columnIndex: 2,
  isHeader: true,
  isUnderlined: true,
  indent: 0,
  ...opts
});

const ledgerRow = (id: string, left: any, right: any, opts: Partial<RowConfig> = {}): RowConfig => ({
  id,
  zones: [], // Not used in ledger mode
  displayNumber: '',
  columnIndex: 0,
  ledgerLeft: left,
  ledgerRight: right,
  ...opts
});

const formulaRow = (id: string, title: string, num: string, den: string, mult: string = "", customLayout?: RowConfig['formulaCustomLayout'], extraZones?: DropZoneConfig[]): RowConfig => {
  const defaultZones = [
    { id: `${id}_num`, expectedLabels: [num], widthClass: 'w-64' },
    { id: `${id}_den`, expectedLabels: [den], widthClass: 'w-64' }
  ];

  return {
    id,
    zones: extraZones || defaultZones,
    displayNumber: '', 
    columnIndex: 0,
    formulaTitle: title,
    formulaMultiplier: mult,
    formulaCustomLayout: customLayout
  };
};


// --- LEVEL 1: TRADING ACCOUNT ---

const costAdditions = ['Angkutan Masuk', 'Upah atas belian', 'Duti import', 'Insurans atas belian'];

const LEVEL_1_LABELS = [
  "Jualan",
  "Tolak", "Pulangan Jualan", 
  "Jualan Bersih",
  "Tolak", "Kos Jualan", 
  "Inventori Awal",
  "Belian",
  "Tolak", "Pulangan Belian", 
  "Belian Bersih",
  "Tambah", 
  "Angkutan Masuk",
  "Upah atas belian",
  "Duti import",
  "Insurans atas belian",
  "Kos Belian",
  "Kos Barang untuk Dijual",
  "Tolak", "Inventori Akhir",
  "Kos Jualan",
  "Untung Kasar"
];

const LEVEL_1_STRUCTURE: RowConfig[] = [
  single('row_jualan', 'Jualan', 'x', 2),
  operatorRow('row_pul_jualan', 'Tolak', 'Pulangan Jualan', '(x)', 2, 0, { hasBottomBorder: true }),
  single('row_jualan_bersih', 'Jualan Bersih', 'xx', 2),
  
  {
    id: 'header_kos_jualan',
    zones: [
      { id: 'h_op', expectedLabels: ['Tolak'], widthClass: 'w-20' },
      { id: 'h_item', expectedLabels: ['Kos Jualan'], widthClass: 'flex-1' }
    ],
    displayNumber: '',
    columnIndex: 0,
    isHeader: true,
    indent: 0
  },
  
  single('row_inv_awal', 'Inventori Awal', 'x', 1),
  single('row_belian', 'Belian', 'x', 0),
  operatorRow('row_pul_belian', 'Tolak', 'Pulangan Belian', '(x)', 0, 0, { hasBottomBorder: true }),
  single('row_belian_bersih', 'Belian Bersih', 'xx', 0),
  
  {
    id: 'add_1',
    zones: [
      { id: 'add_1_op', expectedLabels: ['Tambah'], widthClass: 'w-20' },
      { id: 'add_1_item', expectedLabels: costAdditions, widthClass: 'flex-1', group: 'cost_add' }
    ],
    displayNumber: 'x',
    columnIndex: 0,
    indent: 0
  },
  {
    id: 'add_2',
    zones: [
      { id: 'add_2_spacer', expectedLabels: [], widthClass: 'w-20', placeholder: '' },
      { id: 'add_2_item', expectedLabels: costAdditions, widthClass: 'flex-1', group: 'cost_add' }
    ],
    displayNumber: 'x',
    columnIndex: 0,
    indent: 0
  },
  {
    id: 'add_3',
    zones: [
      { id: 'add_3_spacer', expectedLabels: [], widthClass: 'w-20', placeholder: '' },
      { id: 'add_3_item', expectedLabels: costAdditions, widthClass: 'flex-1', group: 'cost_add' }
    ],
    displayNumber: 'x',
    columnIndex: 0,
    indent: 0
  },
  {
    id: 'add_4',
    zones: [
      { id: 'add_4_spacer', expectedLabels: [], widthClass: 'w-20', placeholder: '' },
      { id: 'add_4_item', expectedLabels: costAdditions, widthClass: 'flex-1', group: 'cost_add' }
    ],
    displayNumber: 'x',
    columnIndex: 0,
    indent: 0,
    hasBottomBorder: true
  },
  
  single('row_kos_belian', 'Kos Belian', 'xx', 1, 0, { hasBottomBorder: true }),
  single('row_kos_barang', 'Kos Barang untuk Dijual', 'xx', 1),
  operatorRow('row_inv_akhir', 'Tolak', 'Inventori Akhir', '(x)', 1, 0, { hasBottomBorder: true }),
  single('row_kos_jualan_res', 'Kos Jualan', '(xx)', 2, 0, { hasBottomBorder: true }),
  single('row_untung_kasar', 'Untung Kasar', 'xx', 2, 0, { isTotal: true })
];

// --- LEVEL 2: PROFIT & LOSS ---

const revenues = ['Diskaun Diterima', 'Komisen'];
const expenses = ['Diskaun Diberi', 'Promosi', 'Sewa', 'Insurans', 'Gaji', 'Belanja Am', 'Alat Tulis'];

const LEVEL_2_LABELS = [
  "Untung Kasar",
  "Tambah", "Hasil",
  "Diskaun Diterima",
  "Komisen",
  "Tolak", "Belanja",
  "Diskaun Diberi",
  "Promosi",
  "Sewa",
  "Insurans",
  "Gaji",
  "Belanja Am",
  "Alat Tulis",
  "Untung Bersih"
];

const LEVEL_2_STRUCTURE: RowConfig[] = [
  single('l2_uk', 'Untung Kasar', 'xx', 2, 0, { isHeader: true }),

  {
    id: 'l2_add_hasil',
    zones: [
      { id: 'l2_add_op', expectedLabels: ['Tambah'], widthClass: 'w-20' },
      { id: 'l2_hasil_lbl', expectedLabels: ['Hasil'], widthClass: 'flex-1' }
    ],
    displayNumber: '',
    columnIndex: 0,
    indent: 0,
    isHeader: true,
    isItalic: true,
    isUnderlined: true
  },

  swappableRow('l2_rev_1', revenues, 'l2_revenues', 'x', 1),
  swappableRow('l2_rev_2', revenues, 'l2_revenues', 'x', 1, 0, { hasBottomBorder: true }),
  
  {
    id: 'l2_rev_subtotal_calc',
    zones: [{ id: 'l2_rev_sub_spacer', expectedLabels: [], widthClass: 'w-full', placeholder: '' }],
    displayNumber: 'xx',
    columnIndex: 2,
    indent: 0,
    isSpacer: true,
    hasBottomBorder: true
  },
  
  {
    id: 'l2_adjusted_gross',
    zones: [{ id: 'l2_adj_spacer', expectedLabels: [], widthClass: 'w-full', placeholder: '' }],
    displayNumber: 'xx',
    columnIndex: 2,
    indent: 0,
    isSpacer: true
  },

  {
    id: 'l2_less_belanja',
    zones: [
      { id: 'l2_less_op', expectedLabels: ['Tolak'], widthClass: 'w-20' },
      { id: 'l2_belanja_lbl', expectedLabels: ['Belanja'], widthClass: 'flex-1' }
    ],
    displayNumber: '',
    columnIndex: 0,
    indent: 0,
    isHeader: true,
    isItalic: true,
    isUnderlined: true
  },

  swappableRow('l2_exp_1', expenses, 'l2_expenses', 'x', 1),
  swappableRow('l2_exp_2', expenses, 'l2_expenses', 'x', 1),
  swappableRow('l2_exp_3', expenses, 'l2_expenses', 'x', 1),
  swappableRow('l2_exp_4', expenses, 'l2_expenses', 'x', 1),
  swappableRow('l2_exp_5', expenses, 'l2_expenses', 'x', 1),
  swappableRow('l2_exp_6', expenses, 'l2_expenses', 'x', 1),
  swappableRow('l2_exp_7', expenses, 'l2_expenses', 'x', 1, 0, { hasBottomBorder: true }),

  {
    id: 'l2_exp_total',
    zones: [{ id: 'l2_exp_sub_spacer', expectedLabels: [], widthClass: 'w-full', placeholder: '' }],
    displayNumber: '(xx)',
    columnIndex: 2,
    indent: 0,
    isSpacer: true,
    hasBottomBorder: true
  },

  single('l2_net_profit', 'Untung Bersih', 'xx', 2, 0, { isTotal: true, isHeader: true })
];

// --- LEVEL 3: COMBINED ---

const LEVEL_3_LABELS = [
  ...LEVEL_1_LABELS,
  "Tambah", "Hasil",
  "Diskaun Diterima",
  "Komisen",
  "Tolak", "Belanja",
  "Diskaun Diberi",
  "Promosi",
  "Sewa",
  "Insurans",
  "Gaji",
  "Belanja Am",
  "Alat Tulis",
  "Untung Bersih"
];

const LEVEL_3_STRUCTURE: RowConfig[] = [
  ...LEVEL_1_STRUCTURE.slice(0, -1),
  single('l3_uk_bridge', 'Untung Kasar', 'xx', 2, 0, { isHeader: true }),
  ...LEVEL_2_STRUCTURE.slice(1)
];

// --- LEVEL 4: BALANCE SHEET ---

const LEVEL_4_LABELS = [
  "Aset Bukan Semasa",
  "Alatan Pejabat",
  "Kenderaan",
  "Aset Semasa",
  "Inventori Akhir",
  "Akaun Belum Terima",
  "Bank",
  "Tunai",
  "Tolak", "Liabiliti Semasa",
  "Akaun Belum Bayar",
  "Modal Kerja",
  "Ekuiti Pemilik",
  "Modal Awal",
  "Tambah", "Untung Bersih",
  "Tolak", "Ambilan",
  "Modal Akhir",
  "Liabiliti Bukan Semasa",
  "Pinjaman"
];

const l4_abs_items = ["Alatan Pejabat", "Kenderaan"];
const l4_as_items = ["Inventori Akhir", "Akaun Belum Terima", "Bank", "Tunai"];

const LEVEL_4_STRUCTURE: RowConfig[] = [
  headerRow('l4_abs_header', 'Aset Bukan Semasa'),
  swappableRow('l4_alatan', l4_abs_items, 'l4_abs', 'x', 2), 
  swappableRow('l4_kenderaan', l4_abs_items, 'l4_abs', 'x', 2, 0, { hasBottomBorder: true }),
  
  { id: 'l4_abs_total', zones: [], displayNumber: 'xx', columnIndex: 2, isSpacer: true },

  headerRow('l4_as_header', 'Aset Semasa'),
  swappableRow('l4_inv_akhir', l4_as_items, 'l4_as', 'x', 1),
  swappableRow('l4_abt', l4_as_items, 'l4_as', 'x', 1),
  swappableRow('l4_bank', l4_as_items, 'l4_as', 'x', 1),
  swappableRow('l4_tunai', l4_as_items, 'l4_as', 'x', 1, 0, { hasBottomBorder: true }),
  
  { id: 'l4_as_total', zones: [], displayNumber: 'xx', columnIndex: 1, isSpacer: true },

  {
    id: 'l4_less_ls',
    zones: [
      { id: 'l4_ls_op', expectedLabels: ['Tolak'], widthClass: 'w-20' },
      { id: 'l4_ls_lbl', expectedLabels: ['Liabiliti Semasa'], widthClass: 'flex-1' }
    ],
    displayNumber: '',
    columnIndex: 0,
    isHeader: true,
    isUnderlined: true,
    indent: 0
  },
  
  single('l4_abb', 'Akaun Belum Bayar', '(x)', 1, 0, { hasBottomBorder: true }),
  single('l4_modal_kerja', 'Modal Kerja', 'xx', 2, 0, { hasBottomBorder: true }),
  
  { id: 'l4_total_assets', zones: [], displayNumber: 'xx', columnIndex: 2, isTotal: true, isSpacer: true },

  headerRow('l4_ep_header', 'Ekuiti Pemilik'),
  single('l4_modal_awal', 'Modal Awal', 'x', 2),
  
  operatorRow('l4_add_ub', 'Tambah', 'Untung Bersih', 'x', 2, 0, { hasBottomBorder: true }),
  
  { id: 'l4_ep_subtotal', zones: [], displayNumber: 'xx', columnIndex: 2, isSpacer: true },
  
  operatorRow('l4_less_ambilan', 'Tolak', 'Ambilan', '(x)', 2, 0, { hasBottomBorder: true }),
  single('l4_modal_akhir', 'Modal Akhir', 'xx', 2),

  headerRow('l4_lbs_header', 'Liabiliti Bukan Semasa'),
  single('l4_pinjaman', 'Pinjaman', 'x', 2, 0, { hasBottomBorder: true }),

  { id: 'l4_final_total', zones: [], displayNumber: 'xx', columnIndex: 2, isTotal: true, isSpacer: true }
];

// --- LEVEL 5: COMBINED (PELARASAN) ---

const expensesAdj = [
  ...expenses,
  'Hutang Lapuk', 'Hutang Ragu', 'Susut Nilai Kenderaan', 'Susut Nilai Alatan Pejabat'
];

const LEVEL_5_LABELS = [
  ...LEVEL_1_LABELS,
  "Tambah", "Hasil",
  "Diskaun Diterima",
  "Komisen",
  "Tolak", "Belanja",
  ...expensesAdj,
  "Untung Bersih"
];

const LEVEL_5_STRUCTURE: RowConfig[] = [
  ...LEVEL_1_STRUCTURE.slice(0, -1),
  single('l5_uk_bridge', 'Untung Kasar', 'xx', 2, 0, { isHeader: true }),
  
  // Level 5 specific Profit & Loss
  {
    id: 'l5_add_hasil',
    zones: [
      { id: 'l5_add_op', expectedLabels: ['Tambah'], widthClass: 'w-20' },
      { id: 'l5_hasil_lbl', expectedLabels: ['Hasil'], widthClass: 'flex-1' }
    ],
    displayNumber: '',
    columnIndex: 0,
    indent: 0,
    isHeader: true,
    isItalic: true,
    isUnderlined: true
  },

  swappableRow('l5_rev_1', revenues, 'l5_revenues', 'x', 1),
  swappableRow('l5_rev_2', revenues, 'l5_revenues', 'x', 1, 0, { hasBottomBorder: true }),
  
  { id: 'l5_rev_subtotal_calc', zones: [], displayNumber: 'xx', columnIndex: 2, isSpacer: true, hasBottomBorder: true },
  { id: 'l5_adjusted_gross', zones: [], displayNumber: 'xx', columnIndex: 2, isSpacer: true },

  {
    id: 'l5_less_belanja',
    zones: [
      { id: 'l5_less_op', expectedLabels: ['Tolak'], widthClass: 'w-20' },
      { id: 'l5_belanja_lbl', expectedLabels: ['Belanja'], widthClass: 'flex-1' }
    ],
    displayNumber: '',
    columnIndex: 0,
    indent: 0,
    isHeader: true,
    isItalic: true,
    isUnderlined: true
  },

  // 11 Expense rows
  ...Array.from({ length: 11 }).map((_, i) => 
    swappableRow(`l5_exp_${i}`, expensesAdj, 'l5_expenses', 'x', 1, 0, i === 10 ? { hasBottomBorder: true } : {})
  ),

  { id: 'l5_exp_total', zones: [], displayNumber: '(xx)', columnIndex: 2, isSpacer: true, hasBottomBorder: true },

  single('l5_net_profit', 'Untung Bersih', 'xx', 2, 0, { isTotal: true, isHeader: true })
];

// --- LEVEL 6: BALANCE SHEET (PELARASAN) ---

const LEVEL_6_LABELS = [
  "Aset Bukan Semasa", "Kos", "Susut Nilai Terkumpul", "Nilai Buku",
  "Kenderaan", "Alatan Pejabat",
  "Aset Semasa",
  "Inventori Akhir",
  "Akaun Belum Terima", "Tolak", "Peruntukan Hutang Ragu",
  "Bank", "Tunai", "Komisen Belum Terperoleh",
  "Liabiliti Semasa",
  "Akaun Belum Bayar", "Belanja Am Belum Bayar",
  "Modal Kerja",
  "Ekuiti Pemilik", "Modal Awal", "Untung Bersih", "Ambilan", "Modal Akhir",
  "Liabiliti Bukan Semasa", "Pinjaman"
];

const l6_abs_items = ["Kenderaan", "Alatan Pejabat"];
const l6_as_swappable = ["Inventori Akhir", "Bank", "Tunai", "Komisen Belum Terperoleh"];
const l6_ls_items = ["Akaun Belum Bayar", "Belanja Am Belum Bayar"];

const LEVEL_6_STRUCTURE: RowConfig[] = [
  headerRow('l6_abs_header', 'Aset Bukan Semasa'),

  {
    id: 'l6_abs_cols',
    zones: [], 
    displayNumber: '',
    columnIndex: 0,
    columnZones: {
      0: { id: 'l6_col_kos', expectedLabels: ['Kos'], widthClass: 'w-full' },
      1: { id: 'l6_col_snt', expectedLabels: ['Susut Nilai Terkumpul'], widthClass: 'w-full' },
      2: { id: 'l6_col_nb', expectedLabels: ['Nilai Buku'], widthClass: 'w-full' },
    }
  },

  swappableRow('l6_kenderaan', l6_abs_items, 'l6_abs', '', 0, 0, {
    columnZones: {
      0: { id: 'l6_ken_kos', expectedLabels: [], widthClass: '', placeholder: 'x' }, 
      1: { id: 'l6_ken_snt', expectedLabels: [], widthClass: '', placeholder: '(x)' },
      2: { id: 'l6_ken_nb', expectedLabels: [], widthClass: '', placeholder: 'x' }
    }
  }),

  swappableRow('l6_alatan', l6_abs_items, 'l6_abs', '', 0, 0, {
    columnZones: {
      0: { id: 'l6_ap_kos', expectedLabels: [], widthClass: '', placeholder: 'x' },
      1: { id: 'l6_ap_snt', expectedLabels: [], widthClass: '', placeholder: '(x)' },
      2: { id: 'l6_ap_nb', expectedLabels: [], widthClass: '', placeholder: 'x' }
    },
    hasBottomBorder: true
  }),

  { id: 'l6_abs_total', zones: [], displayNumber: 'xx', columnIndex: 2, isSpacer: true },

  headerRow('l6_as_header', 'Aset Semasa'),
  
  // ABT & PHR at Column 0 (Fixed Position due to PHR dependency)
  single('l6_abt', 'Akaun Belum Terima', 'x', 0),
  operatorRow('l6_phr', 'Tolak', 'Peruntukan Hutang Ragu', '(x)', 0, 0, { hasBottomBorder: true }),
  { id: 'l6_net_abt', zones: [], displayNumber: 'x', columnIndex: 1, isSpacer: true }, // Result moved to Col 1

  // Swappable AS items moved to Col 1
  swappableRow('l6_inv_img', l6_as_swappable, 'l6_as_gen', 'x', 1),
  swappableRow('l6_bank', l6_as_swappable, 'l6_as_gen', 'x', 1),
  swappableRow('l6_tunai', l6_as_swappable, 'l6_as_gen', 'x', 1),
  swappableRow('l6_kbt', l6_as_swappable, 'l6_as_gen', 'x', 1, 0, { hasBottomBorder: true }),

  { id: 'l6_as_total', zones: [], displayNumber: 'xx', columnIndex: 1, isSpacer: true },

  {
    id: 'l6_less_ls',
    zones: [
      { id: 'l6_ls_op', expectedLabels: ['Tolak'], widthClass: 'w-20' },
      { id: 'l6_ls_lbl', expectedLabels: ['Liabiliti Semasa'], widthClass: 'flex-1' }
    ],
    displayNumber: '',
    columnIndex: 0,
    isHeader: true,
    isUnderlined: true,
    indent: 0
  },
  
  // LS Items moved to Col 0 (Was Col 1)
  swappableRow('l6_abb', l6_ls_items, 'l6_ls', 'x', 0),
  swappableRow('l6_babb', l6_ls_items, 'l6_ls', 'x', 0, 0, { hasBottomBorder: true }),
  
  // LS Total moved to Col 1 (Was Col 1, but now serves as summary for Col 0 items)
  { id: 'l6_ls_total', zones: [], displayNumber: '(xx)', columnIndex: 1, isSpacer: true, hasBottomBorder: true },

  single('l6_modal_kerja', 'Modal Kerja', 'xx', 2, 0, { hasBottomBorder: true }),
  
  { id: 'l6_total_assets_final', zones: [], displayNumber: 'xx', columnIndex: 2, isTotal: true, isSpacer: true },

  headerRow('l6_ep_header', 'Ekuiti Pemilik'),
  single('l6_ma', 'Modal Awal', 'x', 2),
  single('l6_ub', 'Untung Bersih', 'x', 2, 0, { hasBottomBorder: true }),
  { id: 'l6_ep_sub', zones: [], displayNumber: 'xx', columnIndex: 2, isSpacer: true },
  operatorRow('l6_amb', 'Tolak', 'Ambilan', '(x)', 2, 0, { hasBottomBorder: true }),
  single('l6_ma_end', 'Modal Akhir', 'xx', 2),

  headerRow('l6_lbs_header', 'Liabiliti Bukan Semasa'),
  single('l6_pinjaman', 'Pinjaman', 'x', 2, 0, { hasBottomBorder: true }),
  { id: 'l6_final_total', zones: [], displayNumber: 'xx', columnIndex: 2, isTotal: true, isSpacer: true }
];

// --- LEVEL 7: AKAUN PENGASINGAN UNTUNG RUGI ---

const l7_expenses = ['Faedah atas Modal', 'Gaji Pekongsi', 'Elaun'];
const l7_partners = ['Akaun Semasa Gan', 'Akaun Semasa Nirmala'];

const LEVEL_7_LABELS = [
  "Untung Bersih",
  "Tambah", "Faedah atas Ambilan",
  "Tolak", "Tolak", 
  ...l7_expenses,
  ...l7_partners
];

const LEVEL_7_STRUCTURE: RowConfig[] = [
  single('l7_ub', 'Untung Bersih', 'xx', 2),
  
  operatorRow('l7_add_fa', 'Tambah', 'Faedah atas Ambilan', 'x', 2, 0, { hasBottomBorder: true }),
  
  { id: 'l7_subtotal', zones: [], displayNumber: 'xx', columnIndex: 2, isSpacer: true },

  // Expenses Section - Modified to match "Angkutan Masuk" style (Operator + Item in same row)
  {
    id: 'l7_exp_1',
    zones: [
      { id: 'l7_less_op', expectedLabels: ['Tolak'], widthClass: 'w-20', placeholder: 'Tolak' },
      { id: 'l7_exp_zone_1', expectedLabels: l7_expenses, widthClass: 'flex-1', group: 'l7_exp' }
    ],
    displayNumber: 'x',
    columnIndex: 1,
    indent: 0
  },
  {
    id: 'l7_exp_2',
    zones: [
      { id: 'l7_exp_spacer_2', expectedLabels: [], widthClass: 'w-20', placeholder: '' },
      { id: 'l7_exp_zone_2', expectedLabels: l7_expenses, widthClass: 'flex-1', group: 'l7_exp' }
    ],
    displayNumber: 'x',
    columnIndex: 1,
    indent: 0
  },
  {
    id: 'l7_exp_3',
    zones: [
      { id: 'l7_exp_spacer_3', expectedLabels: [], widthClass: 'w-20', placeholder: '' },
      { id: 'l7_exp_zone_3', expectedLabels: l7_expenses, widthClass: 'flex-1', group: 'l7_exp' }
    ],
    displayNumber: 'x',
    columnIndex: 1,
    indent: 0,
    hasBottomBorder: true
  },
  
  { id: 'l7_exp_total', zones: [], displayNumber: '(xx)', columnIndex: 2, isSpacer: true, hasBottomBorder: true },
  
  { id: 'l7_distributable', zones: [], displayNumber: 'xx', columnIndex: 2, isSpacer: true },

  // Partners Section - Modified to match "Angkutan Masuk" style
  {
    id: 'l7_part_1',
    zones: [
      { id: 'l7_less_op_2', expectedLabels: ['Tolak'], widthClass: 'w-20', placeholder: 'Tolak' },
      { id: 'l7_part_zone_1', expectedLabels: l7_partners, widthClass: 'flex-1', group: 'l7_part' }
    ],
    displayNumber: 'x',
    columnIndex: 1,
    indent: 0
  },
  {
    id: 'l7_part_2',
    zones: [
      { id: 'l7_part_spacer_2', expectedLabels: [], widthClass: 'w-20', placeholder: '' },
      { id: 'l7_part_zone_2', expectedLabels: l7_partners, widthClass: 'flex-1', group: 'l7_part' }
    ],
    displayNumber: 'x',
    columnIndex: 1,
    indent: 0
  },
  {
    id: 'l7_part_total', zones: [], displayNumber: '(xx)', columnIndex: 2, isSpacer: true, hasBottomBorder: true },
  
  { id: 'l7_final', zones: [], displayNumber: '0', columnIndex: 2, isTotal: true, isSpacer: true }
];

// --- LEVEL 8: AKAUN SEMASA (LEDGER) ---

const l8_debit_swappable = ['Ambilan', 'Faedah atas Ambilan'];
const l8_credit_swappable = ['Gaji', 'Elaun', 'Faedah atas Pinjaman', 'Pengasingan Untung Rugi'];

const LEVEL_8_LABELS = [
  "Baki b/b (-)", "Baki b/b (+)", "Baki b/b",
  "Baki h/b",
  ...l8_debit_swappable,
  ...l8_credit_swappable
];

const LEVEL_8_STRUCTURE: RowConfig[] = [
  // Row 1: Opening Balances (Specific)
  ledgerRow('l8_r1', 
    { date: 'Jan 1', zone: { id: 'l8_bbal_dr', expectedLabels: ['Baki b/b (-)'], widthClass: 'w-full' }, col1: 'x', col2: 'x' }, 
    { date: 'Jan 1', zone: { id: 'l8_bbal_cr', expectedLabels: ['Baki b/b (+)'], widthClass: 'w-full' }, col1: 'x', col2: 'x' }
  ),
  // Row 2: Swappable Items
  ledgerRow('l8_r2', 
    { date: 'Dis 31', zone: { id: 'l8_d1', expectedLabels: l8_debit_swappable, widthClass: 'w-full', group: 'l8_dr' }, col1: 'x', col2: 'x' }, 
    { date: 'Dis 31', zone: { id: 'l8_c1', expectedLabels: l8_credit_swappable, widthClass: 'w-full', group: 'l8_cr' }, col1: 'x', col2: 'x' }
  ),
  // Row 3
  ledgerRow('l8_r3', 
    { date: '', zone: { id: 'l8_d2', expectedLabels: l8_debit_swappable, widthClass: 'w-full', group: 'l8_dr' }, col1: 'x', col2: 'x' }, 
    { date: '', zone: { id: 'l8_c2', expectedLabels: l8_credit_swappable, widthClass: 'w-full', group: 'l8_cr' }, col1: 'x', col2: 'x' }
  ),
  // Row 4: Closing Bal on Left (Moved Up)
  ledgerRow('l8_r4', 
    { date: '', zone: { id: 'l8_bhb', expectedLabels: ['Baki h/b'], widthClass: 'w-full' }, col1: 'xx', col2: 'xx' }, 
    { date: '', zone: { id: 'l8_c3', expectedLabels: l8_credit_swappable, widthClass: 'w-full', group: 'l8_cr' }, col1: 'x', col2: 'x' }
  ),
  // Row 5
  ledgerRow('l8_r5', 
    { date: '', staticLabel: '', col1: '', col2: '' }, // Empty Left
    { date: '', zone: { id: 'l8_c4', expectedLabels: l8_credit_swappable, widthClass: 'w-full', group: 'l8_cr' }, col1: 'x', col2: 'x' }
  ),
  // Row 6: Totals (Re-added)
  ledgerRow('l8_total', 
    { date: '', staticLabel: '', col1: 'xx', col2: 'xx' }, 
    { date: '', staticLabel: '', col1: 'xx', col2: 'xx' },
    { isTotal: true }
  ),
  // Row 7: Closing/Opening Next
  ledgerRow('l8_r6', 
    { date: '', staticLabel: '', col1: '', col2: '' }, 
    { date: 'Jan 1', zone: { id: 'l8_bbal_next', expectedLabels: ['Baki b/b'], widthClass: 'w-full' }, col1: 'xx', col2: 'xx' }
  )
];

// --- LEVEL 9: TITIK PULANG MODAL ---

const LEVEL_9_LABELS = [
  "Kos/Hasil (RM '000)", 
  "Jumlah Hasil", 
  "Jumlah Kos", 
  "Titik Pulang Modal", 
  "UNTUNG", 
  "RUGI", 
  "Kos Tetap", 
  "Pengeluaran ('000 unit)"
];

const LEVEL_9_GRAPH_ZONES: DropZoneConfig[] = [
  // Y-Axis Label (Inside Top Left)
  { id: 'g_y_axis', expectedLabels: ["Kos/Hasil (RM '000)"], widthClass: 'w-48', customStyle: { top: '0%', left: '2%' } },
  // X-Axis Label (Inside Bottom Right)
  { id: 'g_x_axis', expectedLabels: ["Pengeluaran ('000 unit)"], widthClass: 'w-56', customStyle: { bottom: '0%', right: '2%' } },
  
  // Lines (End of lines on right side)
  // Jumlah Hasil (Top Right)
  { id: 'g_jh', expectedLabels: ["Jumlah Hasil"], widthClass: 'w-32', customStyle: { top: '5%', right: '5%' } },
  // Jumlah Kos (Middle Right)
  { id: 'g_jk', expectedLabels: ["Jumlah Kos"], widthClass: 'w-32', customStyle: { top: '25%', right: '5%' } },
  // Kos Tetap (Bottom Right)
  { id: 'g_kt', expectedLabels: ["Kos Tetap"], widthClass: 'w-32', customStyle: { bottom: '25%', right: '5%' } },
  
  // Titik Pulang Modal (Left side, pointing to intersection)
  { id: 'g_tpm', expectedLabels: ["Titik Pulang Modal"], widthClass: 'w-40', customStyle: { top: '35%', left: '5%' } },
  
  // Areas
  // Untung (Top Middle)
  { id: 'g_untung', expectedLabels: ["UNTUNG"], widthClass: 'w-24', customStyle: { top: '15%', left: '45%' } },
  // Rugi (Bottom Left)
  { id: 'g_rugi', expectedLabels: ["RUGI"], widthClass: 'w-24', customStyle: { bottom: '15%', left: '15%' } }
];

// --- LEVEL 10: NISBAH KEWANGAN (FORMULAS) ---

const LEVEL_10_LABELS = [
  "Untung Kasar", "Kos Jualan", "Jualan Bersih", "Untung Bersih",
  "Modal Awal", "Aset Semasa", "Liabiliti Semasa",
  "Aset Semasa", "Inventori Akhir", 
  "Inventori Purata",
  "Akaun Belum Terima", "Jualan Kredit",
  "Akaun Belum Bayar", "Belian Kredit",
  "Inventori Awal", "Inventori Akhir" 
];

const LEVEL_10_STRUCTURE: RowConfig[] = [
  // 1. Tokokan (Alternative name)
  formulaRow('f_tokokan', 'Tokokan', 'Untung Kasar', 'Kos Jualan', 'x 100%'),
  // 2. Peratus Untung Kasar atas Kos Jualan (Standard name)
  formulaRow('f_puk_kj', 'Peratus Untung Kasar atas Kos Jualan', 'Untung Kasar', 'Kos Jualan', 'x 100%'),
  
  // 3. Margin Untung Kasar (Alternative name)
  formulaRow('f_margin_uk', 'Margin Untung Kasar', 'Untung Kasar', 'Jualan Bersih', 'x 100%'),
  // 4. Peratus Untung Kasar atas Jualan (Standard name)
  formulaRow('f_puk_j', 'Peratus Untung Kasar atas Jualan', 'Untung Kasar', 'Jualan Bersih', 'x 100%'),

  // 5. Margin Untung Bersih (Alternative name)
  formulaRow('f_margin_ub', 'Margin Untung Bersih', 'Untung Bersih', 'Jualan Bersih', 'x 100%'),
  // 6. Peratus Untung Bersih atas Jualan (Standard name)
  formulaRow('f_pub_j', 'Peratus Untung Bersih atas Jualan', 'Untung Bersih', 'Jualan Bersih', 'x 100%'),

  // 7. Pulangan atas Modal
  formulaRow('f_roc', 'Pulangan atas Modal', 'Untung Bersih', 'Modal Awal', 'x 100%'),
  
  // 8. Nisbah Semasa
  formulaRow('f_cr', 'Nisbah Semasa', 'Aset Semasa', 'Liabiliti Semasa'),
  
  // 9. Nisbah Ujian Asid
  formulaRow('f_qr', 'Nisbah Ujian Asid', '', 'Liabiliti Semasa', '', 
    {
      top: [0, ' - ', 1],
      bottom: [2]
    },
    [
      { id: 'f_qr_as', expectedLabels: ['Aset Semasa'], widthClass: 'w-36' },
      { id: 'f_qr_ia', expectedLabels: ['Inventori Akhir'], widthClass: 'w-36' },
      { id: 'f_qr_ls', expectedLabels: ['Liabiliti Semasa'], widthClass: 'w-64' }
    ]
  ),

  // 10. Kadar Pusing Ganti Inventori
  formulaRow('f_st', 'Kadar Pusing Ganti Inventori (bilangan kali)', 'Kos Jualan', 'Inventori Purata', ''),
  
  // 11. Inventori Purata
  formulaRow('f_avg_inv', 'Inventori Purata', '', '', '',
    {
      top: [0, ' + ', 1],
      bottom: ['2']
    },
    [
      { id: 'f_avg_inv_start', expectedLabels: ['Inventori Awal'], widthClass: 'w-40' },
      { id: 'f_avg_inv_end', expectedLabels: ['Inventori Akhir'], widthClass: 'w-40' }
    ]
  ),
  
  // 12. Tempoh Kutipan Hutang
  formulaRow('f_dcp', 'Tempoh Kutipan Hutang', 'Akaun Belum Terima', 'Jualan Kredit', 'x 365 hari'),
  
  // 13. Tempoh Pembayaran Hutang
  formulaRow('f_dpp', 'Tempoh Pembayaran Hutang', 'Akaun Belum Bayar', 'Belian Kredit', 'x 365 hari')
];


export const LEVELS: LevelConfig[] = [
  {
    title: "Akaun Perdagangan",
    subtitle: "Akaun Perdagangan bagi tahun berakhir 31 Mac 2016",
    labels: LEVEL_1_LABELS,
    structure: LEVEL_1_STRUCTURE,
    layoutType: 'statement'
  },
  {
    title: "Akaun Untung Rugi",
    subtitle: "Akaun Untung Rugi bagi tahun berakhir 31 Mac 2016",
    labels: LEVEL_2_LABELS,
    structure: LEVEL_2_STRUCTURE,
    layoutType: 'statement'
  },
  {
    title: "Akaun Perdagangan dan Untung Rugi",
    subtitle: "Akaun Perdagangan dan Untung Rugi bagi tahun berakhir 31 Mac 2016",
    labels: LEVEL_3_LABELS,
    structure: LEVEL_3_STRUCTURE,
    layoutType: 'statement'
  },
  {
    title: "Penyata Kedudukan Kewangan",
    subtitle: "Penyata Kedudukan Kewangan pada 31 Mac 2016",
    labels: LEVEL_4_LABELS,
    structure: LEVEL_4_STRUCTURE,
    layoutType: 'statement'
  },
  {
    title: "Akaun Perdagangan dan Untung Rugi (Pelarasan)",
    subtitle: "Akaun Perdagangan dan Untung Rugi bagi tahun berakhir 31 Disember 2016",
    labels: LEVEL_5_LABELS,
    structure: LEVEL_5_STRUCTURE,
    layoutType: 'statement'
  },
  {
    title: "Penyata Kedudukan Kewangan (Pelarasan)",
    subtitle: "Penyata Kedudukan Kewangan pada 31 Disember 2016",
    labels: LEVEL_6_LABELS,
    structure: LEVEL_6_STRUCTURE,
    layoutType: 'statement'
  },
  {
    title: "Akaun Pengasingan Untung Rugi",
    subtitle: "Akaun Pengasingan Untung Rugi bagi tahun berakhir 31 Disember 2017",
    labels: LEVEL_7_LABELS,
    structure: LEVEL_7_STRUCTURE,
    layoutType: 'statement'
  },
  {
    title: "Akaun Semasa (beruangan)",
    subtitle: "Akaun Semasa bagi tahun berakhir 31 Disember 2017",
    labels: LEVEL_8_LABELS,
    structure: LEVEL_8_STRUCTURE,
    layoutType: 'ledger'
  },
  {
    title: "Titik Pulang Modal",
    subtitle: "Analisis Titik Pulang Modal",
    labels: LEVEL_9_LABELS,
    structure: [], // Empty structure for graph
    graphZones: LEVEL_9_GRAPH_ZONES,
    layoutType: 'graph'
  },
  {
    title: "Nisbah Kewangan",
    subtitle: "Rumus Nisbah Kewangan",
    labels: LEVEL_10_LABELS,
    structure: LEVEL_10_STRUCTURE,
    layoutType: 'formula'
  }
];

export const ACCOUNT_STRUCTURE = LEVEL_1_STRUCTURE;
export const INITIAL_LABELS = LEVEL_1_LABELS;