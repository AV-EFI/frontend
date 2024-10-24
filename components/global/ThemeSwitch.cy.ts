import ThemeSwitch from './ThemeSwitch.vue';

describe('<ThemeSwitch />', () => {
        
    it('renders', () => {
        cy.mount(ThemeSwitch);
        cy.get('input.checkbox.theme-controller').should('exist');
        cy.get('label.swap.swap-rotate').should('exist');
        cy.get('#test-theme').should('exist');
        cy.get('svg.swap-off').should('exist');
        cy.get('svg.swap-on').should('exist');        
    });

    it('changes theme', () => {
        cy.mount(ThemeSwitch);
        cy.get('pre.hidden').should('have.text','avefi_light');
        cy.get('input.checkbox.theme-controller').uncheck({force: true});
        cy.get('pre.hidden').should('have.text','avefi_dark');
        cy.get('input.checkbox.theme-controller').check({force: true});
        cy.get('pre.hidden').should('have.text','avefi_light');
    });
});