import { Routes } from '@angular/router';

import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AdminAuthLayoutComponent } from './layout/admin-auth-layout/admin-auth-layout.component';
import { AdminShellLayoutComponent } from './layout/admin-shell-layout/admin-shell-layout.component';
import { PublicHomePageComponent } from './pages/public-home/public-home.page';
import { AdminLoginPageComponent } from './pages/admin-login/admin-login.page';
import { AdminOverviewPageComponent } from './pages/admin-overview/admin-overview.page';
import { AdminCemeteriesPageComponent } from './pages/admin-cemeteries/admin-cemeteries.page';
import { AdminStructurePageComponent } from './pages/admin-structure/admin-structure.page';
import { AdminBurialLocationsPageComponent } from './pages/admin-burial-locations/admin-burial-locations.page';
import { AdminBurialCasesPageComponent } from './pages/admin-burial-cases/admin-burial-cases.page';
import { AdminRemainsMovementsPageComponent } from './pages/admin-remains-movements/admin-remains-movements.page';
import { AdminDataQualityPageComponent } from './pages/admin-data-quality/admin-data-quality.page';
import { AdminOperationFlowPageComponent } from './pages/admin-operation-flow/admin-operation-flow.page';
import { adminAuthGuard } from './core/guards/admin-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [{ path: '', component: PublicHomePageComponent }]
  },
  {
    path: 'admin/login',
    component: AdminAuthLayoutComponent,
    children: [{ path: '', component: AdminLoginPageComponent }]
  },
  {
    path: 'admin',
    component: AdminShellLayoutComponent,
    canActivate: [adminAuthGuard],
    children: [
      { path: '', component: AdminOverviewPageComponent },
      { path: 'overview', component: AdminOverviewPageComponent },
      { path: 'cemeteries', component: AdminCemeteriesPageComponent },
      { path: 'structure', component: AdminStructurePageComponent },
      { path: 'burial-locations', component: AdminBurialLocationsPageComponent },
      { path: 'burial-cases', component: AdminBurialCasesPageComponent },
      { path: 'remains-movements', component: AdminRemainsMovementsPageComponent },
      { path: 'operation-flow', component: AdminOperationFlowPageComponent },
      { path: 'data-quality', component: AdminDataQualityPageComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
