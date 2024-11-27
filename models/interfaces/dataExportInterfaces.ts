export interface ExportTarget { 
    filePath: string;
}

export interface ExportOptions {
    useHeadersAsKeys: boolean;
}

export interface ExportSource {
    getData(): any[];
}