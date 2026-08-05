/* eslint-disable */
export interface ExportTarget { 
    filePath: string;
}

export interface ExportOptions {
    filename?: string;
    useHeadersAsKeys?: boolean;
}

export interface ExportSource {
    getData(): any[];
}
