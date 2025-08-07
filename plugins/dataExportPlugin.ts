/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ExportOptions, ExportSource, ExportTarget } from '~/models/interfaces/manual/dataExportInterfaces';
import { mkConfig, generateCsv, asString } from "export-to-csv";

export default defineNuxtPlugin(() => {
    
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

        async export(source: ExportSource, target: ExportTarget, _options: ExportOptions): Promise<void> {
            const data = source.getData();

            const exporter = this.exporters[this.format];
            if (!exporter) {
                throw new Error(`Unsupported format: ${this.format}`);
            }

            await exporter.export(data, target);
        }
    }

    class CsvExporter extends Exporter {
        async export(data: any[], _target: ExportTarget): Promise<void> {
            // implementation goes here
            const csvConfig = mkConfig({ useKeysAsHeaders: true });
            const csv = generateCsv(csvConfig)(data);
            const _filename = `${csvConfig.filename}.csv`;
            const _csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

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