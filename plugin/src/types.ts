export interface ColorScheme {
    primary: string;
    accent: string;
    gradient: string;
    tag: string;
    bar: string[];
}

export interface NoteDashboardSettings {
    exclude: string[];
    planPath: string;
    heatLevels: number[];
    heatWeeks: number;
    monthCount: number;
    dayCount: number;
    folderTopN: number;
    maxOpen: number;
    taskTags: string[];
    dueEmoji: string;
    estThreshold: number;
    estCoeff: number;
    colorScheme: string;
    sectionOrder: string[];
}
