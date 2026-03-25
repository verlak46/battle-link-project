import { tabsRoutes } from './tabs.routes';

describe('tabsRoutes', () => {
  const children = tabsRoutes[0].children ?? [];

  it('should define a root route with TabsPage', async () => {
    expect(tabsRoutes[0].path).toBe('');
    expect(tabsRoutes[0].component).toBeTruthy();
  });

  it('should have 6 child routes (5 tabs + redirect)', () => {
    expect(children.length).toBe(6);
  });

  it('should include routes for home, explore, new, chat, profile', () => {
    const paths = children.map((r) => r.path);
    expect(paths).toContain('home');
    expect(paths).toContain('explore');
    expect(paths).toContain('new');
    expect(paths).toContain('chat');
    expect(paths).toContain('profile');
  });

  it('should redirect empty path to home', () => {
    const redirect = children.find((r) => r.path === '' && r.redirectTo);
    expect(redirect?.redirectTo).toBe('home');
  });

  it('tab routes should use loadComponent (lazy loading)', () => {
    const lazyRoutes = children.filter((r) => r.path !== '');
    lazyRoutes.forEach((r) => {
      expect(r.loadComponent).toBeDefined();
    });
  });
});
