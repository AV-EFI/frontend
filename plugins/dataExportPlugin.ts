import type { ExportOptions, ExportSource, ExportTarget } from '../models/interfaces/dataExportInterfaces';
//import type { ExportTarget } from './dataExportInterfaces';
//import { JsonExporter } from './json-exporter';
//import { ExcelExporter } from './excel-exporter';
import { mkConfig, generateCsv, asString } from "export-to-csv";

export default defineNuxtPlugin((nuxtApp) => {
    
    abstract class Exporter {
      abstract export(data: any[], target: ExportTarget): Promise<void>;
    }

    class DataExportPlugin {
        private exporters: { [key: string]: Exporter } = {
            csv: new CsvExporter()
        //json: new JsonExporter(),
        //excel: new ExcelExporter(),
        };

        constructor(private readonly format: string) {}

        async export(source: ExportSource, target: ExportTarget, options: ExportOptions): Promise<void> {
            const data = source.getData();

            const exporter = this.exporters[this.format];
            if (!exporter) {
                throw new Error(`Unsupported format: ${this.format}`);
            }

            await exporter.export(data, target);
        }
    }

    class CsvExporter extends Exporter {
        async export(data: any[], target: ExportTarget): Promise<void> {
            // implementation goes here
            const csvConfig = mkConfig({ useKeysAsHeaders: true });
            const csv = generateCsv(csvConfig)(data);
            const filename = `${csvConfig.filename}.csv`;
            const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

            // Write the csv file to disk
        }
    }

    return {
        provide: { 
            DataExportPlugin: DataExportPlugin,
            Exporter: Exporter,
            CsvExporter: CsvExporter
        }
    };
});