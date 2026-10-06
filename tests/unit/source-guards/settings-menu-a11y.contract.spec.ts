import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');
const themeSwitch = read('components/global/ThemeSwitch.vue');
const languageSwitch = read('components/global/LanguageSwitch.vue');
const settingsMenu = read('components/global/SettingsMenu.vue');
const headerMenu = read('components/global/HeaderMenu.vue');
const navItem = read('components/global/NavItem.vue');
const navBar = read('components/global/NavBar.vue');
const indexPage = read('pages/index.vue');

describe('Settings menu and header keyboard accessibility contract guards', () => {
  test('theme and language switches are real buttons, not display:none checkboxes', () => {
    for (const source of [themeSwitch, languageSwitch]) {
      expect(source).toContain('<button');
      expect(source).toContain('type="button"');
      expect(source).not.toContain('type="checkbox"');
      expect(source).not.toMatch(/class="[^"]*\bhidden\b/);
    }
  });

  test('theme switch names the action from the active theme and shows the target mode icon', () => {
    expect(themeSwitch).toContain("isLight ? $t('switchToDarkMode') : $t('switchToLightMode')");
    expect(themeSwitch).toContain("isLight ? 'tabler:moon' : 'tabler:sun'");
    expect(themeSwitch).toContain("getAttribute('data-theme')");
  });

  test('settings and user menus are disclosures with real expanded state, Escape and descriptive panel labels', () => {
    expect(headerMenu).toContain(':aria-expanded="open"');
    expect(headerMenu).toContain(':aria-controls="panelId"');
    expect(headerMenu).toContain('@keydown.esc');
    expect(settingsMenu).toContain("$t('settingsMenuPanel')");
    expect(headerMenu).not.toContain('role="menu"');
    expect(navBar).not.toContain("$t('moreOptions')");
  });

  test('every header entry has an icon and a visible text label', () => {
    expect(navItem).toContain('<Icon :name="icon"');
    expect(navItem).toContain('<span>{{ label }}</span>');
    expect(headerMenu).toContain('<Icon :name="icon"');
    expect(headerMenu).toContain('<span>{{ label }}</span>');
    expect(navBar).not.toContain('btn-circle');
    expect(navBar).not.toContain('MicroSendMailButt');
    expect(navBar).toContain(":label=\"$t('login')\"");
    expect(navItem).toContain('aria-current');
  });

  test('header navigation is server-rendered so it exists before hydration; only state-dependent items are client-only', () => {
    expect(navBar).not.toMatch(/<ClientOnly>\s*<div class="container/);
    expect(navBar).toContain('authItemRef');
    expect(navBar).toContain('<ClientOnly>');
  });

  test('autofocus stays but never steals focus from a user who already moved it', () => {
    expect(indexPage).toContain('if (canAutoFocus()) focusFirstInput()');
    expect(read('components/search/QueryAutocompleteCore.vue')).toContain('if (canAutoFocus()) focusInput()');
    expect(read('utils/autoFocusGuard.ts')).toContain('document.activeElement');
  });
});
