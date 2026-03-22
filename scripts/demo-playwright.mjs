import fs from 'node:fs';
import { chromium } from 'playwright';

const baseUrl = process.env.DEMO_BASE_URL || 'http://127.0.0.1:4173';
const screenshotDir = 'demo-screenshots';
const demoRunId = Date.now();
const demoStudentName = `Демо Студент ${demoRunId}`;
const demoStudentEmail = `demo.student.${demoRunId}@example.com`;

fs.mkdirSync(screenshotDir, { recursive: true });

async function clickMenu(page, label) {
  await page.locator('button').filter({ hasText: label }).first().click();
}

async function selectRadixOption(trigger, optionText, page) {
  await trigger.click();
  await page.getByRole('option', { name: optionText }).click();
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1400 } });

try {
  console.log('Opening login page...');
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.waitForTimeout(1500);
  await page.getByRole('heading', { name: 'Dashboard' }).waitFor();
  await page.screenshot({ path: `${screenshotDir}/01-dashboard.png`, fullPage: true });
  console.log('Dashboard loaded.');

  console.log('Adding a new student...');
  await clickMenu(page, 'Студенты');
  await page.getByRole('button', { name: 'Добавить студента' }).click();
  await page.locator('#fullName').fill(demoStudentName);
  await page.locator('#email').fill(demoStudentEmail);
  await page.locator('#phone').fill('+7 (999) 777-77-77');
  await page.locator('#telegram').fill('@demo_student');
  await page.locator('#birthDate').fill('2004-04-20');
  await page.locator('#course').fill('2');
  await page.locator('#gpa').fill('4.4');
  await page.locator('#yearEnrolled').fill('2024');
  await page.locator('#portfolioUrl').fill('https://github.com/demo-student');
  await page.locator('#experience').fill('Участвовал в учебных проектах по аналитике данных и веб-разработке.');
  await page.locator('#preferences').fill('data analytics, frontend');
  await page.locator('#note').fill('Добавлен через автоматическую демонстрацию.');

  const dialog = page.locator('[data-slot="dialog-content"]').last();
  await dialog.locator('label').filter({ hasText: 'Русский' }).click();
  await dialog.locator('label').filter({ hasText: 'Английский' }).click();
  await dialog.locator('label').filter({ hasText: 'Python' }).click();
  await dialog.locator('label').filter({ hasText: 'React' }).click();
  await dialog.locator('label').filter({ hasText: 'Коммуникация' }).click();
  await dialog.locator('label').filter({ hasText: 'Работа в команде' }).click();

  await page.getByRole('button', { name: 'Сохранить студента' }).click();
  await page.getByRole('cell', { name: demoStudentName }).waitFor();
  await page.screenshot({ path: `${screenshotDir}/02-students.png`, fullPage: true });
  console.log('Student added.');

  console.log('Checking compare page...');
  await clickMenu(page, 'Сравнение');
  const compareSelects = page.locator('[data-slot="select-trigger"]');
  await selectRadixOption(compareSelects.nth(0), demoStudentName, page);
  await selectRadixOption(compareSelects.nth(1), 'Иванов Иван Иванович', page);
  await page.getByText('Короткие выводы').waitFor();
  await page.screenshot({ path: `${screenshotDir}/03-compare.png`, fullPage: true });
  console.log('Compare page rendered.');

  console.log('Adding a consent...');
  await clickMenu(page, 'Согласия');
  await page.getByRole('button', { name: 'Добавить согласие' }).click();
  const consentDialog = page.locator('[data-slot="dialog-content"]').last();
  await selectRadixOption(consentDialog.locator('[data-slot="select-trigger"]').first(), demoStudentName, page);
  await consentDialog.locator('#consentType').fill('Публикация достижений');
  await consentDialog.locator('#consentDate').fill('2026-03-20');
  await page.getByRole('button', { name: 'Сохранить' }).click();
  await page.getByRole('cell', { name: demoStudentName }).waitFor();
  await page.screenshot({ path: `${screenshotDir}/04-consents.png`, fullPage: true });
  console.log('Consent added.');

  console.log('Demo completed successfully.');
} finally {
  await browser.close();
}
