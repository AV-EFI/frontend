/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ExportOptions, ExportSource, ExportTarget } from '~/models/interfaces/manual/dataExportInterfaces';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
    abstract class Exporter {
    abstract export(data: any[], target: ExportTarget, options?: ExportOptions): Promise<void>;
    }

    class CsvExporter extends Exporter {
        async export(data: any[], _target: ExportTarget, options?: ExportOptions): Promise<void> {
            // ✅ Lazy-load to avoid build-time resolution and SSR
            const mod = await import('export-to-csv');
            const mkConfig = (mod as any).mkConfig as (opts?: any) => any;
            const generateCsv = (mod as any).generateCsv as (cfg: any) => (rows: any[]) => string;
            const asString = (mod as any).asString as (v: unknown) => string;

            const csvConfig = mkConfig({
                filename: options?.filename || 'avefi-export',
                useKeysAsHeaders: true,
                fieldSeparator: ';',
                decimalSeparator: ',',
                // tweak as you like…
                ...options,
            });

            const csv = generateCsv(csvConfig)(data);
            const csvText = asString(csv);

            // Browser download
            const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${csvConfig.filename || 'export'}.csv`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    class DataExportPlugin {
        private exporters: { [key: string]: Exporter } = {
            csv: new CsvExporter(),
            // json: new JsonExporter(),
            // excel: new ExcelExporter(),
        };

        constructor(private readonly format: string) {}

        async export(source: ExportSource, target: ExportTarget, options: ExportOptions = {}): Promise<void> {
            const data = source.getData();
            const exporter = this.exporters[this.format];
            if (!exporter) throw new Error(`Unsupported format: ${this.format}`);
            await exporter.export(data, target, options);
        }
    }

    return {
        provide: {
            DataExportPlugin,
            Exporter,
            CsvExporter,
        },
    };
});
