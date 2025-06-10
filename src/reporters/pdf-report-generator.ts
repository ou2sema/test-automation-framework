import PDFDocument from 'pdfkit';
import fs from 'fs';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { CustomWorld } from '../support/world';
import { Logger } from '../utils/logger';
import fsExtra from 'fs-extra';
const logger = new Logger('PDFReport');

export async function generatePdfReport(world: CustomWorld, scenarioStatuses: any[]) {
  await fsExtra.ensureDir('reports/pdf');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = `reports/pdf/test-report-${timestamp}.pdf`;
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(reportPath));

  const symbolMap: Record<string, string> = {
    PASSED: '[PASS]',
    FAILED: '[FAIL]',
    PENDING: '[PENDING]',
    UNDEFINED: '[PENDING]',
  };

  const passed = scenarioStatuses.filter(s => s.status === 'PASSED').length;
  const failed = scenarioStatuses.filter(s => s.status === 'FAILED').length;
  const pending = scenarioStatuses.filter(s => s.status === 'PENDING' || s.status === 'UNDEFINED').length;
  const total = scenarioStatuses.length;

  // Title
  doc.fontSize(20).text('TEST EXECUTION REPORT', { align: 'center', underline: true });
  doc.moveDown();

  // Metadata
  doc.fontSize(12).text(`Execution Date: ${new Date().toLocaleString()}`);
  doc.text(`Environment: ${world.environment.baseUrl}`);
  doc.text(`Browser: ${world.browserType} ${world.headless ? '(Headless)' : ''}`);
  doc.text(`User: ${world.environment.credentials.user.username}`);
  doc.moveDown();

  // Summary Section
  doc.fontSize(16).text('Summary', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12)
    .text(`Passed: ${passed} (${((passed / total) * 100).toFixed(1)}%)`)
    .text(`Failed: ${failed} (${((failed / total) * 100).toFixed(1)}%)`)
    .text(`Pending/Undefined: ${pending} (${((pending / total) * 100).toFixed(1)}%)`)
    .text(`Total Scenarios: ${total}`);
  doc.moveDown();

  // Pie Chart
  const width = 400;
  const height = 300;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const config = {
    type: 'pie' as const,
    data: {
      labels: ['Passed', 'Failed', 'Pending/Undefined'],
      datasets: [{
        data: [passed, failed, pending],
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107']
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' },
        title: {
          display: true,
          text: 'Test Results Distribution'
        }
      }
    }
  };
 
  const chartImage = await chartJSNodeCanvas.renderToBuffer(config as any);
  doc.image(chartImage, { width: 400, align: 'center' });
  doc.moveDown(2);

  // Scenario Details
  doc.fontSize(16).text('Scenario Details', { underline: true });
  doc.moveDown(0.5);

  scenarioStatuses.forEach((scenario) => {
    const status = scenario.status;
    const symbol = symbolMap[status] || '[INFO]';
    const color = status === 'PASSED' ? 'green' : status === 'FAILED' ? 'red' : 'orange';

    doc.fillColor(color).fontSize(12).text(`${symbol} ${scenario.name} - ${status} (${scenario.duration}ms)`);
    doc.fillColor('black');

    if (scenario.error) {
      doc.fontSize(10).text(`Error: ${scenario.error}`, { indent: 20 });
    }

    if (scenario.screenshot) {
      try {
        doc.text('Screenshot:', { indent: 20 });
        doc.image(scenario.screenshot, {
          width: 400,
          align: 'center'
        });
        doc.moveDown();
      } catch (e) {
        if (e instanceof Error) {
          logger.error(`Failed to embed screenshot: ${e.message}`);
        } else {
          logger.error(`Failed to embed screenshot: ${JSON.stringify(e)}`);
        }
      }
    }

    doc.moveDown();
  });

  // Legend
  doc.moveDown(2);
  doc.fontSize(10).text('LEGEND:', { underline: true });
  doc.text('[PASS] Passed   [FAIL] Failed   [PENDING] Pending/Undefined');
  doc.moveDown(3);
doc.fontSize(12).fillColor('gray').text('Generated and signed by:', { align: 'left' });
doc.moveDown(0.5);
doc.fontSize(14).fillColor('black').text('Oussema Haj Abdallah', { align: 'left' });

  doc.end();

  logger.info(`PDF report generated: ${reportPath}`);
  return reportPath;
}
